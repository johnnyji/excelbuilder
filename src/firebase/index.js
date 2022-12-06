import { initializeApp } from "firebase/app";
import { getFunctions } from "firebase/functions";

import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut
} from "firebase/auth";

import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc
} from "firebase/firestore";

import { getStripePayments } from "@stripe/firestore-stripe-payments";

import { v4 as uuidv4 } from "uuid";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);
const googleProvider = new GoogleAuthProvider();

const stripePayments = getStripePayments(app, {
  productsCollection: "stripeProducts",
  customersCollection: "stripeUsers"
});

const parseAuthError = err => {
  if (typeof err === "object") {
    console.error(err["message"]);
    switch (err["message"]) {
      case "EMAIL_EXISTS":
        return Promise.reject("This account already exists, log in instead");
      case "INVALID_PASSWORD":
        return Promise.reject(
          'Invalid password. If you don\'t remember, click "Forgot Password?"'
        );
      case "EMAIL_NOT_FOUND":
        return Promise.reject("Email not found");
      case "USER_DISABLED":
        return Promise.reject("This user has been disabled");
      default:
        return Promise.reject(
          `Oops, something went wrong! Please contact ${process.env.REACT_APP_SUPPORT_EMAIL}`
        );
    }
  } else {
    return Promise.reject(
      `Oops, something went wrong! Please contact ${process.env.REACT_APP_SUPPORT_EMAIL}`
    );
  }
};

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email
      });
    }
  } catch (err) {
    console.error(err);
  }
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log("post login");
    return Promise.resolve();
  } catch (err) {
    console.log("Error returned: ");
    console.inspect(error);
    return parseAuthError(err);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email
    });
    return Promise.resolve();
  } catch (err) {
    return parseAuthError(err);
  }
};

const createGeneration = async (user, prompt, completion) => {
  try {
    const now = new Date();
    const uid = uuidv4();
    const data = {
      uid,
      prompt,
      completion,
      insertedAt: now,
      updatedAt: now,
      generatedAt: now,
      userUid: user.uid
    };
    await addDoc(collection(db, "generations"), data);
  } catch (err) {
    console.error(err);
  }
};

const sendPasswordReset = async email => {
  try {
    await sendPasswordResetEmail(auth, email);
    return Promise.resolve();
  } catch (err) {
    return parseAuthError(err);
  }
};

const logout = () => {
  signOut(auth);
};

export {
  auth,
  app,
  db,
  functions,
  signInWithGoogle,
  logInWithEmailAndPassword,
  createGeneration,
  registerWithEmailAndPassword,
  sendPasswordReset,
  stripePayments,
  logout
};
