import React, { useCallback, useContext, useEffect, useState } from "react";

import {
  Button,
  Card,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
} from "@mui/material";

import CheckIcon from "@mui/icons-material/CheckCircle";

import {
  createCheckoutSession,
  getProducts,
} from "@stripe/firestore-stripe-payments";

import { stripePayments } from "../../firebase";

import { UserContext } from "../../contexts/User";

const styles = {
  card: {
    margin: 16,
    padding: 16,
    width: 350,
  },
};

const plans = {
  PREMIUM: {
    title: "Premium",
    tier: 1,
    values: ["7 explains/builds per month"],
  },
  PREMIUM_Y: {
    id: "PREMIUM_Y",
    title: "Premium (Yearly)",
    tier: 2,
    values: ["7 explains/builds per month"],
  },
};

export default function Billing() {
  // TODO:
  //
  // 1. Make sure cancel/success redirects notify a snackbar
  // 2. Make sure error states are recognized on this page
  const user = useContext(UserContext);
  const [checkoutError, setCheckoutError] = useState(null);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProductsLoading(true);

    getProducts(stripePayments, {
      includePrices: true,
      activeOnly: true,
    })
      .then((products) => {
        setProducts(products);
      })
      .catch((error) => {
        setProductsError(error);
      })
      .finally(() => {
        setProductsLoading(false);
      });
  }, [setProductsLoading, setProductsError, setProducts]);

  const handleSelectPlan = useCallback(
    (e) => {
      const priceId = e.target.getAttribute("name");
      createCheckoutSession(stripePayments, {
        price: priceId,
      })
        .then((session) => {
          window.location.assign(session.url);
        })
        .catch((error) => {
          setCheckoutError(error);
        });
    },
    [setCheckoutError]
  );

  const planList = products.map((product) => {
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
                    <CheckIcon />
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
    <>
      <Typography variant="h4">
        <b>Billing</b>
      </Typography>
      {planList}
    </>
  );
}
