import React from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";

import config from "./config.js";

import firstProductImg from "./assets/first-product-image.png";
import secondProductImg from "./assets/second-product-image.png";
import thirdProductImg from "./assets/third-product-image.png";

const Product = () => {
  const { product } = config;
  const [firstItem, secondItem, thirdItem] = product.items;

  return (
    <Box className="text-center" mt={10} id="product" sx={{ maxWidth: "lg" }}>
      <Typography variant="h4">
        <b>{product.title}</b>
      </Typography>
      <Grid container flexDirection="column" mt={6} spacing={6}>
        <Grid
          item
          container
          sm={12}
          columnSpacing={12}
          rowSpacing={4}
          justfiyContent="space-around"
        >
          <Grid item sm={12} md={6}>
            <h3
              className={`text-3xl text-gray-800 font-bold leading-none mb-3`}
            >
              {firstItem?.title}
            </h3>
            <p className={`text-gray-600`}>{firstItem?.description}</p>
          </Grid>
          <Grid item sm={12} md={6}>
            <Paper elevation={24}>
              <img
                className="h-6/6"
                src={firstProductImg}
                alt={firstItem?.title}
              />
            </Paper>
          </Grid>
        </Grid>
        <Grid
          item
          container
          sm={12}
          columnSpacing={12}
          rowSpacing={4}
          justfiyContent="space-around"
          flexDirection="row-reverse"
        >
          <Grid item sm={12} md={6}>
            <div className={`align-middle`}>
              <h3
                className={`text-3xl text-gray-800 font-bold leading-none mb-3`}
              >
                {secondItem?.title}
              </h3>
              <p className={`text-gray-600`}>{secondItem?.description}</p>
            </div>
          </Grid>
          <Grid item sm={12} md={6}>
            <Paper elevation={24}>
              <img
                className="h-6/6"
                src={secondProductImg}
                alt={secondItem?.title}
              />
            </Paper>
          </Grid>
        </Grid>
        <Grid
          item
          container
          sm={12}
          columnSpacing={12}
          rowSpacing={4}
          justfiyContent="space-around"
        >
          <Grid item sm={12} md={6}>
            <h3
              className={`text-3xl text-gray-800 font-bold leading-none mb-3`}
            >
              {thirdItem?.title}
            </h3>
            <p className={`text-gray-600`}>{thirdItem?.description}</p>
          </Grid>
          <Grid item sm={12} md={6}>
            <Paper elevation={24}>
              <img
                className="h-6/6"
                src={thirdProductImg}
                alt={thirdItem?.title}
              />
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Product;
