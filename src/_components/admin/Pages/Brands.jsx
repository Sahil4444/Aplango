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

function Brands() {
  const brands = [
    {
      invoice: "01",
      createdon: "17-10-2024",
      redeems: "6",
      offers: "12",
      name: "Imagica",
      icon: <Trash2 />,
    },
    {
      invoice: "02",
      createdon: "17-10-2024",
      redeems: "4",
      offers: "4",
      name: "Della Adventure",
      icon: <Trash2 />,
    },
    {
      invoice: "03",
      createdon: "17-10-2024",
      redeems: "8",
      offers: "6",
      name: "Javed Habib",
      icon: <Trash2 />,
    },
    {
      invoice: "04",
      createdon: "17-10-2024",
      redeems: "10",
      offers: "7",
      name: "Pizza Cappers",
      icon: <Trash2 />,
    },
    {
      invoice: "05",
      createdon: "17-10-2024",
      redeems: "11",
      offers: "10",
      name: "Splash",
      icon: <Trash2 />,
    },
    {
      invoice: "06",
      createdon: "17-10-2024",
      redeems: "2",
      offers: "3",
      name: "Surya Electronics",
      icon: <Trash2 />,
    },
    {
      invoice: "07",
      createdon: "17-10-2024",
      redeems: "0",
      offers: "2",
      name: "Yamaha",
      icon: <Trash2 />,
    },
  ];

  let navigate = useNavigate();
  const handleBrandRegister = () => {
    let path = `/Aplango/admin/brandregister`;
    navigate(path);
  };
  return (
    <div className="flex flex-col items-center justify-center py-10 px-2 md:px-6">
      <div className="heading w-full text-center font-bold text-2xl md:text-4xl text-red-500">
        <h1>
          Manage <span className="text-indigo-600">Brands</span>
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
                <DropdownMenuLabel>Sort Brands</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer">
                    Brand Name
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    Registered on
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    No. offers
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    Offers Redeemed
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div>
          <Table>
            <TableCaption>A list of your brands.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Sr. no</TableHead>
                <TableHead className="text-center">Registered On</TableHead>
                <TableHead className="text-center">Number of Offers</TableHead>
                <TableHead className="text-center">Brand Name</TableHead>
                <TableHead className="text-center">Offers Redeemed</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands.map((invoice) => (
                <TableRow key={invoice.invoice}>
                  <TableCell className="font-medium">
                    {invoice.invoice}
                  </TableCell>
                  <TableCell className="text-center">
                    {invoice.createdon}
                  </TableCell>
                  <TableCell className="text-center">
                    {invoice.offers}
                  </TableCell>
                  <TableCell className="text-center">{invoice.name}</TableCell>
                  <TableCell className="text-center">
                    {invoice.redeems}
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
      <div className="shadow-lg mt-10 p-3 w-full flex justify-center items-center">
        <button
          onClick={handleBrandRegister}
          className="bg-indigo-500 text-white py-2 px-3 rounded-sm hover:font-semibold"
        >
          Register Brand
        </button>
      </div>
    </div>
  );
}

export default Brands;
