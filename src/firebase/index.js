import { initializeApp } from "firebase/app";

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
  apiKey: "AIzaSyA4DO6CUdnEjSxwG1ozi6kaw42YI_sZHdg",
  authDomain: "excelbuilder.firebaseapp.com",
  projectId: "excelbuilder",
  storageBucket: "excelbuilder.appspot.com",
  messagingSenderId: "751392564220",
  appId: "1:751392564220:web:8b6abe0af24437c4520879",
  measurementId: "G-VN9NTD5W2V"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const stripePayments = getStripePayments(app, {
  productsCollection: "stripeProducts",
  customersCollection: "users"
});

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
        email: user.email,
        tier: 0
      });
    }
  } catch (err) {
    debugger;
    console.error(err);
    alert(err.message);
  }
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
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
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const createGeneration = async (user, prompt, completion) => {
  debugger;
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
    alert(err.message);
  }
};

const sendPasswordReset = async email => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
};

export {
  auth,
  app,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  createGeneration,
  registerWithEmailAndPassword,
  sendPasswordReset,
  stripePayments,
  logout
};
