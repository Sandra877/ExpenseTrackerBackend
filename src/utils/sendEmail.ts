import sgMail from "@sendgrid/mail";

const apiKey = process.env.SENDGRID_API_KEY as string;
const fromEmail = process.env.SENDGRID_FROM_EMAIL as string;

if (!apiKey || !fromEmail) {
  throw new Error("Missing SendGrid API key or sender email");
}

sgMail.setApiKey(apiKey);

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    await sgMail.send({
      to,
      from: { email: fromEmail, name: "ExpenseTracker" }, // safer format
      subject,
      html,
    });
    console.log("Email sent successfully");
  } catch (err: any) {
    console.error("SendGrid error:", err.response?.statusCode, err.response?.body);
    throw err;
  }
}
