import { sendMarketingEmail, sendTransactionalEmail } from "@/lib/sendEmail";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const recipient = {
      email: "guillen_nicolas@live.com",
      name: "Nicolas Guillen",
    };

    // Send transactional email
    const transactionalResult = await sendTransactionalEmail(
      recipient,
      "Test Transactional Email - Teamlypro",
      `
        <h2>Welcome to Teamlypro!</h2>
        <p>This is a test transactional email to verify our email system is working correctly.</p>
        <p>Your appointment booking system is now ready to send automated emails to your clients.</p>
        <ul>
          <li>Appointment confirmations</li>
          <li>Booking reminders</li>
          <li>Schedule changes</li>
          <li>Service updates</li>
        </ul>
        <p>Best regards,<br>The Teamlypro Team</p>
      `
    );

    // Send marketing email
    const marketingResult = await sendMarketingEmail(
      recipient,
      "Test Marketing Email - Teamlypro Special Offer!",
      `
        <h2>🎉 Special Launch Offer!</h2>
        <p>We're excited to announce that your Teamlypro account is now live!</p>
        <p>As a valued customer, you're getting exclusive access to our premium features:</p>
        <ul>
          <li>✅ Unlimited appointments</li>
          <li>✅ Advanced scheduling tools</li>
          <li>✅ Client management system</li>
          <li>✅ Automated reminders</li>
          <li>✅ Custom branding</li>
        </ul>
        <p><strong>This offer expires in 7 days!</strong></p>
        <p>Don't miss out on transforming your business with Teamlypro.</p>
        <p>Best regards,<br>The Teamlypro Team</p>
      `
    );

    const allEmailsSuccessful =
      transactionalResult.success && marketingResult.success;

    return NextResponse.json({
      success: allEmailsSuccessful,
      message: allEmailsSuccessful
        ? "Test emails sent successfully!"
        : "Some emails failed to send. Check the results for details.",
      results: {
        transactional: {
          success: transactionalResult.success,
          error: transactionalResult.error || null,
        },
        marketing: {
          success: marketingResult.success,
          error: marketingResult.error || null,
        },
      },
    });
  } catch (error) {
    console.error("Error in email test route:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
