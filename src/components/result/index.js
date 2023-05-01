import React from "react";
import { Box, Typography } from "@mui/material";

import Header from "../landingPage/Header";

import ResultDisplay from "./ResultDisplay";

import MainHero from "../landingPage/MainHero";
import MainHeroImage from "../landingPage/MainHeroImage";
import Canvas from "../landingPage/Canvas";
import Footer from "../landingPage/Footer";

const ContentWrapper = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "sm",
        margin: "0 16px"
      }}
    >
      {children}
    </Box>
  );
};

export default function Result() {
  return (
    <div>
      <Header />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <ContentWrapper>
          <ResultDisplay />
        </ContentWrapper>
        <ContentWrapper>
          <MainHero
            ctaText="Try for free"
            showSubtitle={false}
            title={
              <Typography variant="h6">
                Write Excel/Sheets/Airtable formulas <b>in seconds</b> using AI
              </Typography>
            }
          />
          <MainHeroImage />
        </ContentWrapper>
        <Canvas />
        <Footer showSections={false} />
      </Box>
    </div>
  );
}
