import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// Read service account key
/*const serviceAccount = JSON.parse(
  fs.readFileSync(path.resolve("src/lib/serviceAccountKey.json"), "utf-8")
);*/
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = getFirestore();
export const auth = getAuth();
export { admin };
