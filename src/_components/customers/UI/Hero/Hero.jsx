"use client"
import { motion } from "framer-motion"
import offerbg from "./bg2.jpg"
import OffersPage from "./Page"

function Hero() {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Background Image with proper responsive handling */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={offerbg || "/placeholder.svg"}
          className="w-full h-full object-cover object-center"
          alt="Background"
        />
        {/* Optional overlay for better text readability */}
        <div className="absolute inset-0 bg-black/5"></div>
      </div>

      {/* Content Container */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <OffersPage />
      </motion.div>
    </section>
  )
}

export default Hero
