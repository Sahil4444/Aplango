import React, { useEffect, useRef } from "react";
import Navbar from "./customers/Navbar/Navbar";
import Hero from "./customers/Hero/Hero";
import About from "./customers/About/About";
import Process from "./customers/Process/Process";
import Contact from "./customers/Contact/Contact";
import Footer from "./customers/Footer/Footer";
import Clients from "./customers/Clients/Clients";
import { useLocation, useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const vendorRef = useRef(null);
  const ProcessRef = useRef(null);
  const ContactRef = useRef(null);
  const AboutRef = useRef(null);

  useEffect(() => {
    if (location.state?.scrollTo === "vendors") {
      vendorRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  const scrollToVendors = () => {
    navigate("/");
    vendorRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToProcess = () => {
    navigate("/");
    ProcessRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToAbout = () => {
    navigate("/");
    AboutRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToContact = () => {
    navigate("/");
    ContactRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Navbar
        onVendorClick={scrollToVendors}
        onProcessClick={scrollToProcess}
        onAboutClick={scrollToAbout}
        onContactClick={scrollToContact}
      />
      <Hero />
      <Process />
      <div ref={vendorRef}>
        <Clients />
      </div>
      <div ref={AboutRef}>
        <About />
      </div>
      <div ref={ContactRef}>
        <Contact />
      </div>
      <Footer />
    </>
  );
}

export default Home;
