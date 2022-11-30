import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

import { auth, db } from "../firebase";

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

  return [user, authLoading || loading, authError || error];
}
