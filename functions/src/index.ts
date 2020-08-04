import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {
  EnvironmentVars,
  environmentVarsInitEmpty,
  environmentVarsInit,
} from "./interfaces/environment-vars";
import { EmailToSend } from "./interfaces/email-to-send";
import { EmailSenderFunctions } from "./email-sender-functions";
import { Counter } from "./interfaces/counter";

/*
  deploy:
  firebase deploy --only functions
  firebase deploy --only firestore:rules
 */

/*
    environment variables:
   firebase functions:config:set mailservice.prod_from_name="Silkeborg Beachvolley"
    firebase functions:config:set mailservice.prod_from_email="silkeborgbeachvolley@gmail.com"
    firebase functions:config:set mailservice.dev_from_name="Silkeborg Beachvolley"
    firebase functions:config:set mailservice.dev_from_email="silkeborgbeachvolley@gmail.com"
    firebase functions:config:set mailservice.dev_send_to_email="ghost.dev.app@hotmail.com"
    firebase functions:config:set mailservice.development=true or false
    firebase functions:config:set mailservice.dev_local=true or false
    firebase functions:config:set mailservice.prod_account_email="ghost.dev.app@gmail.com"
    firebase functions:config:set mailservice.prod_account_password="password to gmail account"
    firebase functions:config:set mailservice.dev_account_email="ghost.dev.app@gmail.com"
    firebase functions:config:set mailservice.dev_account_password="password to gmail account"
    firebase functions:config:set mailservice.dev_local_host="localhost"
    firebase functions:config:set mailservice.dev_local_port="1025"
    firebase functions:config:set mailservice.dev_local_username="project.1"
    firebase functions:config:set mailservice.dev_local_password="secret.1"
 */

/*
    https://firebase.google.com/docs/functions/local-emulator
    If you're using custom functions configuration variables, first run the command to get your custom config (run this within the functions directory) in your local environment:
    - firebase functions:config:get > .runtimeconfig.json

    Access to Firestore Cloud from Functions Emulator, set up Admin SDK access
    https://firebase.google.com/docs/functions/local-emulator

    example:
    set variable GOOGLE_APPLICATION_CREDENTIALS before running Emulator
    set GOOGLE_APPLICATION_CREDENTIALS=D:\Udvikling\GOOGLE_APPLICATION_CREDENTIALS\silkeborgbeachvolley-medlemmer-6b6556b7e6ad.json

*/

/* 
    import / export emulator data
    firebase emulators:export c:\\firebase_functions_export
    firebase emulators:start --only firestore,functions --import=c:\\firebase_functions_export
*/

admin.initializeApp();
const db = admin.firestore();
// const auth = admin.auth();
const envVars: EnvironmentVars = environmentVarsInit(functions.config());

export const sendEmailTo = functions.firestore
  .document("/emailservice_waiting/{documentId}")
  .onCreate(
    async (
      snap: functions.firestore.QueryDocumentSnapshot,
      _: functions.EventContext
    ) => {
      const emailData: EmailToSend = snap.data() as EmailToSend;
      await EmailSenderFunctions.sendEmail(emailData, envVars, db);
    }
  );

export const logCreateCount = functions.firestore
  .document("/logs/{documentId}")
  .onCreate(
    async (
      _: functions.firestore.QueryDocumentSnapshot,
      __: functions.EventContext
    ) => {
      return db.runTransaction(async (trans) => {
        const counterRef = db.collection("counters").doc("log_counter");
        const counterDoc = await trans.get(counterRef);
        let counterData: Counter = { id: "log_counter", value: 0 };
        if (counterDoc.exists) {
          counterData = counterDoc.data() as Counter;
        }

        const newCount = counterData.value + 1;
        counterData.value = newCount;
        trans.set(counterRef, counterData);
      });
    }
  );

export const logDeleteCount = functions.firestore
  .document("/logs/{documentId}")
  .onDelete(
    async (
      _: functions.firestore.QueryDocumentSnapshot,
      __: functions.EventContext
    ) => {
      return db.runTransaction(async (trans) => {
        const counterRef = db.collection("counters").doc("log_counter");
        const counterDoc = await trans.get(counterRef);
        let counterData: Counter = { id: "log_counter", value: 0 };
        if (counterDoc.exists) {
          counterData = counterDoc.data() as Counter;
        }

        const newCount = counterData.value - 1;
        counterData.value = newCount;
        trans.set(counterRef, counterData);
      });
    }
  );

export const emailLogCreateCount = functions.firestore
  .document("/email_logs/{documentId}")
  .onCreate(
    async (
      _: functions.firestore.QueryDocumentSnapshot,
      __: functions.EventContext
    ) => {
      return db.runTransaction(async (trans) => {
        const counterRef = db.collection("counters").doc("email_log_counter");
        const counterDoc = await trans.get(counterRef);
        let counterData: Counter = { id: "email_log_counter", value: 0 };
        if (counterDoc.exists) {
          counterData = counterDoc.data() as Counter;
        }
        const newCount = counterData.value + 1;
        counterData.value = newCount;
        trans.set(counterRef, counterData);
      });
    }
  );

export const emailLogDeleteCount = functions.firestore
  .document("/email_logs/{documentId}")
  .onDelete(
    async (
      _: functions.firestore.QueryDocumentSnapshot,
      __: functions.EventContext
    ) => {
      return db.runTransaction(async (trans) => {
        const counterRef = db.collection("counters").doc("email_log_counter");
        const counterDoc = await trans.get(counterRef);
        let counterData: Counter = { id: "email_log_counter", value: 0 };
        if (counterDoc.exists) {
          counterData = counterDoc.data() as Counter;
        }
        const newCount = counterData.value - 1;
        counterData.value = newCount;
        trans.set(counterRef, counterData);
      });
    }
  );

export const memberCreateCount = functions.firestore
  .document("/members/{documentId}")
  .onCreate(
    async (
      _: functions.firestore.QueryDocumentSnapshot,
      __: functions.EventContext
    ) => {
      return db.runTransaction(async (trans) => {
        const counterRef = db.collection("counters").doc("member_counter");
        const counterDoc = await trans.get(counterRef);
        let counterData: Counter = { id: "member_counter", value: 0 };
        if (counterDoc.exists) {
          counterData = counterDoc.data() as Counter;
        }
        const newCount = counterData.value + 1;
        counterData.value = newCount;
        trans.set(counterRef, counterData);
      });
    }
  );

export const memberDeleteCount = functions.firestore
  .document("/members/{documentId}")
  .onDelete(
    async (
      _: functions.firestore.QueryDocumentSnapshot,
      __: functions.EventContext
    ) => {
      return db.runTransaction(async (trans) => {
        const counterRef = db.collection("counters").doc("member_counter");
        const counterDoc = await trans.get(counterRef);
        let counterData: Counter = { id: "member_counter", value: 0 };
        if (counterDoc.exists) {
          counterData = counterDoc.data() as Counter;
        }
        const newCount = counterData.value - 1;
        counterData.value = newCount;
        trans.set(counterRef, counterData);
      });
    }
  );

export const getEnvironmentVars = functions.https.onCall((_, context) => {
  const environmentVarsCopy = environmentVarsInitEmpty();

  if (context.auth) {
    Object.assign(environmentVarsCopy, envVars);
    environmentVarsCopy.devAccountPassword = "";
    environmentVarsCopy.prodAccountPassword = "";
  }

  return environmentVarsCopy;
});
