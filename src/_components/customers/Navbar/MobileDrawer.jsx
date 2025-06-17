import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";

const MobileDrawer = ({ isOpen, setIsOpen }) => {
  const [productsOpen, setProductsOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleProductsClick = (event) => {
    event.preventDefault(); // Prevent default anchor behavior

    if (location.pathname === "/") {
      event.preventDefault();
      setIsOpen(false);
      navigate("/");
      window.scroll({
        top: 620, // Scroll vertically to 100 pixels
        left: 0, // Don't change horizontal position
        behavior: "smooth", // Smooth scroll
      }); // Delay to allow page transition
    } else {
      event.preventDefault();
      setIsOpen(false);
      navigate("/");
      navigate("/"); // Redirect to home
      setTimeout(() => {
        window.scrollTo({ top: 620, behavior: "smooth" }); // Scroll down smoothly
      }, 100); // Normal About Us navigation
    }
  };

  const handleScrollContact = (event) => {
    event.preventDefault(); // Prevent default anchor behavior

    if (location.pathname === "/") {
      setIsOpen(false);
      window.scroll({
        top: 4800, // Scroll vertically to 100 pixels
        left: 0, // Don't change horizontal position
        behavior: "smooth", // Smooth scroll
      }); // Delay to allow page transition
    } else {
      setIsOpen(false);
      navigate("/"); // Redirect to home
      setTimeout(() => {
        window.scrollTo({ top: 4800, behavior: "smooth" }); // Scroll down smoothly
      }, 100); // Normal About Us navigation
    }
  };

  const handleScrollHome = (event) => {
    event.preventDefault();
    setIsOpen(false);
    navigate("/");
    window.scroll({
      top: 0, // Scroll vertically to 100 pixels
      left: 0, // Don't change horizontal position
      behavior: "smooth", // Smooth scroll
    });
  };

  const handleClientsHome = (event) => {
    event.preventDefault(); // Prevent default anchor behavior

    if (location.pathname === "/") {
      setIsOpen(false);
      window.scroll({
        top: 2600, // Scroll vertically to 100 pixels
        left: 0, // Don't change horizontal position
        behavior: "smooth", // Smooth scroll
      }); // Delay to allow page transition
    } else {
      setIsOpen(false);
      navigate("/"); // Redirect to home
      setTimeout(() => {
        window.scrollTo({ top: 2600, behavior: "smooth" }); // Scroll down smoothly
      }, 100); // Normal About Us navigation
    }
  };

  const handleCareersHome = (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    setIsOpen(false);
    navigate("/careers");
    window.scroll({
      top: 0, // Scroll vertically to 100 pixels
      left: 0, // Don't change horizontal position
      behavior: "smooth", // Smooth scroll
    }); // Delay to allow page transition
  };

  const handleAboutClick = (event) => {
    event.preventDefault(); // Prevent default anchor behavior

    if (location.pathname === "/") {
      setIsOpen(false);
      window.scroll({
        top: 3100, // Scroll vertically to 100 pixels
        left: 0, // Don't change horizontal position
        behavior: "smooth", // Smooth scroll
      }); // Delay to allow page transition
    } else {
      setIsOpen(false);
      navigate("/"); // Redirect to home
      setTimeout(() => {
        window.scrollTo({ top: 3100, behavior: "smooth" }); // Scroll down smoothly
      }, 100); // Normal About Us navigation
    }
  };

  // const handleUiClick = (event) => {
  //   event.preventDefault(); // Prevent default anchor behavior

  //   if (location.pathname === "/Aplango/ui") {
  //     setIsOpen(false);
  //     window.scroll({
  //       top: 0, // Scroll vertically to 100 pixels
  //       left: 0, // Don't change horizontal position
  //       behavior: "smooth", // Smooth scroll
  //     }); // Delay to allow page transition
  //   } else {
  //     setIsOpen(false);
  //     navigate("/Aplango/ui"); // Redirect to home
  //     setTimeout(() => {
  //       window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll down smoothly
  //     }, 100); // Normal About Us navigation
  //   }
  // };

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
          onClick={handleClientsHome}
          className="text-black hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
        >
          Vendors
        </Link>
        <Link
          onClick={handleCareersHome}
          className="text-black hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
        >
          Careers
        </Link>
        <Link
          onClick={handleAboutClick}
          className="text-black hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
        >
          About
        </Link>
        {/* <Link
          onClick={handleUiClick}
          className="text-black hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
        >
          Ui
        </Link> */}
        <Link
          onClick={handleScrollContact}
          className="text-black hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
        >
          Contact
        </Link>
        <div className="md:hidden flex flex-col gap-3">
          <button
            onClick={() => navigate("/login")}
            className="hover:cursor-pointer border border-gray-800 bg-indigo-700 text-white w-full py-2 rounded-md text-sm font-medium mr-2"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileDrawer;
