import { ChevronsRight, House, HouseIcon, LogOut } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useNavigate, useLocation } from "react-router-dom";
import { firestore } from "../../../../../Database/Firebase";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { logoutAdmin, getAdminUser } from "@/utils/adminAuth";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [adminName, setAdminName] = useState("");
  useEffect(() => {
    const adminUser = getAdminUser();
    if (adminUser?.name) {
      setAdminName(adminUser.name);
    }
  }, []);

  const handleScrollHome = () => {
    event.preventDefault();
    navigate("/Aplango/ui");
    window.scroll({
      top: 0, // Scroll vertically to 100 pixels
      left: 0, // Don't change horizontal position
      behavior: "smooth", // Smooth scroll
    });
  };

  const handlelogout = (event) => {
    event.preventDefault();
    logoutAdmin(); // <-- clear admin session
    navigate("/Aplango/"); // go to public landing or login page
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative z-10 flex h-[60px] items-center justify-between bg-white text-gray-800 px-2 md:px-4 shadow-md ml-[90px] md:ml-[240px]">
      <div className="flex gap-x-3 items-center w-36 md:w-64">
        <Input className="w-full" type="Search" placeholder="Search..." />
      </div>
      <div className="flex gap-2 md:gap-3 items-center">
        <p className="font-semibold text-blue-600">
          Welcome,{" "}
          <span className="text-indigo-700">{adminName || "Admin"}</span>
        </p>
        <HouseIcon
          onClick={handleScrollHome}
          className="block md:hidden text-indigo-600 cursor-pointer "
        />
        <Link
          onClick={handlelogout}
          className="text-sm hidden border-2 border-indigo-600 w-20 text-center py-1 rounded-md bg-indigo-600 text-white font-medium md:flex items-center justify-center "
        >
          Log out
        </Link>
        <LogOut
          onClick={handlelogout}
          className="block md:hidden text-indigo-600 cursor-pointer"
        />
      </div>
    </div>
  );
}

export default Navbar;
