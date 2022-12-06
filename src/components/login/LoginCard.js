import React, { useCallback, useState } from "react";
import { useSnackbar } from "notistack";
import validate from "validate.js";
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Link,
  Paper,
  TextField,
  Typography
} from "@mui/material";

import {
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  signInWithGoogle
} from "../../firebase";

import GoogleIcon from "@mui/icons-material/Google";

const constraints = {
  email: {
    presence: true,
    email: true
  },
  password: {
    presence: true,
    length: {
      minimum: 6,
      message: "Password must be at least 6 chars long"
    }
  },
  passwordConfirmation: {
    presence: true,
    equality: "password"
  }
};

const defaultValues = {
  email: "",
  password: "",
  passwordConfirmation: ""
};

export default function Login() {
  const { enqueueSnackbar } = useSnackbar();
  const [action, setAction] = useState("SIGN_UP");
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState(defaultValues);

  const handleInputChange = useCallback(
    e => {
      const { name: field, value } = e.target;
      const currValues = { ...values, [field]: value };
      setErrors({ ...errors, [field]: null });
      setValues(currValues);
    },
    [errors, setErrors, setValues, values]
  );

  const handleToggleAction = useCallback(
    e => {
      const currAction = e.target.name;
      setValues({ ...values, password: "", passwordConfirmation: "" });
      setAction(currAction);
    },
    [setAction, setValues, values]
  );

  const handleForgot = useCallback(() => {
    const validationErrors = validate(
      { email: values.email },
      { email: constraints.email }
    );

    if (validationErrors) {
      setErrors(validationErrors);
    } else {
      sendPasswordReset(values.email)
        .then(() => {
          enqueueSnackbar(
            "Password reset link sent to your email ✅ (check Spam folder just in case!)",
            {
              variant: "success"
            }
          );
          setValues(defaultValues);
          setAction("LOGIN");
        })
        .catch(err => {
          enqueueSnackbar(err, { preventDuplicate: true, variant: "error" });
        });
    }
  }, [enqueueSnackbar, setAction, values]);

  const handleSignUp = useCallback(() => {
    const validationErrors = validate(values, constraints);

    if (validationErrors) {
      setErrors(validationErrors);
    } else {
      registerWithEmailAndPassword("", values.email, values.password)
        .then(() => {
          enqueueSnackbar("Woohoo! Time to crank some formulas 🎉", {
            variant: "success"
          });
        })
        .catch(err => {
          enqueueSnackbar(err, { preventDuplicate: true, variant: "error" });
        });
    }
  }, [enqueueSnackbar, values]);

  const handleSignIn = useCallback(() => {
    const { passwordConfirmation: _1, ...restValues } = values;
    const { passwordConfirmation: _2, ...restConstraints } = constraints;
    const validationErrors = validate(restValues, restConstraints);

    if (validationErrors) {
      setErrors(validationErrors);
    } else {
      logInWithEmailAndPassword(values.email, values.password).catch(err => {
        enqueueSnackbar(err, { preventDuplicate: true, variant: "error" });
      });
    }
  }, [enqueueSnackbar, setErrors, values]);

  let title;
  let actionVerbage;
  let onAction;

  if (action === "FORGOT") {
    title = "Reset password";
    actionVerbage = "Reset Password";
    onAction = handleForgot;
  }

  if (action === "SIGN_UP") {
    title = "Sign up for free";
    actionVerbage = "Sign Up with Password";
    onAction = handleSignUp;
  }

  if (action === "LOGIN") {
    title = "Login";
    actionVerbage = "Login";
    onAction = handleSignIn;
  }

  return (
    <Paper
      style={{
        paddingTop: 32,
        paddingBottom: 32,
        paddingLeft: 64,
        paddingRight: 64,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: 500
      }}
      variant="outlined"
    >
      <Typography
        align="center"
        variant="h5"
        sx={{ display: "flex", alignItems: "center" }}
      >
        <b>{title}</b>
      </Typography>

      <Box mt={2} mb={2}>
        <Chip
          label="✅ 100% Free, No Credit Card Required"
          variant="outlined"
          color="success"
        />
      </Box>
      <TextField
        fullWidth
        error={Boolean(errors.email)}
        helperText={errors.email}
        label="Email"
        name="email"
        onChange={handleInputChange}
        required
        size="small"
        style={{ marginTop: 16, marginBottom: 16 }}
        value={values.email}
      />
      {(action === "LOGIN" || action === "SIGN_UP") && (
        <TextField
          error={Boolean(errors.password)}
          helperText={errors.password}
          fullWidth
          label="Password"
          name="password"
          onChange={handleInputChange}
          required
          size="small"
          style={{ marginBottom: 16 }}
          type="password"
          value={values.password}
        />
      )}
      {action === "SIGN_UP" && (
        <TextField
          error={Boolean(errors.passwordConfirmation)}
          helperText={errors.passwordConfirmation}
          fullWidth
          label="Confirm Password"
          name="passwordConfirmation"
          onChange={handleInputChange}
          required
          size="small"
          style={{ marginBottom: 16 }}
          type="password"
          value={values.passwordConfirmation}
        />
      )}
      <Button
        onClick={onAction}
        variant="contained"
        size="large"
        style={{ marginBottom: 16 }}
        fullWidth
      >
        {actionVerbage}
      </Button>
      {action === "SIGN_UP" && (
        <Link
          component="button"
          name="LOGIN"
          onClick={handleToggleAction}
          style={{ marginBottom: 24 }}
        >
          Already have an account? Log in
        </Link>
      )}
      {action === "LOGIN" && (
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          style={{ marginBottom: 24 }}
        >
          <Link component="button" name="FORGOT" onClick={handleToggleAction}>
            Forget password?
          </Link>
          <Link component="button" name="SIGN_UP" onClick={handleToggleAction}>
            Sign up
          </Link>
        </Grid>
      )}
      {action === "FORGOT" && (
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          style={{ marginBottom: 24 }}
        >
          <Link component="button" name="LOGIN" onClick={handleToggleAction}>
            Login
          </Link>
          <Link component="button" name="SIGN_UP" onClick={handleToggleAction}>
            Sign Up
          </Link>
        </Grid>
      )}

      <Divider variant="middle" style={{ width: "100%" }} />
      <Button
        onClick={signInWithGoogle}
        startIcon={<GoogleIcon />}
        variant="outlined"
        size="large"
        style={{ marginTop: 16 }}
        fullWidth
      >
        Sign in with Google
      </Button>
      <Box mt={6} sx={{ textAlign: "center" }}>
        <Typography
          variant="caption"
          align="center"
          style={{ color: "rgba(0,0,0,0.5)" }}
        >
          Your info is 100% private/secure. We will never send you
          marketing/unsolicited emails, nor share your email with anyone else.
        </Typography>
      </Box>
    </Paper>
  );
}
