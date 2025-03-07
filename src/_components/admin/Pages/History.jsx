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
import { ChevronsUpDown, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function History() {
  const activity = [
    {
      date: "17-10-2024",
      time: "01:14 PM",
      admin: "Sahil Narale",
      name: "Added Brand - Nike",
      category: "Brands",
      icon: <Trash2 />,
    },
    {
      date: "14-03-2025",
      time: "04:30 PM",
      admin: "Shreyash Chalke",
      name: "Added Brand - Puma",
      category: "Brands",
      icon: <Trash2 />,
    },
    {
      date: "11-01-2025",
      time: "01:14 PM",
      admin: "Aditya Patil",
      name: "Added Card - 12345678",
      category: "Card",
      icon: <Trash2 />,
    },
    {
      date: "17-10-2024",
      time: "01:14 PM",
      admin: "Yash Shelar",
      name: "Added Admin - Aditya Patil",
      category: "Admin",
      icon: <Trash2 />,
    },
    {
      date: "17-10-2024",
      time: "01:14 PM",
      admin: "Snehal abnave",
      name: "Added Brand - Imagica",
      category: "Brands",
      icon: <Trash2 />,
    },
    {
      date: "17-10-2024",
      time: "01:14 PM",
      admin: "Shubham Upadhyay",
      name: "Added Card - 75623458",
      category: "Cards",
      icon: <Trash2 />,
    },
    {
      date: "17-10-2024",
      time: "01:14 PM",
      admin: "Sahil Narale",
      name: "Added Brand - Nike",
      category: "Brands",
      icon: <Trash2 />,
    },
  ];

  let navigate = useNavigate();
  const handleCardRegister = () => {
    let path = `/Aplango/admin/cardregister`;
    navigate(path);
  };
  return (
    <div className="flex flex-col items-center justify-center py-10 px-2 md:px-6">
      <div className="heading w-full text-center font-bold text-2xl md:text-4xl text-red-500">
        <h1>
          Your <span className="text-indigo-600">Activity</span>
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
                <DropdownMenuLabel>Sort Activities</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer">
                    Date & Time
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    Category
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div>
          <Table>
            <TableCaption>A list of your activity.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Date</TableHead>
                <TableHead className="text-center">Time</TableHead>
                <TableHead className="text-center">Admin</TableHead>
                <TableHead className="text-center">Activity</TableHead>
                <TableHead className="text-center">Category</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activity.map((invoice, index) => (
                <TableRow key={index}>
                  <TableCell className="text-center">
                    {invoice.date}
                  </TableCell>
                  <TableCell className="text-center">
                    {invoice.time}
                  </TableCell>
                  <TableCell className="text-center">
                    {invoice.admin}
                  </TableCell>
                  <TableCell className="text-center">
                    {invoice.name}
                  </TableCell>
                  <TableCell className="text-center">
                    {invoice.category}
                  </TableCell>
                  <TableCell className="text-center">
                    <button className="text-red-500">{invoice.icon}</button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5}>Total</TableCell>
                <TableCell className="text-center">7</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default History;
