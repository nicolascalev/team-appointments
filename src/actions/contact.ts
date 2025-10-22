"use server";

import { z } from "zod";
import { contactFormSchema } from "@/lib/validation-schemas";
import { sendTransactionalEmail } from "@/lib/sendEmail";

export async function submitContactForm(
  data: z.infer<typeof contactFormSchema>
) {
  // Validate the data
  const validatedData = contactFormSchema.parse(data);

  // Create the email content
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Contact Form Submission</h2>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #555; margin-top: 0;">Contact Details</h3>
        <p><strong>Name:</strong> ${validatedData.name}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #555; margin-top: 0;">Message</h3>
        <p style="white-space: pre-wrap; line-height: 1.6;">${validatedData.message}</p>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
        <p>This message was sent from the Teamlypro contact form.</p>
      </div>
    </div>
  `;

  // Send the email
  const emailResult = await sendTransactionalEmail(
    {
      email: "nicolascalevg@gmail.com",
      name: "Teamlypro Support",
    },
    `New Contact Form Submission from ${validatedData.name}`,
    htmlBody
  );

  if (!emailResult.success) {
    throw new Error(emailResult.error || "Failed to send email");
  }

  return { success: true, message: "Message sent successfully!" };
}
