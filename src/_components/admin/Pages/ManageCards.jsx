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

function ManageCards() {
  const cards = [
    {
      invoice: "01",
      createdon: "17-10-2024",
      redeems: "6",
      remaning: "6",
      cardid: "123456789101",
      icon: <Trash2 />,
    },
    {
      invoice: "02",
      createdon: "17-10-2024",
      redeems: "4",
      remaning: "8",
      cardid: "123456789102",
      icon: <Trash2 />,
    },
    {
      invoice: "03",
      createdon: "17-10-2024",
      redeems: "8",
      remaning: "4",
      cardid: "123456789103",
      icon: <Trash2 />,
    },
    {
      invoice: "04",
      createdon: "17-10-2024",
      redeems: "10",
      remaning: "2",
      cardid: "123456789104",
      icon: <Trash2 />,
    },
    {
      invoice: "05",
      createdon: "17-10-2024",
      redeems: "11",
      remaning: "1",
      cardid: "123456789105",
      icon: <Trash2 />,
    },
    {
      invoice: "06",
      createdon: "17-10-2024",
      redeems: "2",
      remaning: "10",
      cardid: "123456789106",
      icon: <Trash2 />,
    },
    {
      invoice: "07",
      createdon: "17-10-2024",
      redeems: "0",
      remaning: "12",
      cardid: "123456789107",
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
          Manage <span className="text-indigo-600">Cards</span>
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
                <DropdownMenuLabel>Sort Cards</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer">
                    Card id
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    Registered on
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    Offers Redeemed
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    Remaining Offers
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div>
          <Table>
            <TableCaption>A list of your cards.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Sr. no</TableHead>
                <TableHead className="text-center">Registered On</TableHead>
                <TableHead className="text-center">Card id</TableHead>
                <TableHead className="text-center">Offers Redeemed</TableHead>
                <TableHead className="text-center">Remaining Offers</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cards.map((invoice) => (
                <TableRow key={invoice.invoice}>
                  <TableCell className="font-medium">
                    {invoice.invoice}
                  </TableCell>
                  <TableCell className="text-center">
                    {invoice.createdon}
                  </TableCell>
                  <TableCell className="text-center">
                    {invoice.cardid}
                  </TableCell>
                  <TableCell className="text-center">
                    {invoice.redeems}
                  </TableCell>
                  <TableCell className="text-center">
                    {invoice.remaning}
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
          onClick={handleCardRegister}
          className="bg-indigo-500 text-white py-2 px-3 rounded-sm hover:font-semibold"
        >
          Register Card
        </button>
      </div>
    </div>
  );
}

export default ManageCards;
