import { z } from "zod";
import { BUCKETS } from "@/lib/college-list";

// Phase A3 — spec Sec 8: zod on every API route input.

export const addCollegeSchema = z.object({
  collegeId: z.string().min(1),
});

export type AddCollegeInput = z.infer<typeof addCollegeSchema>;

export const bucketPatchSchema = z.object({
  bucket: z.enum(BUCKETS as [string, ...string[]]),
});

export type BucketPatchInput = z.infer<typeof bucketPatchSchema>;
