import { MailTemplate } from "../enums/mail-template.js";

export class Mail {
  to: string;
  subject: string;
  template: MailTemplate;
  context?: object;

  constructor(to: string, subject: string, template: MailTemplate, context?: object) {
    this.to = to;
    this.subject = subject;
    this.template = template;
    this.context = context;
  }
}
