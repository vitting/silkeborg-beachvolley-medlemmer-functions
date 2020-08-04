import {
  EmailToSendRecipientType,
} from "./interfaces/email-to-send";
import { TemplateEmail } from "./interfaces/template-email";
import { EmailLogStatus, EmailLog } from "./interfaces/email-log";
import { firestore } from "firebase-admin";
import {
  TemplateVariable,
  TemplateVariableIndex,
} from "./interfaces/template-variable";
import { TemplateVarsFunctions } from "./template-vars-functions";

export class EmailSendDbFunctions {
  static db: FirebaseFirestore.Firestore;
  private static templatesEmailCollection = "templates_email";
  private static emailLogsCollection = "email_logs";
  private static emailServiceWaitingCollection = "emailservice_waiting";
  private static templateVarsCollection = "template_variables";

  static async loadTemplateVariables() {
    const querySnapshot = await EmailSendDbFunctions.db
      .collection(EmailSendDbFunctions.templateVarsCollection)
      .get();
    if (!querySnapshot.empty) {
      const index: TemplateVariableIndex = {};
      for (const doc of querySnapshot.docs) {
        const tempVar = doc.data() as TemplateVariable;
        index[tempVar.key] = tempVar;
      }
      
      TemplateVarsFunctions.tempVarIndex = index;
    }
  }

  static async getEmailTemplateByType(type: string) {
    let emailTemplate: TemplateEmail = {
      id: null,
      subject: "",
      body: "",
      description: "",
      name: "",
      recipientType: null,
      type: null
    };
    const querySnapshot = await EmailSendDbFunctions.db
      .collection(EmailSendDbFunctions.templatesEmailCollection)
      .where("type", "==", type)
      .get();
    if (!querySnapshot.empty) {
      emailTemplate = querySnapshot.docs[0].data() as TemplateEmail;
    }

    return emailTemplate;
  }

  static deleteEmail(id: string) {
    return EmailSendDbFunctions.db
      .collection(EmailSendDbFunctions.emailServiceWaitingCollection)
      .doc(id)
      .delete();
  }

  static logEmail(
    emailserviceId: string,
    email: string,
    emailType: EmailToSendRecipientType,
    subject: string,
    body: string,
    status: EmailLogStatus,
    error: string = ""
  ) {
    const emailLog: EmailLog = {
      emails: email,
      emailserviceId: emailserviceId,
      error,
      sendtAt: firestore.Timestamp.now(),
      status,
      type: emailType,
      subject,
      body,
    };

    if (status === "ok") {
      console.log("sendEmail", {
        id: emailserviceId,
        email: email,
        emailType,
        status,
      });
    } else {
      console.error("sendEmailError", {
        error,
        id: emailserviceId,
        email: email,
        emailType,
        status,
      });
    }

    return EmailSendDbFunctions.db
      .collection(EmailSendDbFunctions.emailLogsCollection)
      .doc()
      .set(emailLog);
  }
}
