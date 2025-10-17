import axios from 'axios';
import getEmailContent from './getEmailContent';

interface EmailRecipient {
  email: string;
  name?: string;
}

interface BrevoEmailRequest {
  sender: {
    name: string;
    email: string;
  };
  to: EmailRecipient[];
  subject: string;
  htmlContent: string;
}

interface SendEmailOptions {
  to: EmailRecipient | EmailRecipient[];
  subject: string;
  htmlBody: string;
  emailType?: 'transactional' | 'marketing';
  senderName?: string;
  senderEmail?: string;
}

export async function sendEmail({
  to,
  subject,
  htmlBody,
  emailType = 'transactional',
  senderName = 'Teamlypro',
  senderEmail = 'notifications@teamlypro.com'
}: SendEmailOptions) {
  try {
    const apiKey = process.env.BREVO_API_KEY;
    
    if (!apiKey) {
      throw new Error('BREVO_API_KEY environment variable is not set');
    }

    // Ensure to is always an array
    const recipients = Array.isArray(to) ? to : [to];

    // Generate the full HTML content using getEmailContent
    const fullHtmlContent = getEmailContent(emailType, htmlBody);

    const emailData: BrevoEmailRequest = {
      sender: {
        name: senderName,
        email: senderEmail
      },
      to: recipients,
      subject,
      htmlContent: fullHtmlContent
    };

    const response = await axios.post('https://api.brevo.com/v3/smtp/email', emailData, {
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json'
      }
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error sending email:', error);
    
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data 
        ? `Brevo API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`
        : error.message;
      return { 
        success: false, 
        error: errorMessage
      };
    }
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

// Convenience function for transactional emails
export async function sendTransactionalEmail(
  to: EmailRecipient | EmailRecipient[],
  subject: string,
  htmlBody: string,
  options?: {
    senderName?: string;
    senderEmail?: string;
  }
) {
  return sendEmail({
    to,
    subject,
    htmlBody,
    emailType: 'transactional',
    ...options
  });
}

// Convenience function for marketing emails
export async function sendMarketingEmail(
  to: EmailRecipient | EmailRecipient[],
  subject: string,
  htmlBody: string,
  options?: {
    senderName?: string;
    senderEmail?: string;
  }
) {
  return sendEmail({
    to,
    subject,
    htmlBody,
    emailType: 'marketing',
    ...options
  });
}
