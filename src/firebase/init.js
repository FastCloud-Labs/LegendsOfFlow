import firebase from 'firebase/app';
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/analytics'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FBDB_APIKEY,
  authDomain: import.meta.env.VITE_APP_FBDB_AuTHDOMAIN,
  projectId: import.meta.env.VITE_APP_FBDB_PROJECTID,
  storageBucket: import.meta.env.VITE_APP_FBDB_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_APP_FBDB_MESSAGESENDERID,
  appId: import.meta.env.VITE_APP_FBDB_APPID,
  measurementId: import.meta.env.VITE_APP_FBDB_MEASUREMENTID,

}
console.log(firebaseConfig)

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
firebase.analytics();

// test on local emulator
firebase.functions().useEmulator('localhost', 4000)
// console.log('***** USING EMULATED FUNCTIONS!')

const db = firebaseApp.firestore();

export default db
