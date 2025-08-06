import { Outlet, useNavigate } from "react-router-dom";
import React from "react";
import Sidebar from "./_components/Sidebar/Sidebar";
import Navbar from "./_components/Navbar/Navbar";
import { logoutAdmin, getAdminUser } from "@/utils/adminAuth";
import { useEffect } from "react";

function PagesLayout() {
  const navigate = useNavigate();
  const adminUser = getAdminUser();

  useEffect(() => {
    if (!adminUser && location.pathname !== "/admin/login") {
      navigate("/admin/login");
    }
    // Don't redirect again if already on login page
  }, []); // Run only on initial render

  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div>
        <Navbar />
        <div className="h-[calc(100vh-60px)] overflow-y-auto overflow-x-hidden px-2 md:p-6 ml-[100px] md:ml-[240px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default PagesLayout;
