"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.realtimeDB = exports.firestore = void 0;

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
