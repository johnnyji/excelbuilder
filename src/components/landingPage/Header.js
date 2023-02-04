import React, { useCallback, Fragment } from "react";
import { useNavigate } from "react-router-dom";

import { Popover, Transition } from "@headlessui/react";
import { Link } from "react-scroll";

import { Button, Typography } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import LogoIcon from "@mui/icons-material/Task";

import config from "./config.js";
import colors from "../../config/colors";

const Menu = () => {
  const navigate = useNavigate();
  const { navigation, company, callToAction } = config;
  const { name: companyName, logo } = company;

  const handleSignIn = useCallback(() => {
    navigate("/signin?action=LOGIN");
  }, [navigate]);

  const handleSignUp = useCallback(() => {
    navigate("/signin?action=SIGN_UP");
  }, [navigate]);

  return (
    <>
      <Popover>
        <div className="bg-white relative pt-6 px-4 sm:pt-4 sm:px-6 lg:px-8">
          <nav
            className="bg-white relative flex items-center justify-between sm:h-10"
            aria-label="Global"
          >
            <div className="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
              <div className="flex items-center justify-between w-full md:w-auto">
                <a
                  href="/"
                  style={{
                    alignItems: "center",
                    cursor: "pointer",
                    display: "flex"
                  }}
                >
                  <LogoIcon
                    sx={{ color: colors.brandPrimary, marginRight: 1 }}
                  />
                  <Typography variant="h6">
                    <b>{companyName}</b>
                  </Typography>
                </a>
                <div className="-mr-2 flex items-center md:hidden">
                  <Popover.Button
                    className={`bg-background rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-secondary`}
                  >
                    <span className="sr-only">Open main menu</span>
                    <MenuIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>
            </div>
            <div className="hidden md:block md:ml-10 md:pr-4 md:space-x-8">
              {navigation.map(item => (
                <Link
                  spy={true}
                  active="active"
                  smooth={true}
                  duration={1000}
                  key={item.name}
                  to={item.href}
                  className="font-medium text-gray-500 hover:text-gray-900"
                >
                  {item.name}
                </Link>
              ))}
              <Button
                className={`font-medium text-primary hover:text-secondary`}
                onClick={handleSignIn}
                variant="outlined"
              >
                Login
              </Button>
              <Button
                className={`font-medium text-primary hover:text-secondary`}
                onClick={handleSignUp}
                variant="contained"
              >
                Sign Up
              </Button>
            </div>
          </nav>
        </div>

        <Transition
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            focus
            className="absolute z-10 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
          >
            <div
              className={`rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden`}
            >
              <div className="px-5 pt-4 flex items-center justify-between">
                <div>
                  <img className="h-8 w-auto" src={logo} alt="" />
                </div>
                <div className="-mr-2">
                  <Popover.Button
                    className={`bg-background rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-secondary`}
                  >
                    <span className="sr-only">Close main menu</span>
                    <CloseIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>
              <div
                className="px-2 pt-2 pb-3 space-y-1"
                style={{ marginTop: "-3em" }}
              >
                {navigation.map(item => (
                  <Link
                    spy={true}
                    active="active"
                    smooth={true}
                    duration={1000}
                    key={item.name}
                    to={item.href}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <Button color="success" className={`block w-full text-center`}>
                <b>{callToAction.text}</b>
              </Button>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    </>
  );
};

export default Menu;
