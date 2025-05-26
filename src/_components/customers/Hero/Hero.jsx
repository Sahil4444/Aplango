import React from "react";
import { motion } from "framer-motion";
import logo from "../../../assets/logo.png";
import offerbg from "../../../assets/offers-bg.jpg";
import { useNavigate, useLocation } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginClick = (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    navigate("/login"); // Redirect to home
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll down smoothly
    }, 100); // Normal About Us navigation
  };

  const handleScrollLogin = (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    navigate("/ui"); // Redirect to home
    setTimeout(() => {
      window.scrollTo({ top: 650, behavior: "smooth" }); // Scroll down smoothly
    }, 100); // Normal About Us navigation
  };

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center text-center bg-cover bg-center">
      <img src={offerbg} className="absolute w-full h-screen" alt="" />
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full px-6"
      >
        <img src={logo} alt="logo" className="h-32 mx-auto" />
        <h1 className="md:text-5xl text-3xl w-full font-bold text-indigo-700 mb-4">
          " Unlock Exclusive Deals & Discounts "
        </h1>
        <h1 className="md:text-5xl text-3xl w-full font-bold text-indigo-700 mb-4">
          with
        </h1>
        <h1 className="md:text-8xl text-7xl w-full font-bold text-blue-700 mt-7 mb-4">
          <span className="text-red-600">A</span>plan
          <span className="text-red-600">go</span>
        </h1>
        <p className="md:text-lg text-md text-gray-900 font-semibold mt-14 mb-8">
          Discover the best offers, coupons, and discounts on top brands,
          restaurants, entertainment spots, and more—all in one place.
        </p>
        <div className="flex gap-4 justify-center">
          <button onClick={handleLoginClick} className="bg-indigo-700 text-white hover:cursor-pointer w-32 py-2 rounded-md text-sm font-medium mr-2">
            Get Started
          </button>
        </div>
      </motion.div>
    </section>
  );
}

export default Hero;