import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronsUpDown, Delete, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Admins() {
  const invoices = [
    {
      invoice: "01",
      createdon: "17-10-2024",
      emailid: "sahilnarale@gmail.com",
      icon: <Trash2 />,
      name: "Sahil Narale",
    },
    {
      invoice: "02",
      createdon: "17-10-2024",
      emailid: "sahilnarale@gmail.com",
      icon: <Trash2 />,
      name: "Shubham Upadhyay",
    },
    {
      invoice: "03",
      createdon: "17-10-2024",
      emailid: "sahilnarale@gmail.com",
      icon: <Trash2 />,
      name: "Shreyash Chalke",
    },
    {
      invoice: "04",
      createdon: "17-10-2024",
      emailid: "sahilnarale@gmail.com",
      icon: <Trash2 />,
      name: "Chandrashekhar Shukla",
    },
    {
      invoice: "05",
      createdon: "17-10-2024",
      emailid: "sahilnarale@gmail.com",
      icon: <Trash2 />,
      name: "Snehal Abnave",
    },
    {
      invoice: "06",
      createdon: "17-10-2024",
      emailid: "sahilnarale@gmail.com",
      icon: <Trash2 />,
      name: "Mansi Nikam",
    },
    {
      invoice: "07",
      createdon: "17-10-2024",
      emailid: "sahilnarale@gmail.com",
      icon: <Trash2 />,
      name: "Aditya Patil",
    },
  ];

  let navigate = useNavigate();
  const handleAdminRegister = () => {
    let path = `/Aplango/admin/register`;
    navigate(path);
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 px-2 md:px-6">
      <div className="heading w-full text-center font-bold text-2xl md:text-4xl text-red-500">
        <h1>
          Manage <span className="text-indigo-600">Admins</span>
        </h1>
      </div>
      <div className="content shadow-lg mt-10 px-5 py-10 w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="searc-bar w-36 md:w-64">
            <Input className="w-full" type="Search" placeholder="Search..." />
          </div>
          <div className="filters-sort">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Sort <ChevronsUpDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Sort Admins</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer">
                    Admin Name
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    Created on
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div>
          <Table>
            <TableCaption>A list of your admins.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Sr. no</TableHead>
                <TableHead className="text-center">Created On</TableHead>
                <TableHead className="text-center">Email id</TableHead>
                <TableHead className="text-center">Admin Name</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.invoice}>
                  <TableCell className="font-medium">
                    {invoice.invoice}
                  </TableCell>
                  <TableCell className="text-center">
                    {invoice.createdon}
                  </TableCell>
                  <TableCell className="text-center">
                    {invoice.emailid}
                  </TableCell>
                  <TableCell className="text-center">{invoice.name}</TableCell>
                  <TableCell className="text-center">
                    <button className="text-red-500">{invoice.icon}</button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4}>Total</TableCell>
                <TableCell className="text-center">7</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
        <div className="shadow-lg mt-10 p-3 w-full flex justify-center items-center">
          <button
            onClick={handleAdminRegister}
            className="bg-indigo-500 text-white py-2 px-3 rounded-sm hover:font-semibold"
          >
            Create Admin
          </button>
        </div>
      </div>
    </div>
  );
}

export default Admins;
