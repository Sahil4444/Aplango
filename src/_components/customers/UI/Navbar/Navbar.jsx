import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import MobileDrawer from "./MobileDrawer";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, firestore } from "../../../../../Database/Firebase";
import { toast } from "react-toastify";
import { doc, getDoc } from "firebase/firestore";

const Navbar = () => {
  const [isHomeOpen, setIsHomeOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isClientsOpen, setIsClientsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleClientsClick = (event) => {
    event.preventDefault(); // Prevent default anchor behavior

    if (location.pathname === "/Aplango/ui") {
      window.scroll({
        top: 680, // Scroll vertically to 100 pixels
        left: 0, // Don't change horizontal position
        behavior: "smooth", // Smooth scroll
      }); // Delay to allow page transition
    } else {
      navigate("/Aplango/ui"); // Redirect to home
      setTimeout(() => {
        window.scrollTo({ top: 680, behavior: "smooth" }); // Scroll down smoothly
      }, 100); // Normal About Us navigation
    }
  };

  const handleAboutClick = (event) => {
    event.preventDefault(); // Prevent default anchor behavior

    navigate("/Aplango/ui/about"); // Redirect to home
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll down smoothly
    }, 100); // Normal About Us navigation
  };

  const handleScrollContact = (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    navigate("/Aplango/ui/contact"); // Redirect to home
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll down smoothly
    }, 100); // Normal About Us navigation
  };

  const handleScrollHome = () => {
    window.scroll({
      top: 0, // Scroll vertically to 100 pixels
      left: 0, // Don't change horizontal position
      behavior: "smooth", // Smooth scroll
    });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/Aplango/");
      toast.success("Logout successful!", { position: "top-center" });
      console.log("User logged out");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error logging out. Please try again.", {
        position: "top-center",
      });
    }
  };

  const fetchUsername = async () => {
    try {
      const user = auth.currentUser; // Get the currently logged-in user

      if (!user) {
        console.log("No user is logged in");
        return null;
      }

      const userRef = doc(firestore, "users", user.uid); // Reference to the user's document
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        return userSnap.data().name; // Return the username
      } else {
        console.log("User document not found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching username:", error);
      return null;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [username, setUsername] = useState("");

  useEffect(() => {
    const getUsername = async () => {
      const name = await fetchUsername();
      if (name) setUsername(name);
    };

    getUsername();
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      } ${isOpen ? "bg-white" : "bg-transparent"}`}
    >
      <div className="px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link onClick={handleScrollHome}>
            <Logo />
          </Link>

          <div className="hidden md:block ml-24">
            <div className="flex items-baseline justify-between gap-5 space-x-4">
              <Link
                to="/Aplango/ui"
                onClick={handleScrollHome}
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
                onClick={handleClientsClick}
                onMouseEnter={() => setIsClientsOpen(true)}
                onMouseLeave={() => setIsClientsOpen(false)}
                className="text-gray-800 relative hover:text-indigo-600 hover:cursor-pointer px-0 py-1 rounded-md text-md font-medium"
              >
                Clients
                <span
                  style={{
                    transform: isClientsOpen ? "scaleX(1)" : "scaleX(0)",
                  }}
                  className="absolute origin-left -bottom-1 -left-2 -right-2 h-1 rounded-full bg-indigo-600 transition-transform duration-300 ease-out"
                ></span>
              </Link>
              <Link
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
                onClick={handleScrollContact}
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
            <span className="me-3">
              Welcome,{" "}
              <span className="text-indigo-500 font-semibold">
                {username || ""}
              </span>{" "}
            </span>
            <button
              onClick={handleLogout}
              className="bg-transparent text-gray-800 hover:cursor-pointer border border-gray-800 hover:bg-indigo-700 hover:text-white w-28 py-2 rounded-md text-sm font-medium mr-2"
            >
              Logout
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
};

export default Navbar;
