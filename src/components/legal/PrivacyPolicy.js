import React from "react";
import { Container, Divider, Typography } from "@mui/material";

import Emoji from "../ui/Emoji";
import Header from "../landingPage/Header";

const styles = {
  main: {
    marginBottom: 64,
    marginTop: 64
  }
};

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <Container maxWidth="md" style={styles.main}>
        <Typography gutterBottom variant="h3">
          <b>
            Privacy Policy <Emoji symbol="🥱" />
          </b>
        </Typography>
        <Divider style={{ marginBottom: 32 }} />
        <Typography variant="h6" gutterBottom>
          1. Information we collect
        </Typography>
        <Typography variant="body1" paragraph>
          We collect information about you when you use our app, including:
        </Typography>
        <ul style={{ marginBottom: 32 }}>
          <li>
            <Typography variant="body2">
              Personal information: We may collect personal information such as
              your name, email address, and billing information when you sign up
              for a subscription.
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              Usage information: We may collect information about how you use
              our app, such as the formulas you generate, the pages you visit,
              and the features you use.
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              Device information: We may collect information about the device
              you use to access our app, such as your device type, operating
              system, and browser type.
            </Typography>
          </li>
        </ul>
        <Typography variant="h6" gutterBottom>
          2. How we use your information
        </Typography>
        <Typography variant="body1" paragraph>
          We may use the information we collect from you for the following
          purposes:
        </Typography>
        <ul style={{ marginBottom: 32 }}>
          <li>
            <Typography variant="body2">
              To provide and maintain our app: We use your information to
              provide you with access to our app and to maintain and improve its
              functionality.
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              To personalize your experience: We may use your information to
              personalize your experience with our app, such as by providing you
              with customized recommendations based on your usage.
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              To communicate with you: We may use your information to
              communicate with you about our app, including sending you updates
              and notifications.
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              To enforce our policies and terms of service: We may use your
              information to enforce our policies and terms of service, and to
              prevent or detect fraud, security breaches, and other illegal
              activities.
            </Typography>
          </li>
        </ul>
        <Typography variant="h6" gutterBottom>
          3. How we share your information
        </Typography>
        <Typography variant="body1" paragraph>
          We may share your information with third parties in the following
          circumstances:
        </Typography>
        <ul style={{ marginBottom: 32 }}>
          <li>
            <Typography variant="body2">
              With service providers: We may share your information with service
              providers who help us operate our app, such as payment processors
              and customer support providers.
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              With our affiliates: We may share your information with our
              affiliates, such as companies that are part of the same corporate
              group as us.
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              With your consent: We may share your information with third
              parties if you give us your consent to do so.
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              For legal reasons: We may share your information with third
              parties if we believe it is necessary to comply with a legal
              obligation or to protect our rights, property, or safety or the
              rights, property, or safety of others.
            </Typography>
          </li>
        </ul>
        <Typography variant="h6" gutterBottom>
          4. How we protect your information
        </Typography>
        <Typography variant="body1" paragraph>
          We take reasonable measures to protect your information from
          unauthorized access, use, or disclosure. These measures include:
        </Typography>
        <ul style={{ marginBottom: 32 }}>
          <li>
            <Typography variant="body2">
              Encryption: We use encryption to protect your information in
              transit between your device and our servers.
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              Access controls: We limit access to your information to authorized
              personnel who need it to perform their job functions.
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              Data retention: We retain your information only for as long as
              necessary to provide you with access to our app and to comply with
              our legal obligations.
            </Typography>
          </li>
        </ul>
        <Typography variant="h6" gutterBottom>
          5. Your rights and choices
        </Typography>
        <Typography variant="body1" paragraph>
          You have certain rights and choices regarding the information we
          collect from you, including:
        </Typography>
        <ul style={{ marginBottom: 32 }}>
          <li>
            <Typography variant="body2">
              Access and correction: You may request access to or correction of
              your information by contacting us at the email address listed
              below.
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              Opt-out: You may opt out of receiving promotional emails from us
              by following the instructions in those emails.
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              Do not track: Our app does not respond to Do Not Track signals
              from your browser.
            </Typography>
          </li>
        </ul>
        <Typography variant="h6" gutterBottom>
          6. Changes to this policy
        </Typography>
        <Typography variant="body1" paragraph>
          We may update this policy from time to time by posting a revised
          version on our website. The revised version will be effective as of
          the date it is posted.
        </Typography>
        <Typography variant="h6" gutterBottom>
          7. Contact us
        </Typography>
        <Typography variant="body1" paragraph>
          If you have any questions or concerns about this policy or our
          practices, please contact us at {process.env.REACT_APP_SUPPORT_EMAIL}
        </Typography>
      </Container>
    </>
  );
}
