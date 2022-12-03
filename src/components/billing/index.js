import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSnackbar } from "notistack";

import { httpsCallable } from "firebase/functions";
import moment from "moment";

import {
  Alert,
  Box,
  Button,
  Card,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography
} from "@mui/material";

import { createCheckoutSession } from "@stripe/firestore-stripe-payments";

import { functions, stripePayments } from "../../firebase";

import { UserContext } from "../../contexts/User";

import useStripeProducts from "../../hooks/useStripeProducts";

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
  STARTER: {
    title: "Starter",
    values: ["7 explains/builds per month"]
  },
  PREMIUM: {
    title: "Premium",
    values: ["7 explains/builds per month"]
  },
  PREMIUM_Y: {
    title: "Premium (Yearly)",
    values: ["7 explains/builds per month"]
  }
};

// We define this here as a dummy product because this isn't actually a product in Stripe
const starterPlanProduct = {
  metadata: {
    id: "STARTER"
  },
  prices: [{ id: null }]
};

export default function Billing() {
  const user = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const {
    isLoading: productsLoading,
    isError: productsError,
    data: products
  } = useStripeProducts();
  const [billingSessionLoading, setBillingSessionLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const postBillingRedirect = searchParams.get("billing_redirect");

  useEffect(() => {
    // If we come back to this page from the Stripe billing page,
    // we want to make sure that we remove the checkout session loading spinner
    setBillingSessionLoading(false);

    if (postBillingRedirect === "CANCEL") {
      setSearchParams(searchParams.delete("billing_redirect"));
      enqueueSnackbar("Oops, your payment did not go through.", {
        preventDuplicate: true,
        variant: "error"
      });
    }
  }, [
    setBillingSessionLoading,
    enqueueSnackbar,
    postBillingRedirect,
    searchParams,
    setSearchParams
  ]);

  const handleManagePlan = useCallback(() => {
    setBillingSessionLoading(true);
    const stripeCustomerPortalRef = httpsCallable(
      functions,
      "ext-firestore-stripe-payments-createPortalLink"
    );

    stripeCustomerPortalRef({
      returnUrl: `${window.location.origin}/billing`
    })
      .then(({ data }) => {
        window.location.assign(data.url);
      })
      .catch(_ => {
        setBillingSessionLoading(false);
        enqueueSnackbar(
          `Error contacting payment processor Stripe to manage your subscription. Please try again later or contact ${process.env.REACT_APP_SUPPORT_EMAIL} for support!`,
          { variant: "error", preventDuplicate: true }
        );
      });

    return;
  }, [enqueueSnackbar, setBillingSessionLoading]);

  const handleSelectPlan = useCallback(
    e => {
      setBillingSessionLoading(true);
      const priceId = e.target.getAttribute("name");

      createCheckoutSession(stripePayments, {
        price: priceId,
        success_url: `${window.location.origin}?billing_redirect=SUCCESS`,
        cancel_url: `${window.location.origin}/billing?billing_redirect=CANCEL`
      })
        .then(session => {
          window.location.assign(session.url);
        })
        .catch(_ => {
          setBillingSessionLoading(false);
          enqueueSnackbar(
            `Error contacting payment processor Stripe. Please try again later or contact ${process.env.REACT_APP_SUPPORT_EMAIL} for support!`,
            { variant: "error", preventDuplicate: true }
          );
        });
    },
    [enqueueSnackbar, setBillingSessionLoading]
  );

  const isStarterPlan = user.subscriptionPlanKey === "STARTER";

  const planList = [starterPlanProduct].concat(products).map(product => {
    const plan = plans[product.metadata.id];
    const priceId = product.prices[0].id;
    const isCurrentPlan = user.subscriptionPlanKey === product.metadata.id;

    let buttonText = "Select New Plan";
    if (isCurrentPlan) buttonText = "Manage My Plan";
    if (isCurrentPlan && isStarterPlan) buttonText = "Current Plan";

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
              disabled={isCurrentPlan && isStarterPlan}
              name={priceId}
              onClick={handleSelectPlan}
              variant={isCurrentPlan ? "outlined" : "contained"}
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

  const managePlan = (
    <>
      <Typography variant="h6" gutterBottom>
        <b>Plan: {plans[user.subscriptionPlanKey].title}</b>
      </Typography>
      {user.subscriptionPlan?.cancel_at_period_end && (
        <Box mb={2}>
          <Alert severity="warning">
            Your plan has been successfully canceled. Your current plan will
            remain active until{" "}
            <b>
              {moment(user.subscriptionPlan.current_period_end).format(
                "MMM Do YYYY"
              )}
            </b>
            . We're sad to see you go <Emoji symbol="😭" />, if there is
            anything we can do to help you stay, please email{" "}
            {process.env.REACT_APP_SUPPORT_EMAIL}
          </Alert>
        </Box>
      )}
      <Button onClick={handleManagePlan} variant="contained">
        {user.subscriptionPlan?.cancel_at_period_end
          ? "Renew Plan"
          : "Manage Plan"}
      </Button>
    </>
  );

  return (
    <DashboardWrapper title="Billing">
      {(billingSessionLoading || productsLoading) && <FullPageSpinner />}
      {productsError && (
        <DashboardError
          message={`There was an issue loading subscription plans. Please refresh the page to try again or contact ${process.env.REACT_APP_SUPPORT_EMAIL} for help.`}
        />
      )}
      {user.subscriptionPlanKey === "STARTER" ? planList : managePlan}
    </DashboardWrapper>
  );
}
