import { z } from "zod";

const urlSchema = z
  .string()
  .url("Must be a valid URL")
  .optional()
  .or(z.literal(""));

export const CandidateManualEntrySchema = z.object({
  firstName: z.string().min(1, "First name is required").trim(),
  lastName: z.string().min(1, "Last name is required").trim(),
  title: z.string().min(1, "Position/Title is required").trim(),
  email: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  linkedinUrl: urlSchema,
  githubUrl: urlSchema,
  location: z.string().optional().or(z.literal("")),
});

export const CandidateAutoFillSchema = z.object({
  profileUrl: z
    .string()
    .min(1, "Profile URL is required")
    .url("Must be a valid URL"),
});

export type CandidateManualEntryFormData = z.infer<typeof CandidateManualEntrySchema>;
export type CandidateAutoFillFormData = z.infer<typeof CandidateAutoFillSchema>;