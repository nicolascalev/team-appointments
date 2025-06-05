// Always use zod for validation

import { z } from "zod";

export const createTeamSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  category: z.string().optional(),
  bio: z.string().optional(),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
  location: z.string().optional(),
  contactEmail: z.string().email("Invalid email").optional(),
  contactPhone: z.string().optional(),
  timezone: z.string(),
  avatar: z.instanceof(File).optional(),
});
