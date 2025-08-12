import { Mail } from "../common/dtos/mail.js";
import { MailKind } from "../common/enums/mail-kind.js";
import { MailTemplate } from "../common/enums/mail-template.js";
import { TMailMessageParameters } from "../common/schemes/mail-queue.js";
import { sendMailAsync } from "./mail.service.js";

const mailConfigs = {
  [MailKind.CONFIRM_MAIL_OTP]: {
    subject: "One time password for mail confirmation",
    template: MailTemplate.confirmMailOtp,
  },
  [MailKind.CONFIRM_PASSWORD_OTP]: {
    subject: "One time password for password reset",
    template: MailTemplate.forgetPasswordOtp,
  },
  [MailKind.WELCOME]: {
    subject: "Welcome to Antpos Todo App",
    template: MailTemplate.welcome,
  },
};

export async function sendMailWithParametersAsync(mailKind: MailKind, parameters: TMailMessageParameters) {
  const { subject, template } = mailConfigs[mailKind];
  const mail = new Mail(parameters.mail, subject, template, parameters);
  await sendMailAsync(mail);
}
