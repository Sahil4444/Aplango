"use client";

import { useState, useEffect } from "react";
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
import { ChevronsUpDown, Trash2, Loader2 } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { firestore } from "../../../../Database/Firebase"; // Adjust the import path as needed
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { toast } from "react-toastify"

function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("brandName"); // Default sort by brand name
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const navigate = useNavigate();

  // Format Firestore timestamp to readable date
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";

    try {
      // Handle both Firestore Timestamp objects and date strings
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  // Fetch brands from Firestore
  const fetchBrands = async () => {
    setLoading(true);
    setError(null);

    try {
      const brandsCollection = collection(firestore, "brands");
      const brandsQuery = query(brandsCollection, orderBy(sortBy));
      const querySnapshot = await getDocs(brandsQuery);

      const brandsData = querySnapshot.docs.map((doc, index) => {
        const data = doc.data();
        return {
          id: doc.id,
          invoice: (index + 1).toString().padStart(2, "0"),
          createdon: formatDate(data.createdAt),
          name: data.brandName,
          termsConditions: data.termsConditions,
        };
      });

      setBrands(brandsData);
    } catch (err) {
      console.error("Error fetching brands:", err);
      setError("Failed to load brands. Please try again later.");
      setAlert({
        show: true,
        type: "error",
        message: "Failed to load brands: " + err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchBrands();
  }, [sortBy]);

  // Handle brand deletion
  const handleDeleteBrand = async () => {
    if (!brandToDelete) return;

    try {
      await deleteDoc(doc(firestore, "brands", brandToDelete.id));

      // Update UI after successful deletion
      setBrands(brands.filter((brand) => brand.id !== brandToDelete.id));
      toast.success("Brand deleted Successfully.")
      
    } catch (err) {
      console.error("Error deleting brand:", err);
      toast.error("Failed to delete brand!")
    } finally {
      setDeleteDialogOpen(false);
      setBrandToDelete(null);

      // Hide alert after 5 seconds
      setTimeout(() => {
        setAlert({ show: false, type: "", message: "" });
      }, 5000);
    }
  };

  // Open delete confirmation dialog
  const confirmDelete = (brand) => {
    setBrandToDelete(brand);
    setDeleteDialogOpen(true);
  };

  // Navigate to brand registration page
  const handleBrandRegister = () => {
    const path = `/admin/brandregister`;
    navigate(path);
  };

  // Filter brands based on search term
  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle sort selection
  const handleSort = (field) => {
    setSortBy(field === "Brand Name" ? "brandName" : "createdAt");
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 px-2 md:px-6">
      <div className="heading w-full text-center font-bold text-2xl md:text-4xl text-red-500">
        <h1>
          Manage <span className="text-indigo-600">Brands</span>
        </h1>
      </div>

      {alert.show && (
        <Alert
          variant={alert.type === "error" ? "destructive" : "default"}
          className="mt-4 w-full max-w-4xl"
        >
          {alert.type === "error" ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
          <AlertTitle>
            {alert.type === "error" ? "Error" : "Success"}
          </AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <div className="content shadow-lg mt-10 px-5 py-10 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <div className="search-bar w-36 md:w-64">
            <Input
              className="w-full"
              type="search"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleSort("Brand Name")}
                  >
                    Brand Name
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleSort("Registered on")}
                  >
                    Registered on
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <span className="ml-2">Loading brands...</span>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">
            {error}
            <Button variant="outline" className="mt-4" onClick={fetchBrands}>
              Try Again
            </Button>
          </div>
        ) : (
          <div>
            <Table>
              <TableCaption>A list of your registered brands.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Sr. no</TableHead>
                  <TableHead className="text-center">Registered On</TableHead>
                  <TableHead className="text-center">Brand Name</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBrands.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10">
                      {searchTerm
                        ? "No brands match your search"
                        : "No brands registered yet"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBrands.map((brand, index) => (
                    <TableRow key={brand.id}>
                      <TableCell className="font-medium">
                        {(index + 1).toString().padStart(2, "0")}
                      </TableCell>
                      <TableCell className="text-center">
                        {brand.createdon}
                      </TableCell>
                      <TableCell className="text-center">
                        {brand.name}
                      </TableCell>
                      <TableCell className="text-center">
                        <button
                          className="text-red-500 hover:text-red-700 transition-colors"
                          onClick={() => confirmDelete(brand)}
                          aria-label={`Delete ${brand.name}`}
                        >
                          <Trash2 />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell className="text-center">
                    {filteredBrands.length}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        )}
      </div>

      <div className="shadow-lg mt-10 p-3 w-full max-w-4xl flex justify-center items-center">
        <button
          onClick={handleBrandRegister}
          className="bg-indigo-500 text-white py-2 px-3 rounded-sm hover:font-semibold"
        >
          Register Brand
        </button>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the brand "{brandToDelete?.name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBrand}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default Brands;
