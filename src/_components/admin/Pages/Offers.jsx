"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Offers() {
  const navigate = useNavigate();

  const coupons = [
    {
      id: 1,
      companyName: "Amazon",
      couponInfo: "20% off on electronics",
      code: "AMZN20",
      isActive: true,
    },
    {
      id: 2,
      companyName: "Nike",
      couponInfo: "Free shipping on orders above $50",
      code: "NIKESHIP",
      isActive: true,
    },
    {
      id: 3,
      companyName: "Starbucks",
      couponInfo: "Buy one get one free on all beverages",
      code: "SBUX2FOR1",
      isActive: true,
    },
    {
      id: 4,
      companyName: "Uber Eats",
      couponInfo: "$10 off on your first order",
      code: "UBERNEW10",
      isActive: true,
    },
    {
      id: 5,
      companyName: "Spotify",
      couponInfo: "3 months premium for $0.99",
      code: "SPOT3M",
      isActive: true,
    },
    {
      id: 6,
      companyName: "Airbnb",
      couponInfo: "15% off on weekend stays",
      code: "AIRWEEKEND",
      isActive: true,
    },
    {
      id: 7,
      companyName: "Amazon",
      couponInfo: "20% off on electronics",
      code: "AMZN20",
      isActive: true,
    },
    {
      id: 8,
      companyName: "Nike",
      couponInfo: "Free shipping on orders above $50",
      code: "NIKESHIP",
      isActive: true,
    },
    {
      id: 9,
      companyName: "Starbucks",
      couponInfo: "Buy one get one free on all beverages",
      code: "SBUX2FOR1",
      isActive: true,
    },
    {
      id: 10,
      companyName: "Uber Eats",
      couponInfo: "$10 off on your first order",
      code: "UBERNEW10",
      isActive: true,
    },
    {
      id: 11,
      companyName: "Spotify",
      couponInfo: "3 months premium for $0.99",
      code: "SPOT3M",
      isActive: true,
    },
    {
      id: 12,
      companyName: "Airbnb",
      couponInfo: "15% off on weekend stays",
      code: "AIRWEEKEND",
      isActive: true,
    },
    {
      id: 13,
      companyName: "Amazon",
      couponInfo: "20% off on electronics",
      code: "AMZN20",
      isActive: true,
    },
    {
      id: 14,
      companyName: "Nike",
      couponInfo: "Free shipping on orders above $50",
      code: "NIKESHIP",
      isActive: true,
    },
    {
      id: 15,
      companyName: "Starbucks",
      couponInfo: "Buy one get one free on all beverages",
      code: "SBUX2FOR1",
      isActive: true,
    },
    {
      id: 16,
      companyName: "Uber Eats",
      couponInfo: "$10 off on your first order",
      code: "UBERNEW10",
      isActive: true,
    },
    {
      id: 17,
      companyName: "Spotify",
      couponInfo: "3 months premium for $0.99",
      code: "SPOT3M",
      isActive: true,
    },
    {
      id: 18,
      companyName: "Airbnb",
      couponInfo: "15% off on weekend stays",
      code: "AIRWEEKEND",
      isActive: true,
    },
  ];

  const uniqueBrands = Array.from(
    new Set(coupons.map((coupon) => coupon.companyName))
  );

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCoupons, setFilteredCoupons] = useState(coupons);

  const handleOfferRegister = () => {
    const path = `/Aplango/admin/couponregister`;
    navigate(path);
  };

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  useEffect(() => {
    let filtered = coupons;

    if (selectedBrands.length > 0) {
      filtered = filtered.filter((coupon) =>
        selectedBrands.includes(coupon.companyName)
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (coupon) =>
          coupon.companyName.toLowerCase().includes(query) ||
          coupon.couponInfo.toLowerCase().includes(query) ||
          coupon.code.toLowerCase().includes(query)
      );
    }

    setFilteredCoupons(filtered);
  }, [selectedBrands, searchQuery]);

  return (
    <div className="flex flex-col items-center justify-center py-10 px-2 md:px-6">
      <div className="heading w-full text-center font-bold text-2xl md:text-4xl text-red-500">
        <h1>
          Manage <span className="text-indigo-600">Offers</span>
        </h1>
      </div>
      <div className="content shadow-lg mt-10 px-5 py-10 w-full">
        <div className="w-full">
          <div className="coupons mt-14">
            <div className="heading text-center mb-8">
              <h1 className="text-lg font-bold">Available Coupons</h1>
            </div>
            <div className="content">
              <div className="filters flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                <div className="search-bar w-full md:w-64">
                  <Input
                    className="w-full"
                    type="search"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="filters-sort flex flex-wrap gap-2">
                  <div className="select-brand">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="mr-2">
                          Brands{" "}
                          {selectedBrands.length > 0 &&
                            `(${selectedBrands.length})`}{" "}
                          <ChevronsUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Select Brands</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <div className="max-h-[200px] overflow-y-auto p-2">
                          {uniqueBrands.map((brand, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 mb-2"
                            >
                              <input
                                type="checkbox"
                                id={`brand-${index}`}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                checked={selectedBrands.includes(brand)}
                                onChange={() => toggleBrand(brand)}
                              />
                              <label
                                htmlFor={`brand-${index}`}
                                className="text-sm font-medium text-gray-700 cursor-pointer"
                              >
                                {brand}
                              </label>
                            </div>
                          ))}
                        </div>
                        {selectedBrands.length > 0 && (
                          <>
                            <DropdownMenuSeparator />
                            <div className="p-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full text-xs"
                                onClick={() => setSelectedBrands([])}
                              >
                                Clear All
                              </Button>
                            </div>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div>
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
              </div>

              {selectedBrands.length > 0 && (
                <div className="selected-brands mb-4 flex flex-wrap gap-2">
                  {selectedBrands.map((brand, index) => (
                    <div
                      key={index}
                      className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {brand}
                      <button
                        className="ml-2 text-indigo-600 hover:text-indigo-800"
                        onClick={() => toggleBrand(brand)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredCoupons.length > 0 ? (
                  filteredCoupons.map((coupon) => (
                    <div
                      key={coupon.id}
                      className="coupon-card bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="p-5">
                        <div className="company-name mb-2">
                          <h2 className="text-xl font-bold text-gray-800">
                            {coupon.companyName}
                          </h2>
                        </div>
                        <div className="coupon-info mb-4">
                          <p className="text-gray-600">{coupon.couponInfo}</p>
                        </div>
                        <div className="code-section bg-gray-100 p-2 rounded mb-4">
                          <p className="text-sm text-gray-500">Code:</p>
                          <p className="font-mono font-bold text-indigo-600">
                            {coupon.code}
                          </p>
                        </div>
                        <div className="status-section flex justify-between items-center">
                          <span
                            className={`text-sm ${
                              coupon.isActive
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {coupon.isActive ? "Active" : "Disabled"}
                          </span>
                          <button
                            className={`px-4 py-2 rounded-md text-sm font-medium ${
                              coupon.isActive
                                ? "bg-red-100 text-red-600 hover:bg-red-200"
                                : "bg-green-100 text-green-600 hover:bg-green-200"
                            }`}
                          >
                            {coupon.isActive ? "Disable" : "Enable"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-gray-500">
                      No coupons found matching your criteria.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="add-section mx-auto w-36 mt-4">
        <button onClick={handleOfferRegister} className="text-md font-semibold bg-indigo-500 md:bg-transparent text-white md:text-indigo-500 md:border md:border-indigo-500 py-2 w-full rounded-md md:hover:bg-indigo-500 md:hover:text-white">
          Add Coupon
        </button>
      </div>
    </div>
  );
}

export default Offers;
