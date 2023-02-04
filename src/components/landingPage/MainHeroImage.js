import React from "react";
import { Paper } from "@mui/material";

import landingHeroGif from "./assets/landing-page-hero.gif";

const MainHeroImage = () => {
  return (
    <Paper
      elevation={24}
      style={{
        background: "green",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        zIndex: 1
      }}
    >
      <img src={landingHeroGif} />
    </Paper>
  );
};

export default MainHeroImage;
