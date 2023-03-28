"use strict";
// import * as admin from "firebase-admin";
// const serviceKey = require("./clave.json");
Object.defineProperty(exports, "__esModule", { value: true });
exports.realtimeDB = exports.firestore = void 0;
// admin.initializeApp({
//   credential: admin.credential.cert(serviceKey as any),
//   databaseURL: "https://dwf-m6-desafio-24f45-default-rtdb.firebaseio.com",
// });
// const firestore = admin.firestore();
// const realtimeDB = admin.database();
// export { realtimeDB, firestore };
const admin = require("firebase-admin");
const firebaseKey = require("../key.json");
admin.initializeApp({
    credential: admin.credential.cert(firebaseKey),
    databaseURL: process.env.DATABASE_URL,
});
const firestore = admin.firestore();
exports.firestore = firestore;
const realtimeDB = admin.database();
exports.realtimeDB = realtimeDB;
