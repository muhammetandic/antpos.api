import nodemailer, { Transporter } from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import { Mail } from "../common/dtos/mail.js";

const transporter: Transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER || "test@example.com",
    pass: process.env.MAIL_PASS || "test",
  },
});

transporter.use(
  "compile",
  hbs({
    viewEngine: {
      extname: ".html",
      layoutsDir: "src/views/email-templates",
      defaultLayout: "",
    },
    viewPath: "src/views/email-templates",
    extName: ".html",
  }),
);

const setMailOptions = ({ to, subject, template, context }: Mail) => ({
  from: `antpos-todo <${process.env.MAIL_USER}>`,
  to,
  subject,
  template,
  context: {
    ...context,
    app_url: process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://www.1stweb3.dev",
  },
});

export const sendMailAsync = async (mail: Mail): Promise<void> => {
  const options = {
    ...setMailOptions(mail),
    ...(process.env.NODE_ENV === "development" && {
      host: "localhost",
      port: 1025,
      tls: {
        rejectUnauthorized: false,
      },
    }),
  };

  await transporter.sendMail(options);
  console.log("[nodemailer]: mail sent successfully");
};
