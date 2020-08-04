import { EnvironmentVars } from "./interfaces/environment-vars";
import { EmailToSend } from "./interfaces/email-to-send";
import { SubjectBody } from "./interfaces/subject-body";
import { EmailRecipientData } from "./interfaces/email-recipient-data";
import Mail = require("nodemailer/lib/mailer");
import * as nodemailer from "nodemailer";
import { Transporters } from "./transporters";
import { EmailSendDbFunctions } from "./email-sender-db-functions";
import { TemplateVarsFunctions } from "./template-vars-functions";

export class EmailSenderFunctions {
  private static emailChooser(email: string, envVars: EnvironmentVars): string {
    if (envVars.development && !envVars.devLocal) {
      return envVars.devSendToEmail;
    } else {
      return email;
    }
  }

  private static async getEmailSubjectBody(
    emailData: EmailToSend
  ): Promise<SubjectBody> {
    const subjectBody: SubjectBody = {
      subject: "",
      body: "",
    };

    if (emailData.type !== "email") {
      const emailTemplate = await EmailSendDbFunctions.getEmailTemplateByType(
        emailData.type
      );
      subjectBody.subject = emailTemplate.subject;
      subjectBody.body = emailTemplate.body;
    } else {
      subjectBody.subject = emailData.subject;
      subjectBody.body = emailData.body;
    }

    return subjectBody;
  }

  private static async getEmailRecipients(
    emailData: EmailToSend,
    subjectBody: SubjectBody,
    envVars: EnvironmentVars
  ): Promise<EmailRecipientData[]> {
    const data: EmailRecipientData[] = [];
    for (const recipient of emailData.recipients) {
      const subject = await TemplateVarsFunctions.parseTemplateText(
        subjectBody.subject,
        recipient.name,
        recipient.payment,
        emailData.currentYear
      );

      const body = await TemplateVarsFunctions.parseTemplateText(
        subjectBody.body,
        recipient.name,
        recipient.payment,
        emailData.currentYear
      );

      data.push({
        email: EmailSenderFunctions.emailChooser(recipient.email, envVars),
        subject,
        body,
      });
    }

    return data;
  }

  private static getEmailTransporter(envVars: EnvironmentVars): Mail {
    if (!envVars.development) {
      return Transporters.transporterProd(nodemailer, envVars);
    } else {
      if (envVars.devLocal) {
        return Transporters.transporterDevLocal(nodemailer, envVars);
      } else {
        return Transporters.transporterDev(nodemailer, envVars);
      }
    }
  }

  static async sendEmail(
    emailData: EmailToSend,
    envVars: EnvironmentVars,
    db: FirebaseFirestore.Firestore
  ) {
    EmailSendDbFunctions.db = db;
    let success = false;
    const emailTransporter: Mail = EmailSenderFunctions.getEmailTransporter(
      envVars
    );
    const subjectBody = await EmailSenderFunctions.getEmailSubjectBody(
      emailData
    );

    const emailRecipients: EmailRecipientData[] = await EmailSenderFunctions.getEmailRecipients(
      emailData,
      subjectBody,
      envVars
    );

    for (const emailRecipient of emailRecipients) {
      if (emailRecipient.email) {
        const mailOptions: nodemailer.SendMailOptions = {
          to: EmailSenderFunctions.emailChooser(emailRecipient.email, envVars),
          subject: emailRecipient.subject,
          html: emailRecipient.body,
        };

        try {
          await emailTransporter.sendMail(mailOptions);
          success = true;
        } catch (error) {
          await EmailSendDbFunctions.logEmail(
            emailData.id,
            emailRecipient.email,
            emailData.type,
            emailRecipient.subject,
            emailRecipient.body,
            "error",
            error
          );

          success = false;
        }
      }
    }

    if (success) {
      await EmailSendDbFunctions.deleteEmail(emailData.id);
      await EmailSendDbFunctions.logEmail(
        emailData.id,
        emailData.recipients.map((recipient) => recipient.email).join(";"),
        emailData.type,
        subjectBody.subject,
        subjectBody.body,
        "ok"
      );
    }

    return success;
  }
}
