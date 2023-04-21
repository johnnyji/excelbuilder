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
            Terms of Service Agreement <Emoji symbol="🥱" />
          </b>
        </Typography>
        <Divider style={{ marginBottom: 32 }} />
        <section style={{ marginBottom: 32 }}>
          <Typography variant="h5">Description of Service</Typography>
          <Typography paragraph>
            Excel Formulator is a freemium consumer SaaS subscription app that
            uses AI to help users generate excel formulas from plain English.
          </Typography>
        </section>
        <section style={{ marginBottom: 32 }}>
          <Typography variant="h5">User Accounts</Typography>
          <Typography paragraph>
            In order to use the App, you will need to create an account with us.
            You are responsible for maintaining the confidentiality of your
            account login information and are fully responsible for all
            activities that occur under your account. You agree to immediately
            notify us of any unauthorized use, or suspected unauthorized use of
            your account or any other breach of security.
          </Typography>
        </section>
        <section style={{ marginBottom: 32 }}>
          <Typography variant="h5">User Data</Typography>
          <Typography paragraph>
            You own all data that you submit or upload to the App, including any
            formulas or other content generated using the App. You grant us a
            non-exclusive, royalty-free, worldwide license to use, copy, modify,
            distribute, and display such data solely for the purposes of
            providing the App to you and improving our services.
          </Typography>
        </section>
        <section style={{ marginBottom: 32 }}>
          <Typography variant="h5">Fees and Payments</Typography>
          <Typography paragraph>
            The App is offered on a freemium basis, with additional features
            available for purchase. If you choose to purchase additional
            features, you agree to pay the fees associated with those features
            as set forth on our website. All fees are non-refundable.
          </Typography>
        </section>
        <section style={{ marginBottom: 32 }}>
          <Typography variant="h5">Use of App</Typography>
          <Typography paragraph>
            You agree to use the App only for lawful purposes and in accordance
            with this Agreement. You will not use the App in any way that could
            damage, disable, overburden, or impair our servers or networks, or
            interfere with any other user's use and enjoyment of the App.
          </Typography>
        </section>
        <section style={{ marginBottom: 32 }}>
          <Typography variant="h5">Intellectual Property</Typography>
          <Typography paragraph>
            The App and its entire contents, features, and functionality are
            owned by us or our licensors and are protected by international
            copyright, trademark, patent, trade secret, and other intellectual
            property or proprietary rights laws.
          </Typography>
        </section>
        <section style={{ marginBottom: 32 }}>
          <Typography variant="h5">Disclaimers</Typography>
          <Typography paragraph>
            THE APP AND ALL CONTENT, FEATURES, AND FUNCTIONALITY ARE PROVIDED
            "AS IS," WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED,
            INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF
            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR
            NON-INFRINGEMENT.
          </Typography>
        </section>
        <section style={{ marginBottom: 32 }}>
          <Typography variant="h5">Limitation of Liability</Typography>
          <Typography paragraph>
            IN NO EVENT SHALL WE BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
            SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING BUT NOT
            LIMITED TO, DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR
            OTHER INTANGIBLE LOSSES (EVEN IF WE HAVE BEEN ADVISED OF THE
            POSSIBILITY OF SUCH DAMAGES), ARISING OUT OF OR IN CONNECTION WITH
            THE USE OR INABILITY TO USE THE APP OR ANY CONTENT, FEATURES, OR
            FUNCTIONALITY THEREOF.
          </Typography>
        </section>
        <section style={{ marginBottom: 32 }}>
          <Typography variant="h5">Indemnification</Typography>
          <Typography paragraph>
            You agree to indemnify, defend, and hold us harmless from any
            claims, liabilities, damages, judgments, awards, costs, and expenses
            (including reasonable attorneys' fees) arising out of or related to
            your use of the App, any violation of this Agreement, or any
            violation of any rights of another.
          </Typography>
        </section>
        <section style={{ marginBottom: 32 }}>
          <Typography variant="h5">Termination</Typography>
          <Typography paragraph>
            We reserve the right to terminate your access to the App at any time
            for any reason. Upon termination, your right to use the App will
            immediately cease.
          </Typography>
        </section>
        <section style={{ marginBottom: 32 }}>
          <Typography variant="h5">Governing Law</Typography>
          <Typography paragraph>
            This Agreement shall be governed by and construed in accordance with
            the laws of the jurisdiction where we are located, without giving
            effect to any principles of conflicts of law.
          </Typography>
        </section>
        <section style={{ marginBottom: 32 }}>
          <Typography variant="h5">Changes to Agreement</Typography>
          <Typography paragraph>
            We reserve the right to modify this Agreement at any time by posting
            the revised terms on our website. Your continued use of the App
            after any such changes will constitute your acceptance of the
            modified Agreement.
          </Typography>
        </section>
      </Container>
    </>
  );
}
