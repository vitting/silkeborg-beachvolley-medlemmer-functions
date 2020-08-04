import { config } from "firebase-functions";

export interface EnvironmentVars {
  devLocalHost: string;
  devFromName: string;
  devLocalPassword: string;
  devSendToEmail: string;
  devAccountPassword: string;
  prodAccountPassword: string;
  devFromEmail: string;
  prodFromEmail: string;
  devLocalUsername: string;
  development: boolean;
  devAccountEmail: string;
  devLocal: boolean;
  devLocalPort: number;
  prodFromName: string;
  prodAccountEmail: string;
}

export function environmentVarsInit(configVars: config.Config): EnvironmentVars {
  return {
    devLocal: configVars.mailservice.dev_local === "true",
    development: configVars.mailservice.development === "true",
    devAccountEmail: configVars.mailservice.dev_account_email,
    devAccountPassword: configVars.mailservice.dev_account_password,
    devFromEmail: configVars.mailservice.dev_from_email,
    devFromName: configVars.mailservice.dev_from_name,
    devLocalHost: configVars.mailservice.dev_local_host,
    devLocalPort: Number.parseInt(configVars.mailservice.dev_local_port, 0),
    devLocalUsername: configVars.mailservice.dev_local_username,
    devLocalPassword: configVars.mailservice.dev_local_password,
    devSendToEmail: configVars.mailservice.dev_send_to_email,
    prodAccountEmail: configVars.mailservice.prod_account_email,
    prodAccountPassword: configVars.mailservice.prod_account_password,
    prodFromEmail: configVars.mailservice.prod_from_email,
    prodFromName: configVars.mailservice.prod_from_name,
  };
}

export function environmentVarsInitEmpty(): EnvironmentVars {
  return {
    devAccountEmail: "",
    devAccountPassword: "",
    devFromEmail: "",
    devFromName: "",
    devLocal: false,
    devLocalHost: "",
    devLocalPassword: "",
    devLocalPort: 0,
    devLocalUsername: "",
    devSendToEmail: "",
    development: false,
    prodAccountEmail: "",
    prodAccountPassword: "",
    prodFromEmail: "",
    prodFromName: "",
  };
}
