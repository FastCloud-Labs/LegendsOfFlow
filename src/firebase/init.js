
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyDzhqUkFad_0tYCZyw_PWgd-adepZgnbK8",
  authDomain: "pvplegends.firebaseapp.com",
  databaseURL: "https://pvplegends-default-rtdb.firebaseio.com",
  projectId: "pvplegends",
  storageBucket: "pvplegends.appspot.com",
  messagingSenderId: "31740588377",
  appId: "1:31740588377:web:be8460734a1e48727fdc48"

}

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig)
firebase.analytics()

// test on local emulator
// firebase.functions().useEmulator('localhost', 4000)
// console.log('***** USING EMULATED FUNCTIONS!')

const db = firebaseApp.firestore()

export default db
