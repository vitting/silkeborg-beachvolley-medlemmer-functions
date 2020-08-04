import { TemplateVariableIndex } from "./interfaces/template-variable";
import { EmailSendDbFunctions } from "./email-sender-db-functions";

export class TemplateVarsFunctions {
  private static keysReserved = ["name", "payment", "currentyear"];
  private static index: TemplateVariableIndex;

  static set tempVarIndex(index: TemplateVariableIndex) {
    TemplateVarsFunctions.index = index;
  }

  static get tempVarIndex() {
    return TemplateVarsFunctions.index;
  }

  private static getTempVarValues(text: string) {
    const regEx = /##[a-z_]+##/g;
    const result = text.match(regEx);
    let tempVars: string[] = [];
    if (result) {
      tempVars = result.map((value) => {
        return value.replace(/##/g, "");
      });
    }

    return tempVars;
  }

  private static isKeyReserved(key: string) {
    return TemplateVarsFunctions.keysReserved.indexOf(key) !== -1;
  }

  private static getTempVarFromIndex(key: string) {
    return TemplateVarsFunctions.index[key];
  }

  private static parseVar(
    key: string,
    name: string,
    payment: number,
    currentYear: number
  ) {
    let tempVarValue = "";
    if (TemplateVarsFunctions.isKeyReserved(key)) {
      switch (key) {
        case "name":
          tempVarValue = name;
          break;
        case "payment":
          tempVarValue = payment.toString();
          break;
        case "currentyear":
          tempVarValue = currentYear.toString();
          break;
      }
    } else {
      tempVarValue =
        TemplateVarsFunctions.getTempVarFromIndex(key)?.value ?? "";
    }

    return tempVarValue;
  }

  static async parseTemplateText(
    text: string,
    name: string,
    payment: number,
    currentYear: number
  ): Promise<string> {
    const tempVars = TemplateVarsFunctions.getTempVarValues(text);
    let returnValue = text;

    if (tempVars.length !== 0) {
      if (!TemplateVarsFunctions.tempVarIndex) {
        await EmailSendDbFunctions.loadTemplateVariables();
      }

      for (const key of tempVars) {
        const value = TemplateVarsFunctions.parseVar(
          key,
          name,
          payment,
          currentYear
        );

        const re = new RegExp(`##${key}##`, "g");
        returnValue = returnValue.replace(re, value);
      }
    }

    return returnValue;
  }
}
