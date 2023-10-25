

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { ref, onValue } from "firebase/database";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "7kmFDlHlyJksezOqDM8al53hTJjrUXeiIb0bRmLv",
  authDomain: "dwf-m6-desafio-final-elg.firebaseapp.com",
  databaseURL: "https://dwf-m6-desafio-final-elg-default-rtdb.firebaseio.com",
};

//Inicializamos firebase
const app = initializeApp(firebaseConfig);

// Llamamos a la funcion getDatabase para llamar a la rtdb
const realtimeDB = getDatabase(app);

export { realtimeDB };
