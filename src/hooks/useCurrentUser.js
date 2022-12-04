import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

import {
  getCurrentUserSubscriptions,
  getProduct,
} from "@stripe/firestore-stripe-payments";

import { stripePayments } from "../firebase";

import { auth, db } from "../firebase";

// https://mrcoles.com/stripe-api-subscription-status/
const paymentDelinquentStatuses = [
  "incomplete",
  "incomplete_expired",
  "past_due",
  "unpaid",
];

export default function useCurrentUser() {
  // The firebase auth user object is not stored in our Firestore main
  // db, instead it is specially allocated to a Firebase managed auth
  // portion of the db
  const [authUser, authLoading, authError] = useAuthState(auth);
  // Therefore, when we retrieve the auth user, we need to use its
  // `uid` to locate the actual user document in our Firestore db
  // (with the fields we care about)
  const q = query(
    collection(db, "users"),
    where("uid", "==", authUser?.uid ?? null)
  );
  const [data, loading, error] = useCollectionData(q, { initialValue: [] });
  const user = data[0];
  const userUid = user?.uid ?? null;

  const [subLoading, setSubLoading] = useState(false);
  const [subError, setSubError] = useState(null);
  const [sub, setSub] = useState(null);
  const [subKey, setSubKey] = useState("STARTER");

  useEffect(() => {
    if (userUid) {
      const loadSubInfo = async () => {
        try {
          setSubError(null);
          setSubLoading(true);

          const subscriptions = await getCurrentUserSubscriptions(
            stripePayments,
            { status: ["active", ...paymentDelinquentStatuses] }
          );

          const subscription = subscriptions.sort(
            (a, b) => b.created - a.created
          )[0];

          const productId = subscription?.product ?? null;

          const product = await (productId
            ? getProduct(stripePayments, productId)
            : Promise.resolve(null));

          setSub(subscription ?? null);
          setSubKey(product?.metadata?.id ?? "STARTER");
          setSubLoading(false);
        } catch (e) {
          setSubError(e);
          setSubLoading(false);
        }
      };

      loadSubInfo();
    }
  }, [userUid]);

  const isLoading = authLoading || loading || subLoading;
  const isError = authError || error || subError;

  if (authError) console.error("Firebase Auth Error: ", authError);
  if (error) console.error("Firebase User Collection Query Error:", error);
  if (subError) console.error("Firebase Stripe Sub Error:", subError);

  const currentUser = user
    ? {
        ...user,
        name: authUser?.displayName ?? null,
        photoURL: authUser?.photoURL ?? null,
        subscriptionPlan: sub,
        subscriptionPlanKey: subKey,
        paymentDelinquent: paymentDelinquentStatuses.includes(sub?.status),
      }
    : null;
  return [currentUser, isLoading, isError];
}
