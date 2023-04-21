import React from "react";
import { Box } from "@mui/material";

import Header from "./Header";
import MainHero from "./MainHero";
import MainHeroImage from "./MainHeroImage";
import LazyShow from "./LazyShow";
import Canvas from "./Canvas";
import Product from "./Product";
import Pricing from "./Pricing";
import Footer from "./Footer";

const ContentWrapper = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "lg",
        margin: "0 16px"
      }}
    >
      {children}
    </Box>
  );
};

export default function LandingPage() {
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
          <MainHero />
          <MainHeroImage />
        </ContentWrapper>
        <LazyShow>
          <Canvas />
        </LazyShow>
        <ContentWrapper>
          <Product />
        </ContentWrapper>
        <LazyShow>
          <Canvas />
          <Pricing />
          <Canvas />
          <Footer />
        </LazyShow>
      </Box>
    </div>
  );
}
