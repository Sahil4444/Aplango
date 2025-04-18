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
import { toast } from "react-toastify";
import emailjs from "@emailjs/browser";

import { auth, firestore } from "../../../../../Database/Firebase";
import { doc, getDoc } from "firebase/firestore";

const OFFERS = {
  Imagica: [
    {
      id: "imagica-1",
      name: "Imagica",
      title: "30% Off on All Items",
      description:
        "Enjoy a massive 30% discount on all Imagica products this season. Whether it's merchandise, food, or attractions, save big on your visit!",
    },
    {
      id: "imagica-2",
      name: "Imagica",
      title: "Buy 2 Get 1 Free",
      description:
        "Grab any two items and get a third one absolutely free. This limited-time offer is perfect for families and groups looking to make the most of their Imagica experience!",
    },
    {
      id: "imagica-3",
      name: "Imagica",
      title: "Student Discount 20%",
      description:
        "Students can enjoy a special 20% discount on tickets and select items by showing a valid student ID. Don’t miss out on this budget-friendly way to have fun!",
    },
    {
      id: "imagica-4",
      name: "Imagica",
      title: "Family Package Deal",
      description:
        "Book tickets for four or more family members and get a 40% discount on your total purchase. Spend quality time with your loved ones at an unbeatable price!",
    },
  ],
  Habib: [
    {
      id: "habib-1",
      name: "Habib",
      title: "Buy 1 Get 1 Free",
      description:
        "Shop your favorite jewelry pieces and get a second one for free. This special weekend deal applies to selected items, making it the perfect time to add to your collection!",
    },
    {
      id: "habib-2",
      name: "Habib",
      title: "50% Off on Jewelry",
      description:
        "Get 50% off on our exclusive jewelry collection, featuring stunning gold and silver pieces. Elevate your style with timeless accessories at half the price!",
    },
    {
      id: "habib-3",
      name: "Habib",
      title: "Diamond Collection Sale",
      description:
        "Enjoy up to 30% off on our exquisite diamond collection. Whether you're looking for engagement rings or elegant necklaces, now is the perfect time to buy!",
    },
    {
      id: "habib-4",
      name: "Habib",
      title: "Free Gift on Purchase",
      description:
        "Receive a free luxury gift when you spend $500 or more at Habib. A perfect way to treat yourself or surprise a loved one with something extra!",
    },
  ],
  Splash: [
    {
      id: "splash-1",
      name: "Splash",
      title: "Flat 50% Off",
      description:
        "Shop your favorite fashion pieces at half price during our massive clearance sale. Don't miss this chance to upgrade your wardrobe with trendy outfits!",
    },
    {
      id: "splash-2",
      name: "Splash",
      title: "New Arrival Discount",
      description:
        "Get 25% off on the latest winter collection, featuring stylish jackets, sweaters, and accessories. Stay cozy and fashionable this season!",
    },
    {
      id: "splash-3",
      name: "Splash",
      title: "Bundle Offer",
      description:
        "Buy any 3 items from our collection and enjoy a 40% discount on your total purchase. Mix and match your favorite styles while saving big!",
    },
    {
      id: "splash-4",
      name: "Splash",
      title: "Premium Collection Deal",
      description:
        "Save up to 35% on our premium brands, featuring high-quality fabrics and exclusive designs. Elevate your fashion game without breaking the bank!",
    },
  ],
  Suzuki: [
    {
      id: "suzuki-1",
      name: "Suzuki",
      title: "Free Service Check",
      description:
        "Get a complimentary vehicle inspection and basic service to ensure your car is running smoothly. Our experts will check essential components and provide recommendations!",
    },
    {
      id: "suzuki-2",
      name: "Suzuki",
      title: "Oil Change Offer",
      description:
        "Enjoy a 50% discount on your next oil change and keep your engine running at peak performance. This offer ensures long-lasting protection for your vehicle!",
    },
    {
      id: "suzuki-3",
      name: "Suzuki",
      title: "Spare Parts Discount",
      description:
        "Save 20% on genuine Suzuki spare parts, ensuring the best quality and durability for your vehicle. Keep your car in top condition at a lower cost!",
    },
    {
      id: "suzuki-4",
      name: "Suzuki",
      title: "Winter Service Package",
      description:
        "Prepare your car for winter with our special service package, including battery checks, tire inspections, and antifreeze top-ups at exclusive rates!",
    },
  ],
};

export default function OffersPage() {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [redeemedOffers, setRedeemedOffers] = useState({});
  const [expiredOffers, setExpiredOffers] = useState({});

  const handleRedeem = async (offerId) => {
    try {
      // Get current user
      const currentUser = auth.currentUser;

      if (!currentUser) {
        toast.error("You must be logged in to redeem offers", {
          position: "top-center",
        });
        return;
      }

      // Fetch user data from Firestore
      const userDocRef = doc(firestore, "users", currentUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        toast.error("User profile not found", {
          position: "top-center",
        });
        return;
      }

      const userData = userDoc.data();
      const userName = userData.displayName || userData.name || currentUser.displayName || "Valued Customer";

      // Get the selected offer details
      const selectedOffer = OFFERS[selectedBrand].find(
        (offer) => offer.id === offerId
      );

      // Create template params with user data
      const templateParams = {
        to_email: userData.email || currentUser.email,
        to_name:
          userName,
        offer_name: selectedOffer.title,
        offer_description: selectedOffer.description,
        brand_name: selectedOffer.name,
      };

      console.log(templateParams.to_email);
      console.log(templateParams.to_name);
      console.log(templateParams.offer_name);
      console.log(templateParams.offer_description);
      console.log(templateParams.brand_name);

      // Update the UI to show the offer as redeemed
      setRedeemedOffers((prev) => ({ ...prev, [offerId]: true }));

      // Send email via EmailJS
      const service_id = import.meta.env.VITE_EMAILJS_SERVICE_ID2;
      const template_id = import.meta.env
        .VITE_EMAILJS_SEND_REDEEM_OFFER_MAIL_TEMPLATE_ID2;
      const public_key = import.meta.env.VITE_EMAILJS_PUBLIC_KEY2;

      await emailjs.send(service_id, template_id, templateParams, public_key);

      toast.success(
        "Offer Redeemed Successfully! Redemption details sent to your email.",
        {
          position: "top-center",
        }
      );
    } catch (error) {
      console.error("Error redeeming offer:", error);
      toast.error("Failed to redeem offer. Please try again.", {
        position: "top-center",
      });
    }
  };

  const handleExpire = (offerId) => {
    setExpiredOffers((prev) => ({ ...prev, [offerId]: true }));
  };

  return (
    <div className="container mx-auto px-4 pt-48 md:py-8">
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
