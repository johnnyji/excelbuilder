import React from "react";

import Header from "./Header";
import MainHero from "./MainHero";
import MainHeroImage from "./MainHeroImage";

export default function LandingPage() {
  return (
    <div className={`bg-background grid overflow-hidden`}>
      <Header />
      <div className={`relative bg-background`}>
        <div className="max-w-7xl mx-auto">
          <div
            className={`relative z-10 pb-8 bg-background sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32`}
          >
            <MainHero />
          </div>
        </div>
        <MainHeroImage />
      </div>
    </div>
  );
}
