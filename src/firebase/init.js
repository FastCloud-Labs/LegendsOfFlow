
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/analytics'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FBDB_APIKEY,
  authDomain: import.meta.env.VITE_APP_FBDB_authDomain,
  projectId: import.meta.env.VITE_APP_FBDB_projectId,
  storageBucket: import.meta.env.VITE_APP_FBDB_storageBucket,
  messagingSenderId: import.meta.env.VITE_APP_FBDB_messagingSenderId,
  appId: import.meta.env.VITE_APP_FBDB_appId,
  measurementId: import.meta.env.VITE_APP_FBDB_measurementId,

}

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig)
const analytics = getAnalytics(app);

// test on local emulator
// firebase.functions().useEmulator('localhost', 4000)
// console.log('***** USING EMULATED FUNCTIONS!')

const db = firebaseApp.firestore();

export default db
