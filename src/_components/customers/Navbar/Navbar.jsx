import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import MobileDrawer from "./MobileDrawer";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useScrollNavigation } from "../../../hooks/useScrollNavigation";

function Navbar({
  onVendorClick,
  onProcessClick,
  onAboutClick,
  onContactClick,
}) {
  const [isHomeOpen, setIsHomeOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isClientsOpen, setIsClientsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCareersOpen, setIsCareersOpen] = useState(false);

  const navigate = useNavigate();
  const { scrollToSection } = useScrollNavigation();

  const handleHomeClick = (event) => {
    event.preventDefault();
    navigate("/");
    window.scroll({
      top: 0, // Scroll vertically to 100 pixels
      left: 0, // Don't change horizontal position
      behavior: "smooth", // Smooth scroll
    }); // Delay to allow page transition
  };

  const handleVendorClick = (event) => {
    event.preventDefault();
    scrollToSection("vendors");
    if (onVendorClick) onVendorClick();
  };

  const handleAboutClick = (event) => {
    event.preventDefault();
    scrollToSection("about");
    if (onAboutClick) onAboutClick();
  };

  const handleContactClick = (event) => {
    event.preventDefault();
    scrollToSection("contact");
    if (onContactClick) onContactClick();
  };

  const handleCareersClick = (event) => {
    event.preventDefault();
    navigate("/careers");
    window.scroll({
      top: 0, // Scroll vertically to 100 pixels
      left: 0, // Don't change horizontal position
      behavior: "smooth", // Smooth scroll
    }); // Delay to allow page transition
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      } ${isOpen ? "bg-white" : ""}`}
    >
      <div className="px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" onClick={handleHomeClick}>
            <Logo />
          </Link>

          <div className="hidden md:block ml-10">
            <div className="flex items-baseline justify-between gap-5 space-x-4">
              <Link
                to="/"
                onClick={handleHomeClick}
                onMouseEnter={() => setIsHomeOpen(true)}
                onMouseLeave={() => setIsHomeOpen(false)}
                className="text-gray-800 relative hover:text-indigo-600 hover:cursor-pointer px-0 py-1 rounded-md text-md font-medium"
              >
                Home
                <span
                  style={{ transform: isHomeOpen ? "scaleX(1)" : "scaleX(0)" }}
                  className="absolute origin-left -bottom-1 -left-2 -right-2 h-1 rounded-full bg-indigo-600 transition-transform duration-300 ease-out"
                ></span>
              </Link>
              <Link
                to="/"
                onClick={handleVendorClick}
                onMouseEnter={() => setIsClientsOpen(true)}
                onMouseLeave={() => setIsClientsOpen(false)}
                className="text-gray-800 relative hover:text-indigo-600 hover:cursor-pointer px-0 py-1 rounded-md text-md font-medium"
              >
                Vendors
                <span
                  style={{
                    transform: isClientsOpen ? "scaleX(1)" : "scaleX(0)",
                  }}
                  className="absolute origin-left -bottom-1 -left-2 -right-2 h-1 rounded-full bg-indigo-600 transition-transform duration-300 ease-out"
                ></span>
              </Link>
              <Link
                to="/careers"
                onClick={handleCareersClick}
                onMouseEnter={() => setIsCareersOpen(true)}
                onMouseLeave={() => setIsCareersOpen(false)}
                className="text-gray-800 relative hover:text-indigo-600 hover:cursor-pointer px-0 py-1 rounded-md text-md font-medium"
              >
                Careers
                <span
                  style={{
                    transform: isCareersOpen ? "scaleX(1)" : "scaleX(0)",
                  }}
                  className="absolute origin-left -bottom-1 -left-2 -right-2 h-1 rounded-full bg-indigo-600 transition-transform duration-300 ease-out"
                ></span>
              </Link>
              <Link
                to="/"
                onClick={handleAboutClick}
                onMouseEnter={() => setIsAboutOpen(true)}
                onMouseLeave={() => setIsAboutOpen(false)}
                className="text-gray-800 relative hover:text-indigo-600 hover:cursor-pointer px-0 py-1 rounded-md text-md font-medium"
              >
                About Us
                <span
                  style={{ transform: isAboutOpen ? "scaleX(1)" : "scaleX(0)" }}
                  className="absolute origin-left -bottom-1 -left-2 -right-2 h-1 rounded-full bg-indigo-600 transition-transform duration-300 ease-out"
                ></span>
              </Link>
              <Link
                to="/"
                onClick={handleContactClick}
                onMouseEnter={() => setIsContactOpen(true)}
                onMouseLeave={() => setIsContactOpen(false)}
                className="text-gray-800 relative hover:text-indigo-600 hover:cursor-pointer px-0 py-1 rounded-md text-md font-medium"
              >
                Contact Us
                <span
                  style={{
                    transform: isContactOpen ? "scaleX(1)" : "scaleX(0)",
                  }}
                  className="absolute origin-left -bottom-1 -left-2 -right-2 h-1 rounded-full bg-indigo-600 transition-transform duration-300 ease-out"
                ></span>
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <button
              onClick={() => navigate("/login")}
              className="bg-transparent text-gray-800 hover:cursor-pointer border border-gray-800 hover:border-none hover:bg-indigo-600 hover:text-white w-28 py-2 rounded-md text-sm font-medium mr-2"
            >
              Login
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-black hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>
      <MobileDrawer isOpen={isOpen} setIsOpen={setIsOpen} />
    </nav>
  );
}

export default Navbar;
