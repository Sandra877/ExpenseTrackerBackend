import sgMail from "@sendgrid/mail";

const apiKey = process.env.SENDGRID_API_KEY as string;
const fromEmail = process.env.SENDGRID_FROM_EMAIL as string;

// Only set the API key if it exists
if (apiKey) {
  sgMail.setApiKey(apiKey);
}

export async function sendEmail(to: string, subject: string, html: string) {
  if (!apiKey || !fromEmail) {
    console.error("SendGrid is not configured. Email not sent.");
    return; // Don't crash server
  }

  try {
    await sgMail.send({
      to,
      from: { email: fromEmail, name: "ExpenseTracker" },
      subject,
      html,
    });

    console.log("Email sent successfully");
  } catch (err: any) {
    console.error("SendGrid error:", err.response?.statusCode, err.response?.body);
  }
}
