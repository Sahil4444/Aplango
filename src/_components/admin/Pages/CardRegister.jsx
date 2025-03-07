"use client";

import { useState, useEffect } from "react";
import { firestore } from "../../../../Database/Firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

export default function CardRegister() {
  const [cardId, setCardId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cards, setCards] = useState([]);

  // Fetch cards when component mounts
  useEffect(() => {
    fetchCards();
  }, []);

  const handleAddCard = async (e) => {
    e.preventDefault();
    if (!cardId.trim()) {
      toast.error("Please enter a card ID");
      return;
    }

    setIsLoading(true);
    try {
      // Check if card already exists
      const cardQuery = query(
        collection(firestore, "cards"),
        where("cardId", "==", cardId.trim())
      );
      const querySnapshot = await getDocs(cardQuery);

      if (!querySnapshot.empty) {
        toast.warning("This card ID already exists");
        setIsLoading(false);
        return;
      }

      // Add the card to Firestore
      await addDoc(collection(firestore, "cards"), {
        cardId: cardId.trim(),
        createdAt: new Date(),
        status: "active", // Optional: add a status field
      });

      toast.success("Card added successfully!");
      setCardId("");
      fetchCards();
    } catch (error) {
      console.error("Error adding card:", error);
      toast.error(`Failed to add card: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCards = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(firestore, "cards"));
      const cardsList = [];
      querySnapshot.forEach((doc) => {
        cardsList.push({ id: doc.id, ...doc.data() });
      });
      setCards(cardsList);
    } catch (error) {
      console.error("Error fetching cards:", error);
      toast.error(`Failed to fetch cards: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

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
                disabled={isLoading}
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Adding..." : "Add Card"}
            </Button>
          </form>

          <div className="mt-6">
            <Button
              onClick={fetchCards}
              variant="outline"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Refresh Cards"}
            </Button>

            {cards.length > 0 ? (
              <div className="mt-4 space-y-2">
                <h3 className="font-medium">
                  Registered Cards ({cards.length}):
                </h3>
                <ul className="list-disc pl-5 max-h-60 overflow-y-auto">
                  {cards.map((card) => (
                    <li key={card.id} className="text-sm py-1">
                      {card.cardId}
                      <span className="text-xs text-gray-500 ml-2">
                        {card.createdAt?.toDate().toLocaleString() ||
                          "Unknown date"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-center mt-4 text-gray-500">
                No cards registered yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
