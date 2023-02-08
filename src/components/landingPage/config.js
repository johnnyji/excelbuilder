import { useEffect, useState } from "react";
import TextTransition, { presets } from "react-text-transition";

import stylishUnderline from "./assets/stylish-underline.png";
import subtitleSlogan from "./assets/subtitle-slogan.png";

const systems = ["Excel", "Sheets", "Airtable"];

function Title() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => setIndex(index => index + 1), 2500);
    return () => clearTimeout(intervalId);
  }, []);

  return (
    <>
      Write{" "}
      <TextTransition inline springConfig={presets.wobbly}>
        <div
          style={{
            backgroundPosition: "50% 110%",
            backgroundSize: "80%",
            backgroundRepeat: "no-repeat",
            backgroundImage: `url(${stylishUnderline})`,
            margin: -32,
            padding: 32
          }}
        >
          {systems[index % systems.length]}
        </div>
      </TextTransition>{" "}
      formulas <em>in seconds</em> with AI
    </>
  );
}

const config = {
  company: {
    name: "Excel Formulator"
  },
  navigation: [
    {
      name: "Features",
      href: "product"
    },
    {
      name: "Pricing",
      href: "pricing"
    }
  ],
  callToAction: {
    text: "Start For Free"
  },
  mainHero: {
    title: <Title />,
    subtitle: (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <img
          src={subtitleSlogan}
          alt="Your personal spreadsheet buddy (that knows everything!)"
          style={{ maxHeight: 80 }}
        />
      </div>
    ),
    // subtitle: "",
    description:
      "Describe what your formula should do and Excel Formulator will generate you a valid Excel/Sheets/Airtable formula in seconds! Work smarter, not harder 😉",
    img: "/assets/images/happyTeam.jpeg",
    primaryAction: {
      text: "Start Here (It's free!)",
      href: "#"
    },
    secondaryAction: {
      text: "Email us",
      href: "mailto:issaafakattan@gmail.com?subject=I like react landing page!"
    }
  },
  product: {
    title: "Your personal AI powered spreadsheet assisant!",
    items: [
      {
        title: "Convert any text prompt into a formula",
        description:
          'Provide any simple text prompt (in any language) and hit "Generate" to see Excel Formulator turn it into a valid Excel/Sheets/Airtable formula in seconds!'
      },
      {
        title: "Explain complex (or simple) formulas with ease",
        description:
          "Excel Formulator can also explain any existing Excel/Sheets/Airtable formula to you in plain easy to understand english, no more guessing what a super conf formula does!"
      },
      {
        title: "Optimized for all systems",
        description:
          "Excel Formulator is not just for Microsoft Excel! It's also optimized for Google Sheets and Airtable. (Have another system in mind that we don't support? Message us and we'll get it added for you, guaranteed!)"
      }
    ]
  },
  pricing: {
    title: "Pricing",
    items: [
      {
        name: "Starter",
        price: "",
        priceDetails: "Free forever!",
        features: ["7 formulas per month", "Basic email support"]
      },
      {
        name: "Pro",
        price: "$5.99",
        priceDetails: "per month",
        features: [
          "Unlimited formulas!",
          "Priority email support",
          "Early access to features"
        ]
      },
      {
        name: "Pro (Annual)",
        price: "$4.49",
        priceDetails: "per month (paid annual)",
        features: [
          "Unlimited formulas!",
          "Priority email support",
          "Early access to features"
        ]
      }
    ]
  },
  about: {
    sections: [
      {
        name: "Features",
        href: "product",
        content:
          "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English."
      },
      {
        name: "Pricing",
        href: "pricing",
        content:
          "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English."
      }
    ],
    socialMedia: {
      tiktok: "https://www.tiktok.com/@excelformulator"
    }
  }
};

export default config;
