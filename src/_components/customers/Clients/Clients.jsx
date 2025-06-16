"use client"

import { useState, useRef } from "react"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"
import della from "../../../assets/clients/della.jpg";
import dine from "../../../assets/clients/dine.jpg";
import fountains from "../../../assets/clients/fountains.png";
import imagica from "../../../assets/clients/imagica.svg";
import jawed from "../../../assets/clients/jawed habib.webp";
import jazzup from "../../../assets/clients/jazzup.png";
import jd from "../../../assets/clients/jd.png";
import funcity from "../../../assets/clients/logo_funcity.png";
import pizza from "../../../assets/clients/pizza.svg";
import splash from "../../../assets/clients/splash.png";
import srl from "../../../assets/clients/srl.png.webp";
import surya from "../../../assets/clients/surya.svg";
import suzuki from "../../../assets/clients/suzuki.jpg";
import talwalkers from "../../../assets/clients/talwalkers.jpg";
import toss from "../../../assets/clients/toss.jpg";
import yamaha from "../../../assets/clients/yamaha.webp";

const clientslist = [
  {
    cl_name: 1,
    client_img: della,
  },
  {
    cl_name: 2,
    client_img: dine,
  },
  {
    cl_name: 3,
    client_img: fountains,
  },
  {
    cl_name: 4,
    client_img: imagica,
  },
  {
    cl_name: 5,
    client_img: jawed,
  },
  {
    cl_name: 6,
    client_img: jazzup,
  },
  {
    cl_name: 7,
    client_img: jd,
  },
  {
    cl_name: 8,
    client_img: funcity,
  },
  {
    cl_name: 9,
    client_img: pizza,
  },
  {
    cl_name: 10,
    client_img: splash,
  },
  {
    cl_name: 11,
    client_img: srl,
  },
  {
    cl_name: 12,
    client_img: surya,
  },
  {
    cl_name: 13,
    client_img: suzuki,
  },
  {
    cl_name: 14,
    client_img: talwalkers,
  },
  {
    cl_name: 15,
    client_img: toss,
  },
  {
    cl_name: 16,
    client_img: yamaha,
  },
];

export default function Clients() {
  const [isPaused, setIsPaused] = useState(false)
  const [isManualControl, setIsManualControl] = useState(false)
  const [currentTranslate, setCurrentTranslate] = useState(0)
  const carouselRef = useRef(null)
  const itemWidth = 224 // w-56 + gap-8 = 224px + 32px = 256px total
  const totalItems = clientslist.length

  // Duplicate items for seamless infinite scroll
  const duplicatedClients = [...clientslist, ...clientslist, ...clientslist]

  const scrollToNext = () => {
    setIsManualControl(true)
    setCurrentTranslate((prev) => {
      const newTranslate = prev - itemWidth
      // Reset position when reaching the end of second set
      if (Math.abs(newTranslate) >= itemWidth * totalItems * 2) {
        setTimeout(() => {
          setCurrentTranslate(-itemWidth * totalItems)
        }, 300)
        return newTranslate
      }
      return newTranslate
    })

    // Resume auto-scroll after 3 seconds
    setTimeout(() => {
      setIsManualControl(false)
    }, 3000)
  }

  const scrollToPrev = () => {
    setIsManualControl(true)
    setCurrentTranslate((prev) => {
      const newTranslate = prev + itemWidth
      // Reset position when reaching the beginning
      if (newTranslate > 0) {
        setTimeout(() => {
          setCurrentTranslate(-itemWidth * totalItems)
        }, 300)
        return newTranslate
      }
      return newTranslate
    })

    // Resume auto-scroll after 3 seconds
    setTimeout(() => {
      setIsManualControl(false)
    }, 3000)
  }

  const toggleAutoPlay = () => {
    setIsPaused(!isPaused)
  }

  return (
    <div className="relative w-full py-20 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-gradient-to-r from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Header Section */}
      <div className="text-center mb-16 relative z-10">
        <div className="inline-block">
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent mb-4 relative">
            Top Brands &{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Stores
            </span>
            <div
              className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transform scale-x-0 animate-pulse"
              style={{ animation: "scaleX 2s ease-in-out infinite" }}
            />
          </h2>
        </div>
        <p className="text-lg md:text-xl font-medium text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Discover premium brands offering exclusive deals and unmatched quality
        </p>
        <div className="mt-6 flex justify-center">
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
        </div>
      </div>

      {/* Main Carousel Container */}
      <div className="relative max-w-7xl mx-auto">
        {/* Navigation Buttons */}
        <button onClick={scrollToPrev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 group">
          <div className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-full shadow-xl border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300 group-hover:shadow-2xl">
            <ChevronLeft className="w-6 h-6 text-gray-700 group-hover:text-indigo-600 transition-colors duration-300" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>

        <button onClick={scrollToNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 group">
          <div className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-full shadow-xl border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300 group-hover:shadow-2xl">
            <ChevronRight className="w-6 h-6 text-gray-700 group-hover:text-indigo-600 transition-colors duration-300" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>

        {/* Play/Pause Button */}
        <button onClick={toggleAutoPlay} className="absolute top-4 right-4 z-20 group">
          <div className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:scale-105 transition-all duration-300">
            {isPaused ? (
              <Play className="w-4 h-4 text-gray-700 group-hover:text-green-600 transition-colors duration-300 ml-0.5" />
            ) : (
              <Pause className="w-4 h-4 text-gray-700 group-hover:text-red-600 transition-colors duration-300" />
            )}
          </div>
        </button>

        {/* Gradient Overlays for Fade Effect */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 via-blue-50/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-50 via-blue-50/80 to-transparent z-10 pointer-events-none" />

        {/* Carousel Track */}
        <div className="overflow-hidden">
          <div
            ref={carouselRef}
            className={`flex gap-8 transition-transform duration-300 ease-out ${
              !isManualControl && !isPaused ? "animate-infinite-scroll" : ""
            }`}
            style={{
              transform: isManualControl
                ? `translateX(${currentTranslate}px)`
                : `translateX(-${itemWidth * totalItems}px)`,
              animationPlayState: isPaused ? "paused" : "running",
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {duplicatedClients.map((client, index) => (
              <div key={`${client.cl_name}-${index}`} className="flex-shrink-0 group cursor-pointer">
                <div className="relative w-40 h-28 md:w-48 md:h-32 lg:w-56 lg:h-36">
                  {/* Card Background with Glassmorphism */}
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl" />
                  </div>

                  {/* Logo Container */}
                  <div className="relative z-10 flex items-center justify-center h-full p-6">
                    <img
                      src={client.client_img || "/placeholder.svg"}
                      alt={`${client.name} logo`}
                      className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Hover Tooltip */}
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                    <div className="bg-gray-900 text-white px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg">
                      {client.name}
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                    </div>
                  </div>

                  {/* Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-400/20 to-purple-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Decorative Elements */}
      <div className="mt-16 flex justify-center items-center space-x-4">
        <div className="flex space-x-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
        <span className="text-sm text-gray-500 font-medium">Trusted by industry leaders</span>
        <div className="flex space-x-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>

      {/* Status Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
        {/* Manual Control Indicator */}
        {isManualControl && (
          <div className="bg-blue-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white font-medium shadow-lg border border-blue-400/30 animate-pulse">
            🎮 Manual Control
          </div>
        )}

        {/* Auto-play Status */}
        <div
          className={`backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium shadow-lg border transition-all duration-300 ${
            isPaused ? "bg-red-500/90 text-white border-red-400/30" : "bg-green-500/90 text-white border-green-400/30"
          }`}
        >
          {isPaused ? "⏸️ Paused" : "▶️ Auto-playing"}
        </div>
      </div>
    </div>
  )
}
