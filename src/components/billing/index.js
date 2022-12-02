import React, { useCallback, useContext, useEffect, useState } from "react";

import { useSearchParams } from "react-router-dom";

import { useSnackbar } from "notistack";

import {
  Button,
  Card,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography
} from "@mui/material";

import {
  createCheckoutSession,
  getProducts
} from "@stripe/firestore-stripe-payments";

import { stripePayments } from "../../firebase";

import { UserContext } from "../../contexts/User";

import DashboardError from "../ui/DashboardError";
import DashboardWrapper from "../ui/DashboardWrapper";
import Emoji from "../ui/Emoji";
import FullPageSpinner from "../ui/FullPageSpinner";

const styles = {
  card: {
    margin: 16,
    padding: 16,
    width: 350
  }
};

// PREMIUM / PREMIUM_Y must be set as a metadata item of `id=PREMIUM(_Y)`
// on the respective Stripe products of  in order for the following module work
const plans = {
  PREMIUM: {
    title: "Premium",
    tier: 1,
    values: ["7 explains/builds per month"]
  },
  PREMIUM_Y: {
    title: "Premium (Yearly)",
    tier: 2,
    values: ["7 explains/builds per month"]
  }
};

export default function Billing() {
  // TODO:
  //
  // 1. Make sure cancel/success redirects notify a snackbar
  // 2. Make sure error states are recognized on this page
  const user = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [checkoutSessionLoading, setCheckoutSessionLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const postBillingRedirect = searchParams.get("billing_redirect");

  useEffect(() => {
    // If we come back to this page from the Stripe billing page,
    // we want to make sure that we remove the checkout session loading spinner
    setCheckoutSessionLoading(false);

    if (postBillingRedirect === "CANCEL") {
      setSearchParams(searchParams.delete("billing_redirect"));
      enqueueSnackbar("Oops, your payment did not go through.", {
        preventDuplicate: true,
        variant: "error"
      });
    }
  }, [
    setCheckoutSessionLoading,
    enqueueSnackbar,
    postBillingRedirect,
    searchParams,
    setSearchParams
  ]);

  useEffect(() => {
    setProductsLoading(true);

    getProducts(stripePayments, {
      includePrices: true,
      activeOnly: true
    })
      .then(products => {
        setProducts(products);
      })
      .catch(error => {
        setProductsError(error);
      })
      .finally(() => {
        setProductsLoading(false);
      });
  }, [setProductsLoading, setProductsError, setProducts]);

  const handleSelectPlan = useCallback(
    e => {
      setCheckoutSessionLoading(true);

      const priceId = e.target.getAttribute("name");
      createCheckoutSession(stripePayments, {
        price: priceId,
        success_url: `${window.location.origin}?billing_redirect=SUCCESS`,
        cancel_url: `${window.location.origin}/billing?billing_redirect=CANCEL`
      })
        .then(session => {
          window.location.assign(session.url);
        })
        .catch(error => {
          enqueueSnackbar(
            `Error contacting payment processor Stripe. Please try again later or contact ${process.env.REACT_APP_SUPPORT_EMAIL} for support!`,
            { variant: "error", preventDuplicate: true }
          );
        });
    },
    [enqueueSnackbar, setCheckoutSessionLoading]
  );

  const planList = products.map(product => {
    const plan = plans[product.metadata.id];
    const priceId = product.prices[0].id;
    const isCurrentPlan = user.tier === plan.tier;

    let buttonText = "Select This Plan";
    if (isCurrentPlan) buttonText = "Current Plan";

    return (
      <Card key={plan.title} style={styles.card}>
        <Grid container directon="column" alignItems="center">
          <Grid item xs={12}>
            <Typography variant="h5" align="center" gutterBottom>
              <b>{plan.title}</b>
            </Typography>
          </Grid>
          <Grid alignItems="center" direction="column" container item xs={12}>
            <Button
              disabled={isCurrentPlan}
              name={priceId}
              onClick={handleSelectPlan}
              variant="outlined"
            >
              {buttonText}
            </Button>
          </Grid>
          <Grid item xs={12}>
            <List>
              {plan.values.map((value, index) => (
                <ListItem key={`${plan.title}-value-${index}`}>
                  <ListItemIcon>
                    <Emoji symbol="✅ " />
                  </ListItemIcon>
                  <ListItemText primary={value} />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </Card>
    );
  });

  return (
    <DashboardWrapper title="Billing">
      {(checkoutSessionLoading || productsLoading) && <FullPageSpinner />}
      {productsError && (
        <DashboardError
          message={`There was an issue loading subscription plans. Please refresh the page to try again or contact ${process.env.REACT_APP_SUPPORT_EMAIL} for help.`}
        />
      )}
      {planList}
    </DashboardWrapper>
  );
}
