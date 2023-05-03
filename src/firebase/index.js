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
  limit,
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
    switch (err["code"]) {
      case "auth/account-exists-with-different-credential":
        return Promise.reject(
          "There is already an account with this email. Please try logging in with a different method."
        );
      case "auth/email-already-in-use":
        return Promise.reject("This account already exists, log in instead");
      case "auth/invalid-email":
        return Promise.reject("The email address is invalid");
      case "auth/invalid-password":
        return Promise.reject(
          'Invalid password. If you don\'t remember, click "Forgot Password?"'
        );
      case "auth/user-not-found":
        return Promise.reject("User with this email not found");
      default:
        return Promise.reject(`Invalid sign up/login info. Please try again`);
    }
  } else {
    return Promise.reject(
      `Invalid sign up/login info. Please try again`
      // `Oops, something went wrong! Please contact ${process.env.REACT_APP_SUPPORT_EMAIL}`
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
    return parseAuthError(err);
  }
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return Promise.resolve();
  } catch (err) {
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

const createGeneration = async (user, prompt, completion, system) => {
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
      system,
      userUid: user.uid
    };
    const docRef = await addDoc(collection(db, "completions"), data);
    return docRef;
  } catch (err) {
    console.error(err);
  }
};

const getGenerationByUid = async uid => {
  try {
    console.log(uid);
    const generationQuery = query(
      collection(db, "completions"),
      where("uid", "==", uid),
      limit(1)
    );

    const docs = await getDocs(generationQuery);
    console.log(docs);

    if (docs.docs.length === 1) {
      return Promise.resolve(docs.docs[0].data());
    } else {
      return Promise.resolve(null);
    }
  } catch (err) {
    Promise.reject(err);
  }
};

const getGenerationByPrompt = async (user, prompt, system) => {
  try {
    const generationQuery = query(
      collection(db, "completions"),
      where("userUid", "==", user.uid),
      where("prompt", "==", prompt),
      where("system", "==", system),
      limit(1)
    );
    const docs = await getDocs(generationQuery);
    if (docs.docs.length === 1) {
      return Promise.resolve(docs.docs[0].data());
    } else {
      return Promise.resolve(null);
    }
  } catch (err) {
    Promise.reject(err);
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
  getGenerationByPrompt,
  getGenerationByUid,
  registerWithEmailAndPassword,
  sendPasswordReset,
  stripePayments,
  logout
};
