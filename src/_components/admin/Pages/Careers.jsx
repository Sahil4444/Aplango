"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChevronsUpDown, Trash2, Loader2, Eye } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { firestore } from "../../../../Database/Firebase" // Adjust the import path as needed
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore"
import { toast } from "react-toastify"

function Career() {
  const [careers, setCareers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("jobRole") // Default sort by job role
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [careerToDelete, setCareerToDelete] = useState(null)
  const [alert, setAlert] = useState({ show: false, type: "", message: "" })

  const navigate = useNavigate()

  // Format Firestore timestamp to readable date
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A"

    try {
      // Handle both Firestore Timestamp objects and date strings
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid date"
    }
  }

  // Get status badge variant based on status
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "default"
      case "inactive":
        return "secondary"
      case "closed":
        return "destructive"
      case "draft":
        return "outline"
      default:
        return "secondary"
    }
  }

  // Fetch careers from Firestore
  const fetchCareers = async () => {
    setLoading(true)
    setError(null)

    try {
      const careersCollection = collection(firestore, "careers")
      const careersQuery = query(careersCollection, orderBy(sortBy))
      const querySnapshot = await getDocs(careersQuery)

      const careersData = querySnapshot.docs.map((doc, index) => {
        const data = doc.data()
        return {
          id: doc.id,
          srNo: (index + 1).toString().padStart(2, "0"),
          createdOn: formatDate(data.createdAt),
          jobId: data.jobId || doc.id.substring(0, 8).toUpperCase(),
          jobRole: data.jobRole || data.title,
          status: data.status || "Active",
        }
      })

      setCareers(careersData)
    } catch (err) {
      console.error("Error fetching careers:", err)
      setError("Failed to load job roles. Please try again later.")
      setAlert({
        show: true,
        type: "error",
        message: "Failed to load job roles: " + err.message,
      })
    } finally {
      setLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchCareers()
  }, [sortBy])

  // Handle career deletion
  const handleDeleteCareer = async () => {
    if (!careerToDelete) return

    try {
      await deleteDoc(doc(firestore, "careers", careerToDelete.id))

      // Update UI after successful deletion
      setCareers(careers.filter((career) => career.id !== careerToDelete.id))
      toast.success("Job role deleted successfully.")
    } catch (err) {
      console.error("Error deleting career:", err)
      toast.error("Failed to delete job role!")
    } finally {
      setDeleteDialogOpen(false)
      setCareerToDelete(null)

      // Hide alert after 5 seconds
      setTimeout(() => {
        setAlert({ show: false, type: "", message: "" })
      }, 5000)
    }
  }

  // Open delete confirmation dialog
  const confirmDelete = (career) => {
    setCareerToDelete(career)
    setDeleteDialogOpen(true)
  }

  // Navigate to career registration page
  const handleCareerRegister = () => {
    const path = `/admin/careerregister`
    navigate(path)
  }

  // Handle view career details
  const handleViewCareer = (career) => {
    const path = `/admin/career/${career.id}`
    navigate(path)
  }

  // Filter careers based on search term
  const filteredCareers = careers.filter(
    (career) =>
      career.jobRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
      career.jobId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      career.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle sort selection
  const handleSort = (field) => {
    switch (field) {
      case "Job Role":
        setSortBy("jobRole")
        break
      case "Created On":
        setSortBy("createdAt")
        break
      case "Status":
        setSortBy("status")
        break
      default:
        setSortBy("jobRole")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-10 px-2 md:px-6">
      <div className="heading w-full text-center font-bold text-2xl md:text-4xl text-red-500">
        <h1>
          Manage <span className="text-indigo-600">Careers</span>
        </h1>
      </div>

      {alert.show && (
        <Alert variant={alert.type === "error" ? "destructive" : "default"} className="mt-4 w-full max-w-6xl">
          {alert.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
          <AlertTitle>{alert.type === "error" ? "Error" : "Success"}</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <div className="content shadow-lg mt-10 px-5 py-10 w-full max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <div className="search-bar w-36 md:w-64">
            <Input
              className="w-full"
              type="search"
              placeholder="Search job roles..."
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
                <DropdownMenuLabel>Sort Job Roles</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => handleSort("Job Role")}>
                    Job Role
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => handleSort("Created On")}>
                    Created On
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => handleSort("Status")}>
                    Status
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <span className="ml-2">Loading job roles...</span>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">
            {error}
            <Button variant="outline" className="mt-4" onClick={fetchCareers}>
              Try Again
            </Button>
          </div>
        ) : (
          <div>
            <Table>
              <TableCaption>A list of your job openings.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Sr. no</TableHead>
                  <TableHead className="text-center">Created On</TableHead>
                  <TableHead className="text-center">Job ID</TableHead>
                  <TableHead className="text-center">Job Role</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCareers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      {searchTerm ? "No job roles match your search" : "No job roles posted yet"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCareers.map((career, index) => (
                    <TableRow key={career.id}>
                      <TableCell className="font-medium">{(index + 1).toString().padStart(2, "0")}</TableCell>
                      <TableCell className="text-center">{career.createdOn}</TableCell>
                      <TableCell className="text-center font-mono">{career.jobId}</TableCell>
                      <TableCell className="text-center">{career.jobRole}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={getStatusVariant(career.status)}>{career.status}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            className="text-blue-500 hover:text-blue-700 transition-colors"
                            onClick={() => handleViewCareer(career)}
                            aria-label={`View ${career.jobRole}`}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700 transition-colors"
                            onClick={() => confirmDelete(career)}
                            aria-label={`Delete ${career.jobRole}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={5}>Total</TableCell>
                  <TableCell className="text-center">{filteredCareers.length}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        )}
      </div>

      <div className="shadow-lg mt-10 p-3 w-full max-w-6xl flex justify-center items-center">
        <button
          onClick={handleCareerRegister}
          className="bg-indigo-500 text-white py-2 px-3 rounded-sm hover:font-semibold"
        >
          Post New Job
        </button>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the job role "{careerToDelete?.jobRole}" (ID: {careerToDelete?.jobId}). This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCareer} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default Career
