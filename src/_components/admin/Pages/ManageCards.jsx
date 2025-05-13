"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { collection, query, orderBy, limit, getDocs, startAfter, deleteDoc, doc } from "firebase/firestore"
import { firestore } from "../../../../Database/Firebase"
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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import { ChevronsUp, ChevronsUpDown, Trash2 } from "lucide-react"
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Spinner } from "./Spinner"

const PAGE_SIZE = 20

function ManageCards() {
  const [cards, setCards] = useState([])
  const [lastVisible, setLastVisible] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState("createdAt")
  const [sortDirection, setSortDirection] = useState("desc")
  const [error, setError] = useState(null)
  const [open, setOpen] = useState(false)
  const [cardIdToDelete, setCardIdToDelete] = useState(null)

  const navigate = useNavigate()
  const debounceTimer = useRef(null)

  const fetchCards = useCallback(
    async (reset = false, customLastVisible = null) => {
      setLoading(true)
      try {
        const cardQuery = query(
          collection(firestore, "cards"),
          orderBy(sortField, sortDirection),
          ...(customLastVisible && !reset ? [startAfter(customLastVisible)] : []),
          limit(PAGE_SIZE),
        )

        const snapshot = await getDocs(cardQuery)
        const newCards = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }))

        setCards((prev) => (reset ? newCards : [...prev, ...newCards]))
        setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null)
        setError(null)
      } catch (err) {
        console.error("Fetch error:", err)
        setError("Failed to load cards. Try again.")
      } finally {
        setLoading(false)
      }
    },
    [sortField, sortDirection],
  )

  useEffect(() => {
    // Fetch when sortField or sortDirection changes
    fetchCards(true) // Ensure fetching fresh data when sort changes
  }, [sortField, sortDirection, fetchCards])

  const handleSort = useCallback((field, direction = "asc") => {
    // Don't reset lastVisible state when sorting. Only reset cards
    setCards([]) // Clear current cards when sorting changes
    setSortField(field)
    setSortDirection(direction)
  }, [])

  const handleSearch = useCallback((e) => {
    const value = e.target.value
    clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      setSearchTerm(value.toLowerCase())
    }, 300)
  }, [])

  const handleDeleteCard = useCallback((id) => {
    setCardIdToDelete(id)
    setOpen(true)
  }, [])

  const confirmDelete = useCallback(async () => {
    if (!cardIdToDelete) return

    try {
      await deleteDoc(doc(firestore, "cards", cardIdToDelete))
      setCards((prev) => prev.filter((c) => c.id !== cardIdToDelete))
      toast.success("Card deleted", { position: "top-center" })
    } catch (err) {
      toast.error("Delete failed", { position: "top-center" })
      console.error(err)
    } finally {
      setOpen(false)
      setCardIdToDelete(null)
    }
  }, [cardIdToDelete])

  const cancelDelete = useCallback(() => {
    setOpen(false)
    setCardIdToDelete(null)
  }, [])

  const handleCardRegister = useCallback(() => {
    navigate("/Aplango/admin/cardregister")
  }, [navigate])

  const filteredCards = searchTerm ? cards.filter((card) => card.cardId?.toLowerCase().includes(searchTerm)) : cards

  return (
    <div className="flex flex-col items-center justify-center py-10 px-2 md:px-6">
      <div className="heading w-full text-center font-bold text-2xl md:text-4xl text-red-500">
        <h1>
          Manage <span className="text-indigo-600">Cards</span>
        </h1>
      </div>
      <div className="content shadow-lg mt-10 px-5 py-10 w-full">
        <div className="flex justify-between items-center mb-6">
          <Input type="search" placeholder="Search..." onChange={handleSearch} className="w-36 md:w-64" />
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                const newDirection = sortDirection === "desc" ? "asc" : "desc"
                setSortDirection(newDirection)
                handleSort("cardId", newDirection)
              }}
            >
              {sortDirection === "desc" ? "Ascending" : "Descending"} <ChevronsUp />
            </Button>
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
                  <DropdownMenuItem onClick={() => handleSort("cardId", "asc")}>Card ID</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("createdAt", "asc")}>Registered On</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {loading && cards.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <Spinner className="h-8 w-8 text-indigo-600" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : (
          <Table>
            <TableCaption>A list of your cards.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Sr. No</TableHead>
                <TableHead className="text-center">Registered On</TableHead>
                <TableHead className="text-center">Card ID</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCards.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No cards found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCards.map((card, index) => (
                  <TableRow key={card.id}>
                    <TableCell>{(index + 1).toString().padStart(2, "0")}</TableCell>
                    <TableCell className="text-center">
                      {card.createdAt?.seconds ? new Date(card.createdAt.seconds * 1000).toLocaleString() : "N/A"}
                    </TableCell>
                    <TableCell className="text-center">{card.cardId}</TableCell>
                    <TableCell className="text-center">
                      <button
                        className="text-red-500"
                        onClick={() => handleDeleteCard(card.id)}
                        aria-label="Delete card"
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
                <TableCell className="text-center">{filteredCards.length}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}

        {!loading && !searchTerm && lastVisible && (
          <div className="flex justify-center mt-6">
            <Button onClick={() => fetchCards(false, lastVisible)}>Load More</Button>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>Are you sure you want to delete this card?</DialogDescription>
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

      <div className="shadow-lg mt-10 p-3 w-full flex justify-center items-center">
        <Button
          onClick={handleCardRegister}
          className="bg-indigo-500 text-white py-2 px-3 rounded-sm hover:font-semibold"
        >
          Register Card
        </Button>
      </div>
    </div>
  )
}

export default ManageCards
