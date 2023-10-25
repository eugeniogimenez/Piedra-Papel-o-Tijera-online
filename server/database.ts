

import * as admin from "firebase-admin";
import * as firebaseKey from "../key.json";

admin.initializeApp({
  credential: admin.credential.cert(firebaseKey as any),
  databaseURL: process.env.DATABASE_URL,
});

const firestore = admin.firestore();
const realtimeDB = admin.database();

export { firestore, realtimeDB };
