import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"


const firebaseConfig = {
  apiKey: "AIzaSyCilMKAI2hgIjeEI9df0B-NIYsh5gDkhuM",
  authDomain: "grocery-app-cef85.firebaseapp.com",
  projectId: "grocery-app-cef85",
  storageBucket: "grocery-app-cef85.firebasestorage.app",
  messagingSenderId: "836714731076",
  appId: "1:836714731076:web:379c5d2f011b64eb608e11"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)