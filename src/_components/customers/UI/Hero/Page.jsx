"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer } from "./timer";

const OFFERS = {
  Imagica: [
    {
      id: "imagica-1",
      name: "Imagica",
      title: "30% Off on All Items",
      description: "Get amazing discounts on all Imagica products this season",
    },
    {
      id: "imagica-2",
      name: "Imagica",
      title: "Buy 2 Get 1 Free",
      description: "Special offer on selected merchandise",
    },
    {
      id: "imagica-3",
      name: "Imagica",
      title: "Student Discount 20%",
      description: "Special discount for students with valid ID",
    },
    {
      id: "imagica-4",
      name: "Imagica",
      title: "Family Package Deal",
      description: "Save 40% on family tickets of 4 or more",
    },
  ],
  Habib: [
    {
      id: "habib-1",
      name: "Habib",
      title: "Buy 1 Get 1 Free",
      description: "Special weekend offer on selected items",
    },
    {
      id: "habib-2",
      name: "Habib",
      title: "50% Off on Jewelry",
      description: "Exclusive discount on gold jewelry",
    },
    {
      id: "habib-3",
      name: "Habib",
      title: "Diamond Collection Sale",
      description: "Up to 30% off on diamond collection",
    },
    {
      id: "habib-4",
      name: "Habib",
      title: "Free Gift on Purchase",
      description: "Get a free gift on purchases above $500",
    },
  ],
  Splash: [
    {
      id: "splash-1",
      name: "Splash",
      title: "Flat 50% Off",
      description: "Massive clearance sale on all summer collection",
    },
    {
      id: "splash-2",
      name: "Splash",
      title: "New Arrival Discount",
      description: "25% off on new winter collection",
    },
    {
      id: "splash-3",
      name: "Splash",
      title: "Bundle Offer",
      description: "Buy any 3 items and get 40% off",
    },
    {
      id: "splash-4",
      name: "Splash",
      title: "Premium Collection Deal",
      description: "Up to 35% off on premium brands",
    },
  ],
  Suzuki: [
    {
      id: "suzuki-1",
      name: "Suzuki",
      title: "Free Service Check",
      description: "Complimentary vehicle inspection and basic service",
    },
    {
      id: "suzuki-2",
      name: "Suzuki",
      title: "Oil Change Offer",
      description: "50% off on oil change service",
    },
    {
      id: "suzuki-3",
      name: "Suzuki",
      title: "Spare Parts Discount",
      description: "20% off on genuine spare parts",
    },
    {
      id: "suzuki-4",
      name: "Suzuki",
      title: "Winter Service Package",
      description: "Complete winter check-up at special rates",
    },
  ],
};

export default function OffersPage() {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [redeemedOffers, setRedeemedOffers] = useState({});
  const [expiredOffers, setExpiredOffers] = useState({});

  const handleRedeem = (offerId) => {
    setRedeemedOffers((prev) => ({ ...prev, [offerId]: true }));
  };

  const handleExpire = (offerId) => {
    setExpiredOffers((prev) => ({ ...prev, [offerId]: true }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-6xl font-bold text-center text-indigo-600 mb-6">
        Offers for you
      </h1>
      <p>
        Select your favorite brand and enjoy amazing offers tailored just for
        you.
      </p>

      <div className="max-w-xl mx-auto my-8">
        <Select onValueChange={(value) => setSelectedBrand(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select brand or shop" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Imagica">Imagica</SelectItem>
            <SelectItem value="Habib">Habib</SelectItem>
            <SelectItem value="Splash">Splash</SelectItem>
            <SelectItem value="Suzuki">Suzuki</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selectedBrand && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {OFFERS[selectedBrand].map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              isRedeemed={redeemedOffers[offer.id]}
              isExpired={expiredOffers[offer.id]}
              onRedeem={() => handleRedeem(offer.id)}
              onExpire={() => handleExpire(offer.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function OfferCard({ offer, isRedeemed, isExpired, onRedeem, onExpire }) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl text-indigo-600 font-bold">
          {offer.name}
        </CardTitle>
        <CardTitle className="text-lg">{offer.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{offer.description}</p>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button
          className="w-full"
          variant={isExpired ? "secondary" : "default"}
          disabled={isRedeemed || isExpired}
          onClick={onRedeem}
        >
          {isExpired ? (
            "Offer Expired"
          ) : isRedeemed ? (
            <Timer duration={8 * 60 * 60} onExpire={onExpire} />
          ) : (
            "Redeem"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
