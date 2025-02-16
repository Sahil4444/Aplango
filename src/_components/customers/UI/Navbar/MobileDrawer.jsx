import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";

const MobileDrawer = ({ isOpen, setIsOpen }) => {

  const navigate = useNavigate();
  const location = useLocation();

  const handleScrollContact = (event) => {
    event.preventDefault(); // Prevent default anchor behavior
      setIsOpen(false);
      navigate("/Aplango/ui/contact"); // Redirect to home
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll down smoothly
      }, 100); // Normal About Us navigation
  };

  const handleScrollHome = (event) => {
    event.preventDefault();
    setIsOpen(false);
    navigate("/Aplango/ui");
    window.scroll({
      top: 0, // Scroll vertically to 100 pixels
      left: 0, // Don't change horizontal position
      behavior: "smooth", // Smooth scroll
    });
  };

  const handleClientsClick = (event) => {
    event.preventDefault(); // Prevent default anchor behavior

    if (location.pathname === "/Aplango/ui") {
      setIsOpen(false);
      window.scroll({
        top: 990, // Scroll vertically to 100 pixels
        left: 0, // Don't change horizontal position
        behavior: "smooth", // Smooth scroll
      }); // Delay to allow page transition
    } else {
      setIsOpen(false);
      navigate("/Aplango/ui"); // Redirect to home
      setTimeout(() => {
        window.scrollTo({ top: 990, behavior: "smooth" }); // Scroll down smoothly
      }, 100); // Normal About Us navigation
    }
  };
  
  const handleAboutClick = (event) => {
    event.preventDefault(); // Prevent default anchor behavior

      setIsOpen(false);
      navigate("/Aplango/ui/about"); // Redirect to home
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll down smoothly
      }, 100); // Normal About Us navigation
    
  };

  const handleLogout = () => {
    navigate("/Aplango/");
    window.scroll({
      top: 0, // Scroll vertically to 100 pixels
      left: 0, // Don't change horizontal position
      behavior: "smooth", // Smooth scroll
    });
  };

  return (
    <div
      className={`md:hidden ${
        isOpen ? "block" : "hidden"
      } bg-white w-full h-full`}
    >
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <Link
          onClick={handleScrollHome}
          className="text-black hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
        >
          Home
        </Link>
        <Link
          onClick={handleClientsClick}
          className="text-black hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
        >
          Clients
        </Link>
        <Link
          onClick={handleAboutClick}
          className="text-black hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
        >
          About
        </Link>
        <Link
          onClick={handleScrollContact}
          className="text-black hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
        >
          Contact
        </Link>
        <div className="md:hidden flex flex-col gap-3">
          <button
            onClick={handleLogout}
            className="hover:cursor-pointer border border-gray-800 bg-indigo-700 text-white w-full py-2 rounded-md text-sm font-medium mr-2"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileDrawer;
