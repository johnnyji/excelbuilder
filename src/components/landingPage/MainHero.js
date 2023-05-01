import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Button, Typography } from "@mui/material";

import config from "./config.js";

const MainHero = ({ title, ctaText, showSubtitle }) => {
  const { mainHero } = config;
  const navigate = useNavigate();
  const handleSignUp = useCallback(() => {
    navigate("/signin?action=SIGN_UP");
  }, [navigate]);

  return (
    <Box className="text-center" mt={10} sx={{ maxWidth: "md" }}>
      <Box mb={2}>
        {title || (
          <Typography variant="h4" gutterBottom>
            <b>{mainHero.title}</b>
          </Typography>
        )}
      </Box>
      {showSubtitle && (
        <Box mb={2}>
          <Typography variant="subtitle1" gutterBottom>
            {mainHero.subtitle}
          </Typography>
        </Box>
      )}
      <Box display="flex" alignItems="center" justifyContent="center">
        <Typography
          className="text-gray-500"
          variant="body2"
          style={{ maxWidth: 600 }}
        >
          {mainHero.description}
        </Typography>
      </Box>
      <div className="mt-5 mb-10 sm:mt-8 sm:flex sm:justify-center">
        <Button
          color="success"
          onClick={handleSignUp}
          variant="contained"
          style={{ height: 60, width: 300 }}
        >
          <b>{ctaText || mainHero.primaryAction.text}</b>
        </Button>
      </div>
    </Box>
  );
};

export default MainHero;
