import admin from 'firebase-admin'

const globalForFirebase = globalThis as unknown as {
  firebaseApp: admin.app.App | undefined
}

function getFirebaseApp(): admin.app.App {
  if (globalForFirebase.firebaseApp) return globalForFirebase.firebaseApp

  if (admin.apps.length > 0) {
    globalForFirebase.firebaseApp = admin.apps[0]!
    return globalForFirebase.firebaseApp
  }

  const credential = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY))
    : admin.credential.applicationDefault()

  globalForFirebase.firebaseApp = admin.initializeApp({
    credential,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  })

  return globalForFirebase.firebaseApp
}

export function getFirestore(): admin.firestore.Firestore {
  return getFirebaseApp().firestore()
}

export const db = {
  collection: (name: string) => getFirestore().collection(name),
}
