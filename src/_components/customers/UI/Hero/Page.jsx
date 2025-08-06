"use client";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { PulseLoader } from "react-spinners";

export default function OffersPage() {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [brands, setBrands] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [redeemedOffers, setRedeemedOffers] = useState({});
  const [expiredOffers, setExpiredOffers] = useState({});
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);
  const [currentOffer, setCurrentOffer] = useState(null);
  const [offerTimers, setOfferTimers] = useState({});
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userNumber, setUserNumber] = useState("");
  const [smsLoading, setSmsLoading] = useState(false);

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setUserLoading(false);
      if (user) {
        // Fetch user phone number
        try {
          const userDocRef = doc(firestore, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const phoneNumber = userData.phoneNumber || userData.phone || "";
            setUserNumber(phoneNumber);
          }
        } catch (error) {
          console.error("Error fetching user phone number:", error);
          setUserNumber("");
        }
      } else {
        // Clear all states if user is not authenticated
        setRedeemedOffers({});
        setExpiredOffers({});
        setOfferTimers({});
        setUserNumber("");
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch brands from Firestore
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoadingBrands(true);
        const brandsCollection = collection(firestore, "brands");
        const brandsSnapshot = await getDocs(brandsCollection);
        const brandsData = brandsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBrands(brandsData);
      } catch (error) {
        console.error("Error fetching brands:", error);
        toast.error("Failed to load brands. Please try again.", {
          position: "top-center",
        });
      } finally {
        setLoadingBrands(false);
      }
    };

    fetchBrands();
  }, []);

  // Fetch offers when a brand is selected
  useEffect(() => {
    const fetchOffers = async () => {
      if (!selectedBrand) {
        setOffers([]);
        return;
      }

      try {
        setLoadingOffers(true);
        const offersCollection = collection(firestore, "offers");
        const offersQuery = query(
          offersCollection,
          where("title", "==", selectedBrand)
        );
        const offersSnapshot = await getDocs(offersQuery);
        const offersData = offersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOffers(offersData);
      } catch (error) {
        console.error("Error fetching offers:", error);
        toast.error("Failed to load offers. Please try again.", {
          position: "top-center",
        });
      } finally {
        setLoadingOffers(false);
      }
    };

    fetchOffers();
  }, [selectedBrand]);

  // Real-time listener for user offer status based on cardId
  useEffect(() => {
    if (!currentUser || userLoading) return;

    const fetchUserCardId = async () => {
      try {
        // Fetch user data to get cardId
        const userDocRef = doc(firestore, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
          console.error("User document not found");
          return;
        }

        const userData = userDoc.data();
        const cardId = userData.cardId;

        if (!cardId) {
          console.error("CardId not found in user data");
          return;
        }

        // Use cardId instead of user UID for offer states
        const cardOffersRef = doc(firestore, "cardOffers", cardId);
        const unsubscribe = onSnapshot(
          cardOffersRef,
          (doc) => {
            if (doc.exists()) {
              const cardData = doc.data();

              // Load redeemed offers with their timestamps
              if (cardData.redeemedOffers) {
                setRedeemedOffers(cardData.redeemedOffers);

                // Set up timers for offers that are still within the 8-hour window
                const currentTime = Date.now();
                const timers = {};
                const newExpiredOffers = { ...(cardData.expiredOffers || {}) };

                Object.entries(cardData.redeemedOffers).forEach(
                  ([offerId, timestamp]) => {
                    const expiryTime = timestamp + 8 * 60 * 60 * 1000; // 8 hours in milliseconds

                    if (currentTime < expiryTime) {
                      // Offer still valid, calculate remaining time
                      const remainingTime = Math.floor(
                        (expiryTime - currentTime) / 1000
                      );
                      timers[offerId] = remainingTime;
                    } else {
                      // Offer expired, mark it as expired
                      newExpiredOffers[offerId] = true;
                    }
                  }
                );

                setOfferTimers(timers);

                // Update expired offers if any new ones expired
                if (
                  Object.keys(newExpiredOffers).length !==
                  Object.keys(cardData.expiredOffers || {}).length
                ) {
                  updateDoc(cardOffersRef, {
                    expiredOffers: newExpiredOffers,
                  }).catch(console.error);
                }
              } else {
                setRedeemedOffers({});
                setOfferTimers({});
              }

              // Load expired offers
              if (cardData.expiredOffers) {
                setExpiredOffers(cardData.expiredOffers);
              } else {
                setExpiredOffers({});
              }

              // Load selected brand preference
              if (cardData.selectedBrand) {
                setSelectedBrand(cardData.selectedBrand);
              }
            } else {
              // Initialize card offers document
              setDoc(cardOffersRef, {
                redeemedOffers: {},
                expiredOffers: {},
                selectedBrand: "",
              }).catch(console.error);
            }
          },
          (error) => {
            console.error("Error listening to card offers:", error);
          }
        );

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching user cardId:", error);
      }
    };

    fetchUserCardId();
  }, [currentUser, userLoading]);

  // Save selected brand to Firestore using cardId
  useEffect(() => {
    if (!currentUser || userLoading || !selectedBrand) return;

    const saveSelectedBrand = async () => {
      try {
        // Fetch user data to get cardId
        const userDocRef = doc(firestore, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
          console.error("User document not found");
          return;
        }

        const userData = userDoc.data();
        const cardId = userData.cardId;

        if (!cardId) {
          console.error("CardId not found in user data");
          return;
        }

        const cardOffersRef = doc(firestore, "cardOffers", cardId);
        const cardOffersDoc = await getDoc(cardOffersRef);

        if (cardOffersDoc.exists()) {
          await updateDoc(cardOffersRef, {
            selectedBrand: selectedBrand,
          });
        } else {
          await setDoc(cardOffersRef, {
            redeemedOffers: {},
            expiredOffers: {},
            selectedBrand: selectedBrand,
          });
        }
      } catch (error) {
        console.error("Error saving selected brand:", error);
      }
    };

    saveSelectedBrand();
  }, [selectedBrand, currentUser, userLoading]);

  const openTermsDialog = (offer) => {
    setCurrentOffer(offer);
    setTermsDialogOpen(true);
  };

  const handleRedeem = async (offerId) => {
    let emailSuccess = false;
    try {
      setIsRedeeming(true);

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
      const cardId = userData.cardId;

      if (!cardId) {
        toast.error("Card ID not found in user profile", {
          position: "top-center",
        });
        return;
      }

      const userName =
        userData.displayName ||
        userData.name ||
        currentUser.displayName ||
        "Valued Customer";

      // Get the selected offer details
      const selectedOffer = offers.find((offer) => offer.id === offerId);

      // Create template params with user data
      const templateParams = {
        to_email: userData.email || currentUser.email,
        to_name: userName,
        offer_name: selectedOffer.desc,
        brand_name: selectedOffer.title,
        terms_and_conditions: selectedOffer.termsAndConditions,
        redemption_date: new Date().toLocaleDateString(),
        redemption_time: new Date().toLocaleTimeString(),
      };

      // Update the redeemed offers in Firestore using cardId
      const currentTime = Date.now();
      const updatedRedeemedOffers = {
        ...redeemedOffers,
        [offerId]: currentTime,
      };

      const cardOffersRef = doc(firestore, "cardOffers", cardId);
      const cardOffersDoc = await getDoc(cardOffersRef);

      if (cardOffersDoc.exists()) {
        await updateDoc(cardOffersRef, {
          redeemedOffers: updatedRedeemedOffers,
        });
      } else {
        await setDoc(cardOffersRef, {
          redeemedOffers: updatedRedeemedOffers,
          expiredOffers: {},
          selectedBrand: selectedBrand,
        });
      }

      // Send email via EmailJS
      const service_id = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const template_id = import.meta.env
        .VITE_EMAILJS_SEND_REDEEM_OFFER_MAIL_TEMPLATE_ID2;
      const public_key = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      // // Sms params
      // const senderId = import.meta.env.VITE_SMS_SENDER_ID;
      // const smsApiKey = import.meta.env.VITE_SMS_API_KEY;
      // const smsTemplateId = import.meta.env.VITE_DLT_OFFER_TEMPLATE_ID;
      // const senderName = import.meta.env.VITE_SMS_USERNAME;
      // const smsRoute = import.meta.env.VITE_SMS_ROUTE;
      // const usernumber

      const formattedPhone = userNumber.replace(/\D/g, "");
      const baseUrl = "https://alots.in/sms-panel/api/http/index.php";
      const queryParams = new URLSearchParams({
        username: import.meta.env.VITE_SMS_USERNAME,
        apikey: import.meta.env.VITE_SMS_API_KEY,
        apirequest: "Text",
        sender: import.meta.env.VITE_SMS_SENDER_ID, // Replace with your approved Sender ID
        mobile: formattedPhone,
        message: `Hello User, Congratulations! ${selectedOffer.title} Offer for you! You have successfully redeemed the following offer: ${selectedOffer.desc} Terms and Conditions Apply Enjoy your benefits! Aplango Promo Services`,
        route: import.meta.env.VITE_SMS_ROUTE, // Replace with your actual route, e.g. "Transactional"
        TemplateID: import.meta.env.VITE_DLT_OFFER_TEMPLATE_ID, // Replace with actual DLT template ID
        format: "JSON",
      });

      await emailjs.send(service_id, template_id, templateParams, public_key);
      emailSuccess = true;

      toast.success(
        "Offer Redeemed Successfully! Redemption details sent to your email.",
        {
          position: "top-center",
        }
      );

      setTermsDialogOpen(false);

      const url = `${baseUrl}?${queryParams.toString()}`;
      console.log(url);
      const response = await fetch(url, { method: "GET" });
      const resultText = await response.text(); // use .text() to avoid JSON parsing errors
      const result = JSON.parse(resultText);
          } catch (error) {
      // ✅ Ignore SMS error
      console.warn("Failed to send SMS (ignored):", error.message);
    } finally {
      setIsRedeeming(false);
      setTermsDialogOpen(false);
    }
  };

  const handleExpire = async (offerId) => {
    try {
      if (!currentUser) return;

      // Fetch user data to get cardId
      const userDocRef = doc(firestore, "users", currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        console.error("User document not found");
        return;
      }

      const userData = userDoc.data();
      const cardId = userData.cardId;

      if (!cardId) {
        console.error("CardId not found in user data");
        return;
      }

      // Update expired offers in Firestore using cardId
      const updatedExpiredOffers = { ...expiredOffers, [offerId]: true };

      const cardOffersRef = doc(firestore, "cardOffers", cardId);
      await updateDoc(cardOffersRef, {
        expiredOffers: updatedExpiredOffers,
      });

      // Remove from local timers
      const updatedTimers = { ...offerTimers };
      delete updatedTimers[offerId];
      setOfferTimers(updatedTimers);
    } catch (error) {
      console.error("Error updating expired offer:", error);
    }
  };

  // Show loading state while checking authentication
  if (userLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="flex items-center justify-center py-8">
          <PulseLoader
            color="#6366f1"
            loading={true}
            size={10}
            aria-label="Loading"
            data-testid="auth-loader"
          />
          <span className="ml-3 text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!currentUser) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="text-center py-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center text-indigo-600 mb-4 sm:mb-6 leading-tight">
            Offers for you
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Please log in to view and redeem offers.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-indigo-600 mb-4 sm:mb-6 leading-tight">
          Offers for you
        </h1>
        <p className="text-base sm:text-lg text-center mb-8 max-w-2xl mx-auto leading-relaxed">
          Select your favorite brand and enjoy amazing offers tailored just for
          you.
        </p>
      </div>

      <div className="max-w-xl mx-auto mb-8 sm:mb-12">
        <Select
          className="flex items-center justify-center"
          value={selectedBrand}
          onValueChange={(value) => setSelectedBrand(value)}
          disabled={loadingBrands}
        >
          <SelectTrigger className="w-full h-12 text-base border border-gray-300 hover:border-gray-400 focus:border-indigo-500">
            <SelectValue
              placeholder={
                loadingBrands ? "Loading brands..." : "Select brand or shop"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {loadingBrands ? (
              <div className="flex items-center justify-center p-4">
                <PulseLoader
                  color="#6366f1"
                  loading={loadingBrands}
                  size={8}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </div>
            ) : brands.length > 0 ? (
              brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.brandName}>
                  {brand.brandName}
                </SelectItem>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No brands available
              </div>
            )}
          </SelectContent>
        </Select>
      </div>

      {selectedBrand && (
        <div className="mb-4">
          {loadingOffers ? (
            <div className="flex items-center justify-center py-8">
              <PulseLoader
                color="#6366f1"
                loading={loadingOffers}
                size={10}
                aria-label="Loading Offers"
                data-testid="offers-loader"
              />
              <span className="ml-3 text-muted-foreground">
                Loading offers...
              </span>
            </div>
          ) : offers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
              {offers.map((offer) => (
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
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground text-base sm:text-lg">
                No offers available for {selectedBrand} at the moment.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Terms and Conditions Dialog */}
      <Dialog open={termsDialogOpen} onOpenChange={setTermsDialogOpen}>
        <DialogContent className="sm:max-w-md max-w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              Terms and Conditions
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Please read and accept the following terms and conditions to
              redeem your offer.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[50vh] overflow-y-auto p-4 border rounded-md my-4">
            <h3 className="font-semibold mb-2 text-sm sm:text-base">
              {currentOffer?.desc}
            </h3>
            <p className="mb-4 text-xs sm:text-sm text-muted-foreground">
              By accepting these terms, you agree to the following conditions
              for redeeming this offer:
            </p>
            <div className="text-xs sm:text-sm">
              {currentOffer?.termsAndConditions ? (
                <ol className="list-decimal list-inside space-y-2">
                  {currentOffer.termsAndConditions
                    .split(".")
                    .filter((term) => term.trim().length > 0)
                    .map((term, index) => (
                      <li key={index} className="text-xs sm:text-sm">
                        {term.trim()}.
                      </li>
                    ))}
                </ol>
              ) : (
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Terms and conditions not available.
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <Button
              variant="outline"
              onClick={() => setTermsDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={() => currentOffer && handleRedeem(currentOffer.id)}
              disabled={isRedeeming}
              className="w-full sm:w-auto"
            >
              {isRedeeming ? (
                <div className="flex items-center gap-2">
                  <PulseLoader
                    color="#fff"
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
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 60; // Maximum characters to show before truncation

  // Check if offer has expired based on expiryDate
  const isOfferExpired = () => {
    if (!offer.expiryDate) return false;
    const expiryDate = new Date(offer.expiryDate);
    const currentDate = new Date();
    return currentDate > expiryDate;
  };

  const offerExpired = isOfferExpired() || isExpired;

  // Generate a random brand image based on brand name
  const getBrandImage = (brandName) => {
    const seed = brandName.toLowerCase().replace(/\s+/g, '');
    return `/placeholder.svg?height=80&width=80&query=${encodeURIComponent(`${brandName} brand logo`)}`;
  };

  const shouldTruncate = offer.desc && offer.desc.length > maxLength;
  const displayText = shouldTruncate && !isExpanded 
    ? offer.desc.substring(0, maxLength) + "..."
    : offer.desc;

  return (
    <Card className="w-full h-64 sm:h-72 md:h-80 lg:h-72 xl:h-80 flex flex-col transition-all duration-200 hover:shadow-lg">
      <CardHeader className="flex-none p-3 sm:p-4 flex flex-col items-center">
        {/* Brand Image */}
        <div className="flex justify-center mb-2">
          <img
            src={getBrandImage(offer.title) || "/placeholder.svg"}
            alt={`${offer.title} logo`}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-gray-200"
          />
        </div>
        
        {/* Brand Name */}
        <CardTitle className="text-sm sm:text-base font-bold mb-2 text-center leading-tight text-indigo-600">
          {offer.title}
        </CardTitle>
      </CardHeader>
      
      {/* Offer Description Section with fixed height */}
      <div className="flex-1 px-3 sm:px-4 flex flex-col justify-start">
        <div className="h-16 sm:h-20 overflow-hidden">
          <p className="text-xs sm:text-sm text-center leading-relaxed">
            {displayText}
          </p>
        </div>
        
        {shouldTruncate && (
          <div className="mt-1 flex justify-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              {isExpanded ? "Less" : "More"}
            </button>
          </div>
        )}
      </div>
      
      <CardFooter className="flex-none p-3 sm:p-4 pt-0 flex flex-col gap-2">
        {/* Expiry Date */}
        {offer.expiryDate && (
          <p className="text-xs text-muted-foreground text-center h-4">
            Expires: {new Date(offer.expiryDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </p>
        )}
        
        {/* Redeem Button */}
        <Button
          className="w-full h-8 sm:h-9 text-xs sm:text-sm"
          variant={offerExpired ? "secondary" : "default"}
          disabled={offerExpired}
          onClick={isRedeemed ? undefined : onRedeemClick}
        >
          {offerExpired ? (
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
