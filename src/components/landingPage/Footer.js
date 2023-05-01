import React from "react";
import { Link } from "react-router-dom";

import TikTokIcon from "../ui/icons/TikTok";
import config from "./config";

const Footer = ({ showSections }) => {
  const { about } = config;
  const { socialMedia, sections } = about;

  return (
    <div
      id="about"
      className="mx-auto container xl:px-20 lg:px-12 sm:px-6 px-4 py-12"
    >
      <div className="flex flex-col items-center justify-center">
        {showSections && (
          <div className="flex flex-wrap sm:gap-10 gap-8 items-center justify-center mt-4 h-12">
            {sections.map((section, index) => (
              <a
                key={`${section.name}-${index}`}
                href={section.href}
                classNam="hover:text-primary text-base cursor-pointer leading-4 text-gray-800 dark:text-gray-400 dark:hover:text-white"
              >
                {section.name}
              </a>
            ))}
          </div>
        )}
        <div className="flex items-center gap-x-8 mt-6 h-8">
          <a
            aria-label="tiktok"
            href={socialMedia.tiktok}
            target="_blank"
            rel="noreferrer"
          >
            <TikTokIcon />
          </a>
        </div>
        <div className="flex items-center mt-6">
          <p className="mt-6 text-xs lg:text-sm leading-none text-gray-900 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Excel Formulator |{" "}
            {<Link to="/privacy_policy">Privacy Policy</Link>} |{" "}
            {<Link to="/terms_of_service">Terms of Service</Link>}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
