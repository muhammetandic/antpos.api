import nodeMailer, { Transporter } from "nodemailer";

const transporter: Transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export async function sendTextMailAsync(to: string, subject: string, message: string): Promise<void> {
  const options = {
    from: `antpos-todo <${process.env.MAIL_USER}>`,
    to,
    subject,
    text: message,
  };
  await transporter.sendMail(options);
  console.log("[nodemailer]: text email sent successfully");
}

export async function sendHtmlMailAsync(to: string, subject: string, message: string): Promise<void> {
  const options = {
    from: `antpos-todo <${process.env.MAIL_USER}>`,
    to,
    subject,
    html: message,
  };
  await transporter.sendMail(options);
  console.log("[nodemailer]: html email sent successfully");
}
