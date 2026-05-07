import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, enableIndexedDbPersistence, type Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

function getClientApp(): FirebaseApp {
  if (getApps().length > 0) return getApp()
  return initializeApp(firebaseConfig)
}

export function getClientAuth(): Auth {
  return getAuth(getClientApp())
}

let firestoreInstance: Firestore | null = null
let persistenceEnabled = false

export function getClientFirestore(): Firestore {
  if (firestoreInstance) return firestoreInstance
  const db = getFirestore(getClientApp())
  firestoreInstance = db
  if (typeof window !== 'undefined' && !persistenceEnabled) {
    persistenceEnabled = true
    enableIndexedDbPersistence(db).catch(err => {
      if (err.code === 'failed-precondition') {
        console.warn('Firestore offline persistence: multiple tabs open')
      } else if (err.code === 'unimplemented') {
        console.warn('Firestore offline persistence: browser not supported')
      }
    })
  }
  return db
}
