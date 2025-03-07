import { ChevronsRight, House, HouseIcon, LogOut } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { Input } from "@/components/ui/input"
import { useNavigate, useLocation } from "react-router-dom";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleScrollHome = () => {
    event.preventDefault();
    navigate("/Aplango/ui");
    window.scroll({
      top: 0, // Scroll vertically to 100 pixels
      left: 0, // Don't change horizontal position
      behavior: "smooth", // Smooth scroll
    });
  };
  
  const handlelogout = () => {
    event.preventDefault();
    navigate("/Aplango/");
    window.scroll({
      top: 0, // Scroll vertically to 100 pixels
      left: 0, // Don't change horizontal position
      behavior: "smooth", // Smooth scroll
    });
  };

  return (
    <div className='relative z-10 flex h-[60px] items-center justify-between bg-white text-gray-800 px-2 md:px-4 shadow-md ml-[90px] md:ml-[240px]'>
      <div className='flex gap-x-3 items-center w-36 md:w-64'>
        <Input className='w-full' type="Search" placeholder="Search..." />
      </div>
      <div className='flex gap-2 md:gap-3 items-center'>
        <button onClick={handleScrollHome} className='text-sm bg-transparent border-2 border-indigo-600 text-indigo-600 w-20 text-center py-1 rounded-md hover:bg-indigo-600 hover:text-white font-medium hidden md:flex items-center justify-center '><span>Home</span></button>
        <HouseIcon onClick={handleScrollHome} className='block md:hidden text-indigo-600 cursor-pointer '/>
        <Link onClick={handlelogout} className='text-sm hidden border-2 border-indigo-600 w-20 text-center py-1 rounded-md bg-indigo-600 text-white font-medium md:flex items-center justify-center '>Log out</Link>
        <LogOut onClick={handlelogout} className='block md:hidden text-indigo-600 cursor-pointer' />
      </div>
    </div>
  )
}

export default Navbar
