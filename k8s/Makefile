SHELL := /bin/bash
.DEFAULT_GOAL := run

run:
	@bash -c '\
	set -e; \
	env="$$ENV"; \
	if [ -z "$$env" ]; then read -p "Environment (dev/prod): " env; fi; \
	if [ "$$env" != "dev" ] && [ "$$env" != "prod" ]; then echo "Invalid environment"; exit 1; fi; \
	ns="school-management-$$env"; \
	if ! kubectl get namespace $$ns >/dev/null 2>&1; then \
	  echo "Namespace $$ns not found. Creating..."; \
	  kubectl create namespace $$ns; \
	fi; \
	echo "Cleaning up old jobs..."; \
	kubectl -n $$ns delete job tolgee-bootstrap prisma-migrate --ignore-not-found=true; \
	kubectl -n $$ns delete pods -l job-name=tolgee-bootstrap --ignore-not-found=true --force --grace-period=0 >/dev/null 2>&1 || true; \
	kubectl -n $$ns delete pods -l job-name=prisma-migrate --ignore-not-found=true --force --grace-period=0 >/dev/null 2>&1 || true; \
	if ! kubectl -n $$ns get secret ghcr-cred >/dev/null 2>&1; then \
	  read -p "GHCR username (enter to skip): " ghuser; \
	  if [ -n "$$ghuser" ]; then \
	    read -s -p "GHCR PAT (read:packages): " ghpat; echo ""; \
	    read -p "Email: " ghemail; \
	    kubectl -n $$ns create secret docker-registry ghcr-cred --docker-server=ghcr.io --docker-username="$$ghuser" --docker-password="$$ghpat" --docker-email="$$ghemail"; \
	  fi; \
	fi; \
	kubectl apply -k overlays/$$env; \
	if kubectl -n $$ns get deploy tolgee >/dev/null 2>&1 && kubectl -n $$ns get job tolgee-bootstrap >/dev/null 2>&1; then \
	  echo "Waiting for Tolgee bootstrap to complete (up to 300s)..."; \
	  if kubectl -n $$ns wait --for=condition=complete job/tolgee-bootstrap --timeout=300s >/dev/null 2>&1; then \
	    echo "Tolgee bootstrap succeeded. Deleting job/pods to clean up..."; \
	    kubectl -n $$ns delete job tolgee-bootstrap; \
	  else \
	    echo "WARNING: Tolgee bootstrap timed out or failed. Keeping logs for inspection."; \
	    kubectl -n $$ns logs job/tolgee-bootstrap --tail=50 || true; \
	  fi; \
	else \
	  echo "Tolgee or tolgee-bootstrap job not found; skipping Tolgee bootstrap wait."; \
	fi; \
	if kubectl -n $$ns get deploy school-backend >/dev/null 2>&1; then \
	  kubectl -n $$ns scale deploy/school-backend --replicas=0 || true; \
	  kubectl -n $$ns delete pod -l app=school-backend --ignore-not-found=true || true; \
	  kubectl -n $$ns wait --for=delete pod -l app=school-backend --timeout=60s || true; \
	  kubectl -n $$ns scale deploy/school-backend --replicas=1; \
	  if ! kubectl -n $$ns rollout status deploy/school-backend --timeout=240s; then \
	    echo "Rollout did not complete, showing diagnostics..."; \
	    kubectl -n $$ns get pods -l app=school-backend -o wide || true; \
	    pod=$$(kubectl -n $$ns get pods -l app=school-backend -o jsonpath="{.items[0].metadata.name}" 2>/dev/null); \
	    if [ -n "$$pod" ]; then \
	      kubectl -n $$ns describe pod $$pod | tail -n 200 || true; \
	      kubectl -n $$ns logs $$pod --tail=200 || true; \
	    fi; \
	    exit 1; \
	  fi; \
	  echo "Applied $$env and refreshed backend pod successfully"; \
	else \
	  echo "Deployment school-backend not found; skipping backend refresh."; \
	fi; \
	\
	echo ""; \
	echo "Service export & status:"; \
	printf "%-22s %-10s %-16s %-6s\n" "SERVICE" "TYPE" "EXPORT(NODEPORT)" "STATUS"; \
	echo "---------------------------------------------------------------------"; \
	for svc in $$(kubectl -n $$ns get svc -o jsonpath="{range .items[*]}{.metadata.name}{\"\n\"}{end}"); do \
	  type=$$(kubectl -n $$ns get svc $$svc -o jsonpath="{.spec.type}" 2>/dev/null || echo "-"); \
	  exportp="-" ; \
	  if [ "$$type" = "NodePort" ]; then \
	    exportp=$$(kubectl -n $$ns get svc $$svc -o jsonpath="{range .spec.ports[*]}{.nodePort}{\",\"}{end}" | sed 's/,\s*$$//' ); \
	    [ -z "$$exportp" ] && exportp="-" ; \
	  fi; \
	  eps=$$(kubectl -n $$ns get endpoints $$svc -o jsonpath="{range .subsets[*].addresses[*]}{.ip}{\"\n\"}{end}" 2>/dev/null || true); \
	  if [ -n "$$eps" ]; then status="up"; else status="down"; fi; \
	  printf "%-22s %-10s %-16s %-6s\n" "$$svc" "$$type" "$$exportp" "$$status"; \
	done; \
	'
