-- HonorAward.level moves from a 5-tier string enum (school / regional /
-- state / national / international) to a 1-10 rigor/selectivity score
-- (see lib/rigor-scale.ts). Existing rows are mapped onto the closest
-- point on the new scale so no honor data is lost.
ALTER TABLE "HonorAward" ADD COLUMN "level_new" INTEGER;

UPDATE "HonorAward" SET "level_new" = CASE "level"
  WHEN 'school' THEN 2
  WHEN 'regional' THEN 4
  WHEN 'state' THEN 6
  WHEN 'national' THEN 8
  WHEN 'international' THEN 10
  ELSE 5
END;

ALTER TABLE "HonorAward" ALTER COLUMN "level_new" SET NOT NULL;
ALTER TABLE "HonorAward" DROP COLUMN "level";
ALTER TABLE "HonorAward" RENAME COLUMN "level_new" TO "level";
