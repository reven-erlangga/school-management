-- Convert religions.name and religions.description from TEXT to JSONB.
-- Supports existing rows containing either:
-- - JSON strings (e.g. {"en":"Islam","id":"Islam"})
-- - plain strings (e.g. Islam)

ALTER TABLE "religions"
ALTER COLUMN "name" TYPE jsonb
USING (
  CASE
    WHEN "name" ~ '^\s*\{' THEN "name"::jsonb
    ELSE jsonb_build_object('en', "name", 'id', "name")
  END
);

ALTER TABLE "religions"
ALTER COLUMN "description" TYPE jsonb
USING (
  CASE
    WHEN "description" IS NULL THEN NULL
    WHEN "description" ~ '^\s*\{' THEN "description"::jsonb
    ELSE jsonb_build_object('en', "description", 'id', "description")
  END
);
