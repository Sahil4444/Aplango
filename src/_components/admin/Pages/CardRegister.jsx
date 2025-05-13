"use client"

import { useState, useEffect } from "react"
import { firestore } from "../../../../Database/Firebase"
import { collection, addDoc, getDocs, query, where } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "react-toastify"
import { Progress } from "@/components/ui/progress"


export default function CardRegister() {
  const [cardId, setCardId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [cards, setCards] = useState([])
  const [batchProgress, setBatchProgress] = useState(0)
  const [isBatchProcessing, setIsBatchProcessing] = useState(false)

  // Fetch cards when component mounts
  // useEffect(() => {
  //   fetchCards()
  // }, [])

  const handleAddCard = async (e) => {
    e.preventDefault()
    if (!cardId.trim()) {
      toast.error("Please enter a card ID")
      return
    }

    setIsLoading(true)
    try {
      // Check if card already exists
      const cardQuery = query(collection(firestore, "cards"), where("cardId", "==", cardId.trim()))
      const querySnapshot = await getDocs(cardQuery)

      if (!querySnapshot.empty) {
        toast.warning("This card ID already exists")
        setIsLoading(false)
        return
      }

      // Add the card to Firestore
      await addDoc(collection(firestore, "cards"), {
        cardId: cardId.trim(),
        createdAt: new Date(),
        status: "active", // Optional: add a status field
      })

      toast.success("Card added successfully!")
      setCardId("")
      // fetchCards()
    } catch (error) {
      console.error("Error adding card:", error)
      toast.error(`Failed to add card: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // const fetchCards = async () => {
  //   setIsLoading(true)
  //   try {
  //     const querySnapshot = await getDocs(collection(firestore, "cards"))
  //     const cardsList = []
  //     querySnapshot.forEach((doc) => {
  //       cardsList.push({ id: doc.id, ...doc.data() })
  //     })
  //     setCards(cardsList)
  //   } catch (error) {
  //     console.error("Error fetching cards:", error)
  //     toast.error(`Failed to fetch cards: ${error.message}`)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  // // Function to add exactly 15,000 card IDs starting from a specific number
  // const addCardRange = async () => {
  //   const startId = 200620195804
  //   const totalCardsToAdd = 1173
  //   const batchSize = 100 // Process 100 cards at a time

  //   setIsBatchProcessing(true)
  //   setBatchProgress(0)

  //   let currentId = startId
  //   let count = 0
  //   let totalAdded = 0
  //   let totalExisting = 0

  //   try {
  //     while (count < totalCardsToAdd) {
  //       // Determine how many cards to process in this batch
  //       const cardsInThisBatch = Math.min(batchSize, totalCardsToAdd - count)
  //       const batchCards = []

  //       // Generate the card IDs for this batch
  //       for (let i = 0; i < cardsInThisBatch; i++) {
  //         batchCards.push((currentId + i).toString())
  //       }

  //       // Check which cards already exist and add the new ones
  //       for (const cardIdStr of batchCards) {
  //         const cardQuery = query(collection(firestore, "cards"), where("cardId", "==", cardIdStr))
  //         const querySnapshot = await getDocs(cardQuery)

  //         if (querySnapshot.empty) {
  //           // Card doesn't exist, add it
  //           await addDoc(collection(firestore, "cards"), {
  //             cardId: cardIdStr,
  //             createdAt: new Date(),
  //             status: "active",
  //           })
  //           totalAdded++
  //         } else {
  //           totalExisting++
  //         }

  //         count++

  //         // Update progress
  //         const progress = Math.floor((count / totalCardsToAdd) * 100)
  //         setBatchProgress(progress)

  //         // Show intermediate progress every 500 cards
  //         if (count % 500 === 0) {
  //           toast.info(
  //             `Progress: ${progress}% - Added: ${totalAdded}, Already existing: ${totalExisting}, Processed: ${count}/${totalCardsToAdd}`,
  //           )
  //         }
  //       }

  //       // Move to the next batch
  //       currentId += cardsInThisBatch
  //     }

  //     toast.success(`Completed! Added ${totalAdded} new cards. ${totalExisting} cards already existed.`)
  //     fetchCards() // Refresh the card list
  //   } catch (error) {
  //     console.error("Error adding card range:", error)
  //     toast.error(`Failed to add card range: ${error.message}`)
  //   } finally {
  //     setIsBatchProcessing(false)
  //   }
  // }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Add Card ID</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddCard} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardId">Card ID</Label>
              <Input
                id="cardId"
                type="varchar"
                value={cardId}
                onChange={(e) => setCardId(e.target.value)}
                placeholder="Enter card ID"
                disabled={isLoading || isBatchProcessing}
              />
            </div>
            <Button type="submit" disabled={isLoading || isBatchProcessing} className="w-full">
              {isLoading ? "Adding..." : "Add Card"}
            </Button>
          </form>

          {/* Add Range Button */}
          {/* <div className="mt-4">
            <Button
              onClick={addCardRange}
              disabled={isLoading || isBatchProcessing}
              variant="secondary"
              className="w-full"
            >
              {isBatchProcessing ? "Processing..." : "Add 2667 Cards (Starting from 200620194310)"}
            </Button>

            {isBatchProcessing && (
              <div className="mt-2">
                <Progress value={batchProgress} className="h-2" />
                <p className="text-xs text-center mt-1">{batchProgress}% Complete</p>
              </div>
            )}
          </div> */}
{/* 
          <div className="mt-6">
            <Button onClick={fetchCards} variant="outline" className="w-full" disabled={isLoading || isBatchProcessing}>
              {isLoading ? "Loading..." : "Refresh Cards"}
            </Button>

            {cards.length > 0 ? (
              <div className="mt-4 space-y-2">
                <h3 className="font-medium">Registered Cards ({cards.length}):</h3>
                <ul className="list-disc pl-5 max-h-60 overflow-y-auto">
                  {cards.map((card) => (
                    <li key={card.id} className="text-sm py-1">
                      {card.cardId}
                      <span className="text-xs text-gray-500 ml-2">
                        {card.createdAt?.toDate().toLocaleString() || "Unknown date"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-center mt-4 text-gray-500">No cards registered yet</p>
            )}
          </div> */}
        </CardContent>
      </Card>
    </div>
  )
}
