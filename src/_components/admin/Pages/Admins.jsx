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
import { ChevronsUp, ChevronsUpDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
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
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../../../../Database/Firebase";
import { Spinner } from "./Spinner"; // Import a spinner component

function Admins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [open, setOpen] = useState(false); // State to manage dialog visibility
  const [adminIdToDelete, setAdminIdToDelete] = useState(null);
  const [reverseTable, setReverseTable] = useState(false); // State to handle reverse table order

  const navigate = useNavigate();

  // Fetch admins from Firebase
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const adminsCollection = collection(firestore, "admins");
        const adminSnapshot = await getDocs(adminsCollection);
        const adminsList = adminSnapshot.docs.map((doc, index) => ({
          id: doc.id,
          invoice: (index + 1).toString().padStart(2, "0"),
          ...doc.data(),
        }));
        setAdmins(adminsList);
        setError(null);
      } catch (err) {
        console.error("Error fetching admins:", err);
        setError("Failed to load admins. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const handleAdminRegister = () => {
    const path = `/Aplango/admin/register`;
    navigate(path);
  };

  // Open the dialog and set the admin ID to be deleted
  const handleDeleteAdmin = (adminId) => {
    setAdminIdToDelete(adminId);
    setOpen(true); // Open the dialog
  };

  // Confirm deletion of the admin
  const confirmDelete = async () => {
    if (adminIdToDelete) {
      try {
        // Proceed with deletion
        await deleteDoc(doc(firestore, "admins", adminIdToDelete));
        setOpen(false); // Close the dialog after deleting
        toast.success("Admin Deleted Successfully.", {
          position: "top-center",
        });
        setAdminIdToDelete(null);
        // Optionally update your state to remove the deleted admin from the list
        setAdmins(admins.filter((admin) => admin.id !== adminIdToDelete));
      } catch (err) {
        toast.error("Something went wrong!", {
          position: "top-center",
        });
        console.error("Error deleting admin:", err);
        // Optionally show error handling here
      }
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setOpen(false); // Simply close the dialog without deleting
    setAdminIdToDelete(null);
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter and sort admins
  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.emailid?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort admins if a sort field is selected
  const sortedAdmins = [...filteredAdmins].sort((a, b) => {
    if (!sortField) return 0;

    const fieldA = a[sortField]?.toLowerCase() || "";
    const fieldB = b[sortField]?.toLowerCase() || "";

    if (sortDirection === "asc") {
      return fieldA.localeCompare(fieldB);
    } else {
      return fieldB.localeCompare(fieldA);
    }
  });

  // Handle the reverse button click to reverse the table
  const handleReverseTable = () => {
    setReverseTable(!reverseTable);
  };

  // Reverse the order of the admins if reverseTable is true
  const adminsToDisplay = reverseTable ? sortedAdmins.reverse() : sortedAdmins;

  return (
    <div className="flex flex-col items-center justify-center py-10 px-2 md:px-6">
      <div className="heading w-full text-center font-bold text-2xl md:text-4xl text-red-500">
        <h1>
          Manage <span className="text-indigo-600">Admins</span>
        </h1>
      </div>
      <div className="content shadow-lg mt-10 px-5 py-10 w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="search-bar w-36 md:w-64">
            <Input
              className="w-full"
              type="search"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleReverseTable}
            >
              Descending <ChevronsUp />
            </Button>
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
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    Admin Name
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleSort("createdon")}
                  >
                    Created on
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          </div>
          
        </div>
        <div>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Spinner className="h-8 w-8 text-indigo-600" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : (
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
                {adminsToDisplay.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No admins found
                    </TableCell>
                  </TableRow>
                ) : (
                  adminsToDisplay.map((admin, index) => (
                    <TableRow key={admin.id}>
                      <TableCell className="font-medium">
                        {(index + 1).toString().padStart(2, "0")}
                      </TableCell>
                      <TableCell className="text-center">
                        {admin.createdon || "N/A"}
                      </TableCell>
                      <TableCell className="text-center">
                        {admin.emailid || "N/A"}
                      </TableCell>
                      <TableCell className="text-center">
                        {admin.name || "N/A"}
                      </TableCell>
                      <TableCell className="text-center">
                        <button
                          className="text-red-500"
                          onClick={() => handleDeleteAdmin(admin.id)}
                          aria-label={`Delete ${admin.name}`}
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
                  <TableCell colSpan={4}>Total</TableCell>
                  <TableCell className="text-center">
                    {adminsToDisplay.length}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          )}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this admin?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button className='bg-black text-white' variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Admins;
