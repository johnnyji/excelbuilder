import React, { useContext } from "react";

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

import CheckIcon from "@mui/icons-material/CheckCircle";

import { UserContext } from "../../contexts/User";

const styles = {
  card: {
    margin: 16,
    padding: 16,
    width: 350
  }
};

const plans = [
  {
    title: "Starter",
    tier: 0,
    values: ["7 explains/builds per month"]
  },
  {
    title: "Premium",
    tier: 1,
    values: ["7 explains/builds per month"]
  },
  {
    title: "Premium (Yearly)",
    tier: 2,
    values: ["7 explains/builds per month"]
  }
];

export default function Billing() {
  const user = useContext(UserContext);
  const planList = plans.map(plan => {
    const isCurrentPlan = user.tier === plan.tier;
    return (
      <Card key={plan.title} style={styles.card}>
        <Grid container directon="column" alignItems="center">
          <Grid item xs={12}>
            <Typography variant="h5" align="center" gutterBottom>
              <b>{plan.title}</b>
            </Typography>
          </Grid>
          <Grid alignItems="center" direction="column" container item xs={12}>
            <Button disabled={isCurrentPlan} variant="outlined">
              {isCurrentPlan ? "Current Plan" : "Select This Plan"}
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
