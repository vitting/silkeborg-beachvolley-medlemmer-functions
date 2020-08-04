import Mail = require("nodemailer/lib/mailer");
import { EnvironmentVars } from "./interfaces/environment-vars";

export class Transporters {
  static transporterProd(nodemailer: any, envVars: EnvironmentVars): Mail {
    return nodemailer.createTransport(
      {
        service: "gmail",
        auth: {
          user: envVars.prodAccountEmail,
          pass: envVars.prodAccountPassword,
        },
      },
      {
        from: `${envVars.prodFromName} <${envVars.prodFromEmail}>`,
      }
    );
  }

  // Development
  // Used for running functions in Firebase Emulator or in Cloud
  static transporterDev(nodemailer: any, envVars: EnvironmentVars): Mail {
    return nodemailer.createTransport(
      {
        service: "gmail",
        auth: {
          user: envVars.devAccountEmail,
          pass: envVars.devAccountPassword,
        },
      },
      {
        from: `${envVars.devFromName} <${envVars.devFromEmail}>`,
      }
    );
  }

  // Development and Local
  // Used for running functions in Firebase Emulator and NodemailerApp local
  static transporterDevLocal(nodemailer: any, envVars: EnvironmentVars): Mail {
    return nodemailer.createTransport(
      {
        host: envVars.devLocalHost,
        port: envVars.devLocalPort,
        auth: {
          user: envVars.devLocalUsername,
          pass: envVars.devLocalPassword,
        },
      },
      {
        from: `${envVars.devFromName} <${envVars.devFromEmail}>`,
      }
    );
  }
}
