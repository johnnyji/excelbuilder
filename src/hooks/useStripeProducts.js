import { useQuery } from "react-query";
import { getProducts } from "@stripe/firestore-stripe-payments";
import { stripePayments } from "../firebase";

export default function useStripeProducts() {
  return useQuery(
    "stripeProducts",
    () =>
      getProducts(stripePayments, { includePrices: true, activeOnly: true }),
    { initialData: [] }
  );
}
