import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSnackbar } from "notistack";

import { httpsCallable } from "firebase/functions";
import accounting from "accounting-js";
import moment from "moment";

import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
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

import { subscriptionPlanKey } from "../../config/billing";

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

const freeUserEmails = [
  "excelbuilderapp@gmail.com",
  "johnny@johnnyji.com",
  "johnny@distru.com",
  "jesse@distru.com"
];

// PREMIUM / PREMIUM_Y must be set as a metadata item of `id=PREMIUM(_Y)`
// on the respective Stripe products of  in order for the following module work
const plans = {
  STARTER: {
    title: "Starter",
    values: ["7 formulas per month", "Basic email support"]
  },
  PREMIUM: {
    title: "Pro",
    values: ["Unlimited formulas!", "Priority email support"]
  },
  PREMIUM_Y: {
    title: "Pro (Annual)",
    values: [
      "Unlimited formulas!",
      "Priority email support",
      <>
        <b>25% cheaper</b> than monthly!
      </>
    ]
  }
};

// We define this here as a dummy product because this isn't actually a product in Stripe
const starterPlanProduct = {
  metadata: {
    id: subscriptionPlanKey.STARTER
  },
  prices: [{ id: null, unit_amount: 0 }]
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
      returnUrl: `${window.location.origin}/app/billing`
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
        allow_promotion_codes: freeUserEmails.includes(user.email),
        success_url: `${window.location.origin}/app?billing_redirect=SUCCESS`,
        cancel_url: `${window.location.origin}/app/billing?billing_redirect=CANCEL`
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
    [enqueueSnackbar, setBillingSessionLoading, user.email]
  );

  const isStarterPlan =
    user.subscriptionPlanKey === subscriptionPlanKey.STARTER;

  const fullProducts = [starterPlanProduct].concat(products);

  const currentProduct = fullProducts.find(
    x => x.metadata.id === user.subscriptionPlanKey
  );

  const renderPlan = product => {
    const plan = plans[product.metadata.id];
    const price = product.prices[product.prices.length - 1];
    const priceFormatted =
      price.unit_amount === 0
        ? "Free"
        : accounting.formatMoney(price.unit_amount / 100, { precision: 2 });

    const isCurrentProduct =
      product.metadata.id === currentProduct?.metadata?.id;

    let buttonText = "Select New Plan";
    if (isCurrentProduct) buttonText = "Manage My Plan";
    if (isCurrentProduct && isStarterPlan) buttonText = "Current Plan";

    return (
      <Card key={plan.title} style={styles.card}>
        <Grid container directon="column" alignItems="center">
          <Grid
            alignItems="center"
            container
            direction="column"
            item
            mb={4}
            mt={2}
            xs={12}
          >
            <Typography variant="h5" align="center" gutterBottom>
              <b>{plan.title}</b>
            </Typography>
            <Chip
              label={priceFormatted}
              variant="outlined"
              size="small"
              color="success"
            />
          </Grid>
          <Grid
            alignItems="center"
            direction="column"
            container
            item
            xs={12}
            mb={3}
          >
            <Button
              disabled={isCurrentProduct && isStarterPlan}
              name={price.id}
              onClick={handleSelectPlan}
              variant={isCurrentProduct ? "outlined" : "contained"}
            >
              {buttonText}
            </Button>
          </Grid>
          <Grid item xs={12}>
            <List>
              {plan.values.map((value, index) => (
                <ListItem key={`${plan.title}-value-${index}`} dense={true}>
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
  };

  const planList = fullProducts.map(product => {
    return renderPlan(product, false);
  });

  const managePlan = (
    <Card style={styles.card}>
      <Grid container directon="column" alignItems="center">
        <Grid
          alignItems="center"
          container
          direction="column"
          item
          mb={2}
          mt={2}
          xs={12}
        >
          <Typography variant="subtitle1" align="center">
            Current Plan
          </Typography>
          <Typography variant="h4" align="center" gutterBottom>
            <b>{plans[user.subscriptionPlanKey].title}</b>
          </Typography>
        </Grid>
        <Grid
          alignItems="center"
          direction="column"
          container
          item
          xs={12}
          mb={3}
        >
          {user.subscriptionPlan?.cancel_at_period_end && (
            <Box mb={4}>
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
        </Grid>
        <Grid item xs={12}>
          <List>
            {plans[user.subscriptionPlanKey].values.map((value, index) => (
              <ListItem
                key={`${plans[user.subscriptionPlanKey].title}-value-${index}`}
                dense={true}
              >
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

  if (productsLoading) {
    return (
      <DashboardWrapper title="Billing">
        <FullPageSpinner />
      </DashboardWrapper>
    );
  }

  if (productsError) {
    return (
      <DashboardError
        message={`There was an issue loading subscription plans. Please refresh the page to try again or contact ${process.env.REACT_APP_SUPPORT_EMAIL} for help.`}
      />
    );
  }

  return (
    <DashboardWrapper title="Billing">
      {billingSessionLoading && <FullPageSpinner />}
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
      >
        {user.subscriptionPlanKey === subscriptionPlanKey.STARTER
          ? planList
          : managePlan}
      </Grid>
    </DashboardWrapper>
  );
}
