import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import Footer from "../Footer/Footer";

function UiHome() {
  return (
    <div>
      <Navbar />
      <div className="">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default UiHome;
