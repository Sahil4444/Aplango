import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  EyeIcon,
  EyeOffIcon,
  Mail,
  Lock,
  Loader2,
  Phone,
  Key,
  CreditCard,
  User2,
  CircleCheckBig,
} from "lucide-react";
import Navbar from "../Navbar/Navbar";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, firestore } from "../../../../Database/Firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import emailjs from "@emailjs/browser";

export default function AnimatedLoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [timer, setTimer] = useState(0);
  const [flag, setFlag] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [genOtp, setGenOtp] = useState("");

  const [canResend, setCanResend] = useState(false);

  const [isCardValid, setIsCardValid] = useState(false);
  const [userExists, setUserExists] = useState(false);

  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    cardId: "",
    otp: "",
  });
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // Check if card ID exists in the database
  const checkCardValidity = async (cardId) => {
    try {
      // Query the cards collection to check if the card ID exists
      const cardsRef = collection(firestore, "cards");
      const q = query(cardsRef, where("cardId", "==", cardId));
      const querySnapshot = await getDocs(q);

      const isValid = !querySnapshot.empty;

      if (isValid) {
        const cardData = querySnapshot.docs[0].data();
        console.log("Card is valid:", cardData);
        return { isValid: true, cardData };
      } else {
        alert("Card is not registered yet!");
        return { isValid: false, cardData: null };
      }
    } catch (error) {
      console.error("Error checking card validity:", error);
      alert("An error occurred while checking the card.");
      return { isValid: false, cardData: null };
    }
  };

  // Check if user exists in the database
  const checkUserExists = async (email, phone) => {
    try {
      // Query the users collection to check if a user with the given email or phone exists
      const usersRef = collection(firestore, "users");
      const emailQuery = query(usersRef, where("email", "==", email));
      const phoneQuery = query(usersRef, where("phone", "==", phone));

      const [emailSnapshot, phoneSnapshot] = await Promise.all([
        getDocs(emailQuery),
        getDocs(phoneQuery),
      ]);

      return !emailSnapshot.empty || !phoneSnapshot.empty;
    } catch (error) {
      console.error("Error checking user existence:", error);
      return false;
    }
  };

  const handleGetOTP = async (e) => {
    e.preventDefault();
    const service_id = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const template_id = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const public_key = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (formData.email && formData.phone) {
      setIsLoading(true);
      setFlag(true);

      // Generate a 4-digit OTP
      const generatedOTP = Math.floor(1000 + Math.random() * 9000);
      setGenOtp(generatedOTP);
      try {
        // Here you would typically call your backend API to send OTP
        // For demonstration, we'll just simulate a delay

        const templateParams = {
          to_email: formData.email,
          to_name: formData.name,
          sentOtp: generatedOTP,
        };
        console.log(templateParams.to_email);
        console.log(templateParams.to_name);
        console.log(templateParams.sentOtp);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Send email via EmailJS
        await emailjs.send(service_id, template_id, templateParams, public_key);
        setTimer(60);
        setCanResend(false);
        toast.success("OTP sent to your email id", {
          position: "top-center",
        });

        // alert("OTP sent to your email and phone number");
      } catch (error) {
        console.error("Error sending OTP:", error);
        toast.error("Failed to send OTP. Please try again.", {
          position: "top-center",
        });
        // alert("Failed to send OTP. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Please enter both email and phone number!", {
        position: "top-center",
      });
      // alert("Please enter both email and phone number");
    }
  };

  const handleValidateOtp = async (e) => {
    console.log(formData.otp);
    console.log(genOtp);
    if (formData.otp != genOtp) {
      toast.error("Invalid OTP. Please try again!", { position: "top-center" });
      return;
    } else {
      toast.success("Otp Verified Successfully!", { position: "top-center" });
      setIsOtpVerified(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Check if card ID exists in the database
      const { isValid } = await checkCardValidity(formData.cardId);

      if (!isValid) {
        toast.error("Card ID is not registered in our system!", {
          position: "top-center",
        });
        setIsLoading(false);
        return;
      }

      // Extract the last 6 digits of the card ID as the expected password
      const cardId = formData.cardId;
      const expectedPassword = cardId.slice(-6);
      console.log(expectedPassword);
      console.log(formData.password);
      console.log(formData.password === expectedPassword);

      if (formData.password !== expectedPassword) {
        toast.error("Incorrect password!", {
          position: "top-center",
        });
        setIsLoading(false);
        return;
      }

      // Here you would typically validate the OTP with your backend
      // For demonstration, we'll just simulate a delay
      const isUserExists = await checkUserExists(
        formData.email,
        formData.phone
      );
      if (isUserExists) {
        // Login user

        await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        toast.success("Login successful!", {
          position: "top-center",
        });
      } else {
        // Register user
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const user = userCredential.user;

        // Store user data in Firestore
        await setDoc(doc(firestore, "users", user.uid), {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          cardId: formData.cardId,
          createdAt: new Date(),
        });

        toast.success("Registration successful!", {
          position: "top-center",
        });
      }
      navigate("/Aplango/ui");
    } catch (error) {
      console.error("Authentication error:", error);
      let errorMessage = "Authentication failed. Please try again.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Email is already in use. Please login instead.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Please use a stronger password.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "User not found. Please register first.";
      }

      toast.error(errorMessage, {
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-gray-200">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <h2 className="text-3xl font-bold text-indigo-600 mb-4 mt-16 text-center">
            Login Here
          </h2>
          <Card className="backdrop-blur-sm bg-white/90 shadow-xl">
            <CardHeader className="py-3">
              <CardTitle className="text-xl font-bold text-center">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <div className="relative">
                    <User2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      id="name"
                      type="varchar"
                      placeholder="Enter your full name"
                      className="pl-10"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      id="phone"
                      type="varchar"
                      placeholder="Enter your phone number"
                      className="pl-10"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    type="button"
                    className="bg-white text-black border border-slate-500 hover:bg-indigo-500 hover:border-0 hover:text-white"
                    onClick={handleGetOTP}
                    disabled={isLoading || timer > 0}
                  >
                    {isLoading ? "Sending..." : "Get OTP"}
                  </Button>
                </div>

                {flag && (
                  <div className="my-2 flex items-center justify-between">
                    <p className="m-0 text-sm">
                      {timer > 0
                        ? `${Math.floor(timer / 60)}:${(timer % 60)
                            .toString()
                            .padStart(2, "0")}`
                        : "00:00"}
                    </p>
                    {canResend && (
                      <span
                        className="mt-0 text-md text-indigo-700 cursor-pointer"
                        onClick={handleGetOTP}
                      >
                        Resend OTP
                      </span>
                    )}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="varchar">OTP</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      id="otp"
                      type="number"
                      placeholder="Enter 4 digit OTP sent on your email id"
                      className="pl-10"
                      value={formData.otp}
                      onChange={(e) =>
                        setFormData({ ...formData, otp: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <button
                      onClick={handleValidateOtp}
                      className="text-sm flex items-center justify-center font-normal w-full bg-indigo-500 md:bg-transparent md:text-gray-700 hover:bg-indigo-500 hover:text-white md:border md:border-gray-500 py-2 rounded-sm text-white"
                      disabled={isOtpVerified} // Disable button if OTP is verified
                    >
                      {isOtpVerified ? (
                        <CircleCheckBig className="" />
                      ) : (
                        "Verify OTP"
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardId">Card id</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      id="cardId"
                      type="varchar"
                      placeholder="Enter your Card id"
                      className="pl-10"
                      value={formData.cardId}
                      onChange={(e) =>
                        setFormData({ ...formData, cardId: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      id="password"
                      type={showPassword ? "varchar" : "password"}
                      placeholder="Enter your password"
                      className="pl-10"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-4 w-4 text-gray-500" />
                      ) : (
                        <EyeIcon className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-transparent flex items-center justify-center text-gray-700 border-2 hover:border-none hover:bg-indigo-600 hover:text-white border-gray-300 py-2 rounded-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {isLoading ? "Signing in..." : "Sign in"}
                </button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
