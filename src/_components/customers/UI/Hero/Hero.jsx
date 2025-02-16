import React from "react";
import { motion } from "framer-motion";
import offerbg from "./bg2.jpg";
import OffersPage from "./Page";

function Hero() {
  return (
    <section className="relative w-full md:h-screen flex flex-col items-center justify-center text-center bg-cover bg-center">
      <img src={offerbg} className="absolute w-full h-screen" alt="" />
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full px-6"
      >
        <OffersPage />
      </motion.div>
    </section>
  );
}

export default Hero;
