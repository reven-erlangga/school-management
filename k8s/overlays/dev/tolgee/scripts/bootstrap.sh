#!/bin/sh
set -euo pipefail

TOLGEE_URL="${TOLGEE_URL:-http://tolgee}"
VAULT_ADDR="${VAULT_ADDR:-http://vault:8200}"
NAMESPACE="${NAMESPACE:-school-management-dev}"

ADMIN_USER="${TOLGEE_AUTHENTICATION_INITIAL_USERNAME:-admin}"
ADMIN_PASS="${TOLGEE_AUTHENTICATION_INITIAL_PASSWORD:-}"

SA_HOST="${KUBERNETES_SERVICE_HOST:-kubernetes.default.svc}"
SA_PORT="${KUBERNETES_SERVICE_PORT:-443}"
SA_TOKEN="$(cat /var/run/secrets/kubernetes.io/serviceaccount/token 2>/dev/null || true)"
SA_CA="/var/run/secrets/kubernetes.io/serviceaccount/ca.crt"

if [ -n "$SA_TOKEN" ]; then
  code="$(curl -sS --cacert "$SA_CA" -o /dev/null -w "%{http_code}" \
    -H "Authorization: Bearer ${SA_TOKEN}" \
    "https://${SA_HOST}:${SA_PORT}/apis/apps/v1/namespaces/${NAMESPACE}/deployments/tolgee" || true)"
  if [ "$code" = "404" ]; then
    echo "Tolgee deployment not found in namespace ${NAMESPACE}, skipping Tolgee bootstrap."
    exit 0
  fi
  if [ "$code" -lt 200 ] || [ "$code" -ge 300 ]; then
    echo "Unable to check Tolgee deployment via Kubernetes API (HTTP ${code})." >&2
    exit 1
  fi
fi

if [ -z "$ADMIN_PASS" ]; then
  echo "Missing TOLGEE_AUTHENTICATION_INITIAL_PASSWORD in environment" >&2
  exit 1
fi

echo "Waiting for Tolgee to be healthy at ${TOLGEE_URL} ..."
healthy="0"
for i in $(seq 1 120); do
  status="$(curl -fsS --connect-timeout 2 --max-time 5 "${TOLGEE_URL%/}/actuator/health" 2>/dev/null | sed -n 's/.*\"status\"[[:space:]]*:[[:space:]]*\"\([A-Za-z]*\)\".*/\1/p' || true)"
  if [ "$status" = "UP" ] || [ "$status" = "ok" ] || [ "$status" = "OK" ]; then
    echo "Tolgee is healthy"
    healthy="1"
    break
  fi
  sleep 2
done
if [ "$healthy" != "1" ]; then
  echo "Tolgee is not healthy after 240s, aborting bootstrap." >&2
  exit 1
fi

echo "Logging in to Tolgee ..."
JWT="$(curl -sS -X POST -H 'Content-Type: application/json' \
  -d "{\"username\":\"${ADMIN_USER}\",\"password\":\"${ADMIN_PASS}\"}" \
  "${TOLGEE_URL%/}/api/public/generatetoken" | jq -r '.accessToken // .token // empty')"

if [ -z "$JWT" ]; then
  echo "Failed to obtain Tolgee JWT" >&2
  exit 1
fi

tolgee_request() {
  method="$1"
  path="$2"
  body="${3:-}"
  url="${TOLGEE_URL%/}${path}"
  if [ -n "$body" ]; then
    code="$(curl -sS -o /tmp/tolgee.json -w "%{http_code}" -H "Authorization: Bearer ${JWT}" -H "Content-Type: application/json" -X "$method" -d "$body" "$url")"
  else
    code="$(curl -sS -o /tmp/tolgee.json -w "%{http_code}" -H "Authorization: Bearer ${JWT}" -H "Content-Type: application/json" -X "$method" "$url")"
  fi
  if [ "$code" -lt 200 ] || [ "$code" -ge 300 ]; then
    echo "Tolgee request failed: ${method} ${url} (${code})" >&2
    cat /tmp/tolgee.json >&2 || true
    return 1
  fi
  return 0
}

tolgee_request_apikey() {
  method="$1"
  path="$2"
  body="${3:-}"
  url="${TOLGEE_URL%/}${path}"
  if [ -n "$body" ]; then
    code="$(curl -sS -o /tmp/tolgee.json -w "%{http_code}" -H "X-API-Key: ${TOLGEE_API_KEY}" -H "Content-Type: application/json" -X "$method" -d "$body" "$url")"
  else
    code="$(curl -sS -o /tmp/tolgee.json -w "%{http_code}" -H "X-API-Key: ${TOLGEE_API_KEY}" -H "Content-Type: application/json" -X "$method" "$url")"
  fi
  if [ "$code" -lt 200 ] || [ "$code" -ge 300 ]; then
    echo "Tolgee request failed: ${method} ${url} (${code})" >&2
    cat /tmp/tolgee.json >&2 || true
    return 1
  fi
  return 0
}

vault_request() {
  method="$1"
  url="$2"
  body="${3:-}"
  if [ -n "$body" ]; then
    code="$(curl -sS -o /tmp/vault.json -w "%{http_code}" -H "X-Vault-Token: ${VAULT_TOKEN}" -H "Content-Type: application/json" -X "$method" -d "$body" "$url")"
  else
    code="$(curl -sS -o /tmp/vault.json -w "%{http_code}" -H "X-Vault-Token: ${VAULT_TOKEN}" -H "Content-Type: application/json" -X "$method" "$url")"
  fi
  if [ "$code" -lt 200 ] || [ "$code" -ge 300 ]; then
    echo "Vault request failed: ${method} ${url} (${code})" >&2
    cat /tmp/vault.json >&2 || true
    exit 1
  fi
}

ensure_vault_kv_v2() {
  if [ -z "${VAULT_TOKEN:-}" ]; then
    echo "VAULT_TOKEN not provided, skipping Vault integration"
    return 0
  fi
  echo "Checking Vault health at ${VAULT_ADDR} ..."
  curl -sS "${VAULT_ADDR%/}/v1/sys/health" >/dev/null

  mounts_code="$(curl -sS -o /tmp/mounts.json -w "%{http_code}" -H "X-Vault-Token: ${VAULT_TOKEN}" "${VAULT_ADDR%/}/v1/sys/mounts")"
  if [ "$mounts_code" -lt 200 ] || [ "$mounts_code" -ge 300 ]; then
    echo "Unable to list Vault mounts (${mounts_code})" >&2
    cat /tmp/mounts.json >&2 || true
    exit 1
  fi

  if grep -q '"kv/"' /tmp/mounts.json; then
    echo "Vault KV mount kv/ exists"
    return 0
  fi

  echo "Enabling Vault KV v2 at kv/ ..."
  vault_request "POST" "${VAULT_ADDR%/}/v1/sys/mounts/kv" '{"type":"kv","options":{"version":"2"}}'
}

create_pat() {
  expires_at="$(($(date +%s) * 1000 + 315360000000))"
  body="$(jq -nc --arg d "k8s-bootstrap" --argjson e "$expires_at" '{description:$d, expiresAt:$e}')"
  if ! tolgee_request "POST" "/v2/pats" "$body"; then
    echo "Failed to create PAT token" >&2
    exit 1
  fi
  pat="$(jq -r '..|strings|select(startswith("tgpat_"))' /tmp/tolgee.json | head -n1 || true)"
  if [ -z "$pat" ]; then
    echo "PAT token not found in response" >&2
    cat /tmp/tolgee.json >&2 || true
    exit 1
  fi
  echo "$pat"
}

get_org_id() {
  if tolgee_request_apikey "GET" "/v2/organizations"; then
    jq -r '((._embedded.organizations // .organizations // ._embedded.organizationDtos // []) | .[0].id // empty)' /tmp/tolgee.json
    return 0
  fi
  echo ""
}

create_or_find_project() {
  slug="$1"
  name="$2"
  proj_id=""

  # Use PAT if available (tolgee_request_apikey), otherwise admin JWT (tolgee_request)
  # But PAT usually can't delete projects unless it's a super-PAT. Admin JWT (from login) is safer for deletion.
  if tolgee_request "GET" "/v2/projects?search=${slug}"; then
    # Debug output to see what we got
    cat /tmp/tolgee.json >&2
    proj_id="$(jq -r '((._embedded.projects // .projects // []) | map(select(.slug=="'"${slug}"'")) | .[0].id) // empty' /tmp/tolgee.json)"
  fi

  if [ -n "$proj_id" ] && [ "$proj_id" != "null" ]; then
    echo "Project ${slug} already exists (id: ${proj_id}). Deleting to recreate fresh..."
    # DELETE requires Super JWT or PAT with high privileges. 
    # If the current PAT fails, we might need to authenticate as admin again to get a fresh super token?
    # Actually, tolgee_login returns a JWT that expires. We should ensure we use it.
    # But wait, tolgee_request uses 'Authorization: Bearer <JWT>' if TOLGEE_TOKEN is set.
    # Our tolgee_login sets TOLGEE_TOKEN from /v2/public/authentication/login response.
    # Let's try to re-login if needed, or use the JWT directly.
    
    if ! tolgee_request "DELETE" "/v2/projects/${proj_id}"; then
       echo "Failed to delete project ${proj_id}. Trying to re-login as admin..."
       tolgee_login
       tolgee_request "DELETE" "/v2/projects/${proj_id}" || true
    fi
    proj_id=""
  fi

  if [ -z "$proj_id" ] || [ "$proj_id" = "null" ]; then
    # Project not found, create it
    body="$(cat <<EOF
{"name":"${name}","slug":"${slug}","baseLanguageTag":"en",
 "languages":[{"tag":"en","name":"English","originalName":"English","flagEmoji":"🇬🇧"},
              {"tag":"id","name":"Indonesian","originalName":"Bahasa Indonesia","flagEmoji":"🇮🇩"}],
 "icuPlaceholders":true}
EOF
)"
    org_id="$(get_org_id)"
    if [ -z "$org_id" ]; then
      echo "Unable to resolve organizationId for creating project ${slug}" >&2
      return 1
    fi

    body2="$(echo "$body" | jq -c '. + {"organizationId":'"$org_id"'}')"
    if tolgee_request "POST" "/v2/projects" "$body2"; then
      proj_id="$(jq -r '.id // .projectId // empty' /tmp/tolgee.json)"
    fi
  fi
  
  if [ -n "$proj_id" ] && [ "$proj_id" != "null" ]; then
    # Ensure languages 'id' and 'en' exist in the project (idempotent check not strictly needed if we just try create)
    # But to be safe, let's try to add them if missing.
    # Actually simpler: just try to create language 'id' if not exists.
    
    # Try to add 'id' language (Indonesian)
    lang_body='{"tag":"id","name":"Indonesian","originalName":"Bahasa Indonesia","flagEmoji":"🇮🇩"}'
    tolgee_request_apikey "POST" "/v2/projects/${proj_id}/languages" "$lang_body" >/dev/null 2>&1 || true

    # Enable Machine Translation providers for Indonesian (id)
    # Target language ID usually matches the tag if not specified, but let's get language ID first
    # Or enable per project basis in v2.
    # Endpoint: PUT /v2/projects/{projectId}/machine-translation-service-settings
    # We enable GOOGLE, AWS, DEEPL for all languages
    mt_body='{"settings":[{"serviceType":"GOOGLE","primary":true},{"serviceType":"AWS","primary":false},{"serviceType":"DEEPL","primary":false}]}'
    tolgee_request_apikey "PUT" "/v2/projects/${proj_id}/machine-translation-service-settings" "$mt_body" >/dev/null 2>&1 || true
    
    # Also enable auto-translation for 'id' language if needed (using PUT /v2/projects/{projectId}/languages/{languageId}/auto-translation-settings)
    # First get language id for 'id' tag
    if tolgee_request_apikey "GET" "/v2/projects/${proj_id}/languages?size=100"; then
      lang_id_id="$(jq -r '((._embedded.languages // []) | map(select(.tag=="id")) | .[0].id) // empty' /tmp/tolgee.json)"
      if [ -n "$lang_id_id" ]; then
         # Enable auto-translation using translation memory and machine translation
         auto_body='{"usingTranslationMemory":true,"usingMachineTranslation":true}'
         tolgee_request_apikey "PUT" "/v2/projects/${proj_id}/languages/${lang_id_id}/auto-translation-settings" "$auto_body" >/dev/null 2>&1 || true
      fi
    fi

    echo "$proj_id"
    return 0
  fi

  echo "Failed to create/find project ${slug}" >&2
  return 1
}

create_project_api_key() {
  project_id="$1"
  
  # Delete existing keys with description "k8s-bootstrap-key"
  if tolgee_request "GET" "/v2/projects/${project_id}/api-keys"; then
    existing_ids="$(jq -r '((._embedded.apiKeys // []) | map(select(.description=="k8s-bootstrap-key")) | .[].id) // empty' /tmp/tolgee.json)"
    for id in $existing_ids; do
       echo "Deleting existing bootstrap key ${id} for project ${project_id}..." >&2
       tolgee_request "DELETE" "/v2/api-keys/${id}" || true
     done
  fi

  scopes='["translations.view","translations.edit","keys.edit","keys.create","screenshots.view","screenshots.upload","activity.view"]'
  body="$(jq -nc --argjson p "$project_id" --argjson s "$scopes" '{projectId:$p, scopes:$s, description:"k8s-bootstrap-key"}')"
  
  # Use JWT auth (tolgee_request) to create API key
  if tolgee_request "POST" "/v2/api-keys" "$body"; then
     key="$(jq -r '.key // empty' /tmp/tolgee.json)"
     if [ -n "$key" ]; then echo "$key"; return 0; fi
  fi
  
  echo "Failed to create project API key for project $project_id" >&2
  return 1
}

apply_k8s_secret() {
  name="$1"
  json="$2"
  SA_HOST="${KUBERNETES_SERVICE_HOST:-kubernetes.default.svc}"
  SA_PORT="${KUBERNETES_SERVICE_PORT:-443}"
  TOKEN="$(cat /var/run/secrets/kubernetes.io/serviceaccount/token)"
  CA="/var/run/secrets/kubernetes.io/serviceaccount/ca.crt"
  # Try PUT, else POST
  code="$(curl -sS --cacert "$CA" -H "Authorization: Bearer ${TOKEN}" -H "Content-Type: application/json" \
    -o /dev/null -w "%{http_code}" -X PUT "https://${SA_HOST}:${SA_PORT}/api/v1/namespaces/${NAMESPACE}/secrets/${name}" \
    -d "$json" || true)"
  if [ "$code" = "404" ]; then
    curl -sS --cacert "$CA" -H "Authorization: Bearer ${TOKEN}" -H "Content-Type: application/json" \
      -X POST "https://${SA_HOST}:${SA_PORT}/api/v1/namespaces/${NAMESPACE}/secrets" -d "$json" >/dev/null
  fi
}

write_vault_kv() {
  app="$1"
  url="${VAULT_ADDR%/}/v1/kv/data/${app}"
  if [ -z "${VAULT_TOKEN:-}" ]; then
    echo "VAULT_TOKEN not provided, skipping Vault write for ${app}"
    return 0
  fi
  vault_request "POST" "$url" "$2"
}

ensure_vault_kv_v2

echo "Creating Tolgee PAT token..."
TOLGEE_API_KEY="$(create_pat)"
echo "Tolgee PAT token created"

for APP in portal landing; do
  echo "Ensuring Tolgee project for ${APP} ..."
  PROJ_ID="$(create_or_find_project "$APP" "$APP")"
  echo "Project ${APP} id: ${PROJ_ID}"
  
  echo "Generating Project API Key for ${APP} ..."
  PROJ_API_KEY="$(create_project_api_key "${PROJ_ID}")"
  echo "Project API Key created: ${PROJ_API_KEY}"

  SECRET_NAME="tolgee-config-${APP}"
  SECRET_JSON="$(cat <<EOF
{"apiVersion":"v1","kind":"Secret","metadata":{"name":"${SECRET_NAME}","namespace":"${NAMESPACE}"},
 "type":"Opaque",
 "stringData":{"TOLGEE_API_URL":"${TOLGEE_URL}","TOLGEE_API_KEY":"${PROJ_API_KEY}","TOLGEE_PROJECT_ID":"${PROJ_ID}"}}
EOF
)"
  apply_k8s_secret "$SECRET_NAME" "$SECRET_JSON"

  DATA_JSON="$(cat <<EOF
{"data":{"TOLGEE_API_URL":"${TOLGEE_URL}","TOLGEE_API_KEY":"${PROJ_API_KEY}","TOLGEE_PROJECT_ID":"${PROJ_ID}"}}
EOF
)"
  write_vault_kv "$APP" "$DATA_JSON"
done

echo "Tolgee bootstrap finished."
