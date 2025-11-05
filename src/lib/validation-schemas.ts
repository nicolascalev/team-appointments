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

export const createServiceSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  buffer: z.number().min(0, "Buffer must be 0 or greater"),
  price: z.number().min(0, "Price must be 0 or greater"),
  currencyCode: z.string().min(3, "Currency code must be 3 characters"),
  category: z.string().optional(),
  teamMembers: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
});

export const teamSettingsSchema = z.object({
  minBookingNoticeAmount: z.number().min(0, "Amount must be 0 or greater"),
  minBookingNoticeUnit: z.enum(["minutes", "hours", "days"], {
    required_error: "Please select a unit",
  }),
  cancellationPolicy: z.string().optional(),
  maxAppointmentsPerDay: z.number().min(0, "Must be 0 or greater").optional(),
  maxAppointmentsPerEmployee: z.number().min(0, "Must be 0 or greater").optional(),
});

export const memberBioSchema = z.object({
  bio: z.string().max(100, "Bio must be 100 characters or less").optional(),
});

export const bookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  serviceId: z.string().min(1, "Service is required"),
  employeeIds: z.array(z.string()).min(1, "At least one employee must be selected"),
  timeSlot: z.string().min(1, "Time slot is required"),
});

export const updateUserProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().optional(),
  avatar: z.instanceof(File).optional(),
});

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const resetPasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmNewPassword: z.string().min(8, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  });

export const requestPasswordResetSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const verifyResetCodeSchema = z.object({
  email: z.string().email("Invalid email address"),
  code: z.string().length(6, "Code must be 6 characters"),
});

export const resetPasswordWithCodeSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    code: z.string().length(6, "Code must be 6 characters"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmNewPassword: z.string().min(8, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  });
