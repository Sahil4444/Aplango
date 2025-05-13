import React, { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../../../../Database/Firebase";
import { Spinner } from "./Spinner";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [open, setOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersCollection = collection(firestore, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map((doc, index) => ({
          id: doc.id,
          invoice: (index + 1).toString().padStart(2, "0"),
          ...doc.data(),
        }));
        setUsers(usersList);
        setError(null);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (field, direction = "asc") => {
    setSortField(field);
    setSortDirection(direction);
  };

  const handleDeleteUser = (userId) => {
    setUserIdToDelete(userId);
    setOpen(true);
  };

  const confirmDelete = async () => {
    if (userIdToDelete) {
      try {
        await deleteDoc(doc(firestore, "users", userIdToDelete));
        setUsers(users.filter((user) => user.id !== userIdToDelete));
        toast.success("User deleted successfully", { position: "top-center" });
      } catch (err) {
        toast.error("Error deleting user", { position: "top-center" });
        console.error("Delete error:", err);
      } finally {
        setOpen(false);
        setUserIdToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setOpen(false);
    setUserIdToDelete(null);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortField) return 0;
    const valA = a[sortField]?.toString().toLowerCase() || "";
    const valB = b[sortField]?.toString().toLowerCase() || "";

    return sortDirection === "asc"
      ? valA.localeCompare(valB)
      : valB.localeCompare(valA);
  });

  return (
    <div className="flex flex-col items-center justify-center py-10 px-2 md:px-6">
      <div className="heading w-full text-center font-bold text-2xl md:text-4xl text-red-500">
        <h1>
          Manage <span className="text-indigo-600">Users</span>
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
              onClick={() => handleSort("name", "desc")}
            >
              Descending <ChevronsUp />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Sort <ChevronsUpDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Sort Users</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => handleSort("name", "asc")}>
                    User Name
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSort("createdAt", "asc")}
                  >
                    Created On
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSort("cardId", "asc")}
                  >
                    Card ID
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Spinner className="h-8 w-8 text-indigo-600" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : (
          <Table>
            <TableCaption>A list of your users.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Sr. No</TableHead>
                <TableHead className="text-center">Created On</TableHead>
                <TableHead className="text-center">Card ID</TableHead>
                <TableHead className="text-center">Email</TableHead>
                <TableHead className="text-center">Name</TableHead>
                <TableHead className="text-center">Phone</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                sortedUsers.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {(index + 1).toString().padStart(2, "0")}
                    </TableCell>
                    <TableCell className="text-center">
                      {user.createdAt?.seconds
                        ? new Date(
                            user.createdAt.seconds * 1000
                          ).toLocaleString()
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-center">
                      {user.cardId || "N/A"}
                    </TableCell>
                    <TableCell className="text-center">
                      {user.email || "N/A"}
                    </TableCell>
                    <TableCell className="text-center">
                      {user.name || "N/A"}
                    </TableCell>
                    <TableCell className="text-center">
                      {user.phone || "N/A"}
                    </TableCell>
                    <TableCell className="text-center">
                      <button
                        className="text-red-500"
                        onClick={() => handleDeleteUser(user.id)}
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
                <TableCell colSpan={6}>Total</TableCell>
                <TableCell className="text-center">
                  {sortedUsers.length}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button className="bg-black text-white" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Users;
