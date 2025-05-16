"use client";

import { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { auth, firestore } from "../../../../../Database/Firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { PulseLoader } from "react-spinners";

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
        "Students can enjoy a special 20% discount on tickets and select items by showing a valid student ID. Don't miss out on this budget-friendly way to have fun!",
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

// const override = {
//   display: "block",
//   margin: "0 auto",
//   borderColor: "red",
//   width: "40px",
//   height: "40px",
//   border: "4px solid",
//   borderTop: "4px solid transparent",
//   borderRadius: "50%",
//   animation: "spin 1s linear infinite",
// };

export default function OffersPage() {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [redeemedOffers, setRedeemedOffers] = useState({});
  const [expiredOffers, setExpiredOffers] = useState({});
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);
  const [currentOffer, setCurrentOffer] = useState(null);
  const [offerTimers, setOfferTimers] = useState({});
  const [isRedeeming, setIsRedeeming] = useState(false);

  // Load redeemed and expired offers from Firestore on component mount
  useEffect(() => {
    const loadUserOfferStatus = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const userOffersRef = doc(firestore, "userOffers", currentUser.uid);
        const userOffersDoc = await getDoc(userOffersRef);

        if (userOffersDoc.exists()) {
          const userData = userOffersDoc.data();

          // Load redeemed offers with their timestamps
          if (userData.redeemedOffers) {
            setRedeemedOffers(userData.redeemedOffers);

            // Set up timers for offers that are still within the 8-hour window
            const currentTime = Date.now();
            const timers = {};

            Object.entries(userData.redeemedOffers).forEach(
              ([offerId, timestamp]) => {
                const expiryTime = timestamp + 8 * 60 * 60 * 1000; // 8 hours in milliseconds

                if (currentTime < expiryTime) {
                  // Offer still valid, calculate remaining time
                  const remainingTime = Math.floor(
                    (expiryTime - currentTime) / 1000
                  );
                  timers[offerId] = remainingTime;
                } else {
                  // Offer expired
                  setExpiredOffers((prev) => ({ ...prev, [offerId]: true }));
                }
              }
            );

            setOfferTimers(timers);
          }

          // Load expired offers
          if (userData.expiredOffers) {
            setExpiredOffers(userData.expiredOffers);
          }
        }
      } catch (error) {
        console.error("Error loading user offer status:", error);
      }
    };

    loadUserOfferStatus();
  }, []);

  const openTermsDialog = (offer) => {
    setCurrentOffer(offer);
    setTermsDialogOpen(true);
  };

  const handleRedeem = async (offerId) => {
    try {
      // Get current user
      setIsRedeeming(true);
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
      const userName =
        userData.displayName ||
        userData.name ||
        currentUser.displayName ||
        "Valued Customer";

      // Get the selected offer details
      const selectedOffer = OFFERS[selectedBrand].find(
        (offer) => offer.id === offerId
      );

      // Create template params with user data
      const templateParams = {
        to_email: userData.email || currentUser.email,
        to_name: userName,
        offer_name: selectedOffer.title,
        offer_description: selectedOffer.description,
        brand_name: selectedOffer.name,
      };

      // Update the UI to show the offer as redeemed
      const currentTime = Date.now();
      const updatedRedeemedOffers = {
        ...redeemedOffers,
        [offerId]: currentTime,
      };
      setRedeemedOffers(updatedRedeemedOffers);

      // Set timer for this offer
      setOfferTimers((prev) => ({
        ...prev,
        [offerId]: 8 * 60 * 60, // 8 hours in seconds
      }));

      // Store redeemed status in Firestore
      const userOffersRef = doc(firestore, "userOffers", currentUser.uid);
      const userOffersDoc = await getDoc(userOffersRef);

      if (userOffersDoc.exists()) {
        await updateDoc(userOffersRef, {
          redeemedOffers: updatedRedeemedOffers,
        });
      } else {
        await setDoc(userOffersRef, {
          redeemedOffers: updatedRedeemedOffers,
          expiredOffers: {},
        });
      }

      // Send email via EmailJS
      const service_id = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const template_id = import.meta.env
        .VITE_EMAILJS_SEND_REDEEM_OFFER_MAIL_TEMPLATE_ID2;
      const public_key = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      await emailjs.send(service_id, template_id, templateParams, public_key);

      toast.success(
        "Offer Redeemed Successfully! Redemption details sent to your email.",
        {
          position: "top-center",
        }
      );

      // Close the terms dialog
      setTermsDialogOpen(false);
    } catch (error) {
      console.error("Error redeeming offer:", error);
      toast.error("Failed to redeem offer. Please try again.", {
        position: "top-center",
      });
    } finally {
      setIsRedeeming(false); // stop spinner
    }
  };

  const handleExpire = async (offerId) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      // Update local state
      const updatedExpiredOffers = { ...expiredOffers, [offerId]: true };
      setExpiredOffers(updatedExpiredOffers);

      // Remove from timers
      const updatedTimers = { ...offerTimers };
      delete updatedTimers[offerId];
      setOfferTimers(updatedTimers);

      // Update in Firestore
      const userOffersRef = doc(firestore, "userOffers", currentUser.uid);
      await updateDoc(userOffersRef, {
        expiredOffers: updatedExpiredOffers,
      });
    } catch (error) {
      console.error("Error updating expired offer:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-48 md:py-8">
      <h1 className="text-3xl md:text-6xl font-bold text-center text-indigo-600 mb-6">
        Offers for you
      </h1>
      <p className="text-center mb-8">
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
              isRedeemed={!!redeemedOffers[offer.id]}
              isExpired={!!expiredOffers[offer.id]}
              timeRemaining={offerTimers[offer.id]}
              onRedeemClick={() => openTermsDialog(offer)}
              onExpire={() => handleExpire(offer.id)}
            />
          ))}
        </div>
      )}

      {/* Terms and Conditions Dialog */}
      <Dialog open={termsDialogOpen} onOpenChange={setTermsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Terms and Conditions</DialogTitle>
            <DialogDescription>
              Please read and accept the following terms and conditions to
              redeem your offer.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto p-4 border rounded-md my-4">
            <h3 className="font-semibold mb-2">{currentOffer?.title}</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              By accepting these terms, you agree to the following conditions
              for redeeming this offer:
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-sm">
              <li>
                This offer is valid for a single use only and cannot be combined
                with other promotions.
              </li>
              <li>
                Once redeemed, the offer will expire after 8 hours and cannot be
                reactivated.
              </li>
              <li>
                The offer is non-transferable and can only be used by the
                account holder.
              </li>
              <li>
                Redemption is subject to availability and may be declined at the
                discretion of the merchant.
              </li>
              <li>
                The merchant reserves the right to modify or cancel the offer at
                any time without prior notice.
              </li>
              <li>
                Any disputes regarding the offer will be resolved at the sole
                discretion of the merchant.
              </li>
              <li>
                Personal information collected during redemption may be used for
                marketing purposes in accordance with our privacy policy.
              </li>
              <li>
                By redeeming this offer, you consent to receive promotional
                emails related to similar offers.
              </li>
              <li>
                The offer cannot be exchanged for cash or other
                products/services not specified in the offer.
              </li>
              <li>
                Additional terms and conditions may apply based on the specific
                offer and merchant policies.
              </li>
            </ol>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <Button variant="outline" onClick={() => setTermsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => currentOffer && handleRedeem(currentOffer.id)}
              disabled={isRedeeming}
            >
              {isRedeeming ? (
                <div className="flex items-center gap-2">
                  <PulseLoader
                    color='#fff'
                    loading={isRedeeming}
                    size={10}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                    className="text-center"
                  />
                </div>
              ) : (
                "Accept & Redeem"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function OfferCard({
  offer,
  isRedeemed,
  isExpired,
  timeRemaining,
  onRedeemClick,
  onExpire,
}) {
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
          disabled={isExpired}
          onClick={isRedeemed ? undefined : onRedeemClick}
        >
          {isExpired ? (
            "Offer Expired"
          ) : isRedeemed ? (
            <Timer
              initialSeconds={timeRemaining}
              onExpire={() => onExpire(offer.id)}
            />
          ) : (
            "Redeem"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
