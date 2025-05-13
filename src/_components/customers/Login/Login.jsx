"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
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
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  Info,
} from "lucide-react"
import Navbar from "../Navbar/Navbar"
import { useNavigate, useLocation } from "react-router-dom"
import { toast } from "react-toastify"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth"
import { auth, firestore } from "../../../../Database/Firebase"
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore"
import emailjs from "@emailjs/browser"

export default function AnimatedLoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [timer, setTimer] = useState(0)
  const [flag, setFlag] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [genOtp, setGenOtp] = useState("")

  const [canResend, setCanResend] = useState(false)

  const [isCardValid, setIsCardValid] = useState(false)
  const [userExists, setUserExists] = useState(false)

  const [isOtpVerified, setIsOtpVerified] = useState(false)
  const [confirmationResult, setConfirmationResult] = useState(null)
  const [phoneVerified, setPhoneVerified] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    cardId: "",
    otp: "",
  })

  // Initialize invisible reCAPTCHA
  const initializeRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {
          // reCAPTCHA solved, allow sending SMS
          console.log("reCAPTCHA verified")
        },
        "expired-callback": () => {
          // Reset reCAPTCHA
          console.log("reCAPTCHA expired")
        },
      })
    }
  }

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1)
      }, 1000)
      return () => clearInterval(interval)
    } else {
      setCanResend(true)
    }
  }, [timer])

  // Check if card ID exists in the database
  const checkCardValidity = async (cardId) => {
    try {
      // Query the cards collection to check if the card ID exists
      const cardsRef = collection(firestore, "cards")
      const q = query(cardsRef, where("cardId", "==", cardId))
      const querySnapshot = await getDocs(q)

      const isValid = !querySnapshot.empty

      if (isValid) {
        const cardData = querySnapshot.docs[0].data()
        console.log("Card is valid:", cardData)
        return { isValid: true, cardData }
      } else {
        alert("Card is not registered yet!")
        return { isValid: false, cardData: null }
      }
    } catch (error) {
      console.error("Error checking card validity:", error)
      alert("An error occurred while checking the card.")
      return { isValid: false, cardData: null }
    }
  }

  // Check if user exists in the database
  const checkUserExists = async (email, phone) => {
    try {
      // Query the users collection to check if a user with the given email or phone exists
      const usersRef = collection(firestore, "users")
      const emailQuery = query(usersRef, where("email", "==", email))
      const phoneQuery = query(usersRef, where("phone", "==", phone))

      const [emailSnapshot, phoneSnapshot] = await Promise.all([getDocs(emailQuery), getDocs(phoneQuery)])

      return !emailSnapshot.empty || !phoneSnapshot.empty
    } catch (error) {
      console.error("Error checking user existence:", error)
      return false
    }
  }

  const handleGetOTP = async (e) => {
    e.preventDefault()
    const service_id = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const template_id = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const public_key = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    if (formData.email && formData.phone) {
      setIsLoading(true)
      setFlag(true)

      // Generate a 4-digit OTP
      const generatedOTP = Math.floor(1000 + Math.random() * 9000)
      setGenOtp(generatedOTP)

      try {
        // Send OTP via email
        const templateParams = {
          to_email: formData.email,
          to_name: formData.name,
          sentOtp: generatedOTP,
        }

        await emailjs.send(service_id, template_id, templateParams, public_key)

        // Initialize reCAPTCHA
        initializeRecaptcha()

        // Format phone number (ensure it has country code)
        let phoneNumber = formData.phone
        if (!phoneNumber.startsWith("+")) {
          // Add India country code if not present (modify as needed)
          phoneNumber = "+91" + phoneNumber
        }

        // Send OTP via SMS
        try {
          const appVerifier = window.recaptchaVerifier
          const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier)
          setConfirmationResult(confirmation)

          toast.success("OTP sent to your email and phone number", {
            position: "top-center",
          })

          setTimer(60)
          setCanResend(false)
        } catch (smsError) {
          console.error("Error sending SMS OTP:", smsError)
          toast.warning("SMS OTP failed, but email OTP was sent", {
            position: "top-center",
          })
        }
      } catch (error) {
        console.error("Error sending OTP:", error)
        toast.error("Failed to send OTP. Please try again.", {
          position: "top-center",
        })
      } finally {
        setIsLoading(false)
      }
    } else {
      toast.error("Please enter both email and phone number!", {
        position: "top-center",
      })
    }
  }

  const handleValidateOtp = async (e) => {
    setOtpLoading(true)
    try {
      // Verify email OTP
      const emailOtpValid = formData.otp == genOtp

      // Verify SMS OTP if confirmation result exists
      let smsOtpValid = false
      if (confirmationResult) {
        try {
          await confirmationResult.confirm(formData.otp)
          smsOtpValid = true
          setPhoneVerified(true)
        } catch (error) {
          console.error("SMS OTP verification failed:", error)
          // If SMS verification fails but email verification passes, we'll still proceed
        }
      }

      // If either email or SMS OTP is valid, consider it verified
      if (emailOtpValid || smsOtpValid) {
        toast.success("OTP Verified Successfully!", { position: "top-center" })
        setIsOtpVerified(true)
      } else {
        toast.error("Invalid OTP. Please try again!", { position: "top-center" })
      }
    } catch (error) {
      console.error("OTP verification error:", error)
      toast.error("OTP verification failed. Please try again!", { position: "top-center" })
    } finally {
      setOtpLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Check if card ID exists in the database
      const { isValid } = await checkCardValidity(formData.cardId)

      if (!isValid) {
        toast.error("Card ID is not registered in our system!", {
          position: "top-center",
        })
        setIsLoading(false)
        return
      }

      // Extract the last 6 digits of the card ID as the expected password
      const cardId = formData.cardId
      const expectedPassword = cardId.slice(-6)
      console.log(expectedPassword)
      console.log(formData.password)
      console.log(formData.password === expectedPassword)

      if (formData.password !== expectedPassword) {
        toast.error("Incorrect password!", {
          position: "top-center",
        })
        setIsLoading(false)
        return
      }

      // Here you would typically validate the OTP with your backend
      // For demonstration, we'll just simulate a delay
      const isUserExists = await checkUserExists(formData.email, formData.phone)
      if (isUserExists) {
        // Login user

        await signInWithEmailAndPassword(auth, formData.email, formData.password)
        toast.success("Login successful!", {
          position: "top-center",
        })
      } else {
        // Register user
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
        const user = userCredential.user

        // Store user data in Firestore
        await setDoc(doc(firestore, "users", user.uid), {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          cardId: formData.cardId,
          createdAt: new Date(),
        })

        toast.success("Registration successful!", {
          position: "top-center",
        })
      }
      navigate("/Aplango/ui")
    } catch (error) {
      console.error("Authentication error:", error)
      let errorMessage = "Authentication failed. Please try again."

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Email or Phone number is already in use. Please login instead."
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address."
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Please use a stronger password."
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again."
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "User not found. Please register first."
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Phone number is already linked with another Email id!"
      }

      toast.error(errorMessage, {
        position: "top-center",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <Navbar />
      </div>
      <div className="flex-grow pt-20 bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="container mx-auto p-4 flex items-center justify-center">
          <div className="w-full max-w-6xl flex flex-col lg:flex-row rounded-xl overflow-hidden shadow-2xl">
            {/* Login Guide Container - Left Side */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white flex flex-col justify-center relative"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="text-3xl font-bold mb-6">Welcome Back!</h2>
                <p className="text-lg mb-8 text-indigo-100">
                  Log in to access your account and continue your journey with us.
                </p>
              </motion.div>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  className="flex items-start space-x-4"
                >
                  <div className="bg-white/20 p-2 rounded-full">
                    <UserCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl">Simple Authentication</h3>
                    <p className="text-indigo-100">Secure login with email and OTP verification</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  className="flex items-start space-x-4"
                >
                  <div className="bg-white/20 p-2 rounded-full">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl">Enhanced Security</h3>
                    <p className="text-indigo-100">Your data is protected with advanced encryption</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="bg-white/20 p-2 rounded-full">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl">Easy Access</h3>
                    <p className="text-indigo-100">Quick access to all your account features</p>
                  </div>
                </motion.div>
              </div>

              {/* Login Guide Steps */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="mt-8 bg-white/10 p-6 rounded-lg border border-white/20 backdrop-blur-sm"
              >
                <p className="font-medium text-lg mb-3 flex items-center">
                  <Info className="mr-2 h-5 w-5" /> How to Login
                </p>
                <ol className="list-decimal list-inside space-y-2 text-indigo-100">
                  <li>Enter your full name, email, and phone number</li>
                  <li>Click "Get OTP" and check your email for the verification code</li>
                  <li>Enter the 4-digit OTP and click "Verify OTP"</li>
                  <li>Enter your Card ID (the password is the last 6 digits of your Card ID)</li>
                  <li>Click "Sign in" to access your account</li>
                </ol>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.4 }}
                className="mt-8 bg-white/10 p-6 rounded-lg border border-white/20 backdrop-blur-sm"
              >
                <p className="font-medium text-lg mb-2">Need Help?</p>
                <p className="text-indigo-100 mb-4">
                  If you're having trouble logging in, please contact our support team.
                </p>
                <Button
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-indigo-700"
                >
                  Contact Support <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>

              {/* Animated background elements */}
              <motion.div
                className="absolute top-20 left-10 w-20 h-20 rounded-full bg-purple-500/20 blur-xl"
                animate={{
                  x: [0, 30, 0],
                  y: [0, 20, 0],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 8,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-indigo-500/20 blur-xl"
                animate={{
                  x: [0, -40, 0],
                  y: [0, -30, 0],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 10,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            {/* Login Form Container - Right Side */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full lg:w-1/2 bg-white p-8"
            >
              <div className="w-full max-w-md mx-auto">
                <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">Login Here</h2>
                <Card className="backdrop-blur-sm bg-white/90 shadow-xl border-indigo-100">
                  <CardHeader className="py-3">
                    <CardTitle className="text-xl font-bold text-center">Welcome Back</CardTitle>
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
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                              ? `${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, "0")}`
                              : "00:00"}
                          </p>
                          {canResend && (
                            <span className="mt-0 text-md text-indigo-700 cursor-pointer" onClick={handleGetOTP}>
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
                            onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="relative">
                          <button
                            onClick={handleValidateOtp}
                            className="text-sm flex items-center justify-center font-normal w-full bg-indigo-500 md:bg-transparent md:text-gray-700 hover:bg-indigo-500 hover:text-white md:border md:border-gray-500 py-2 rounded-sm text-white"
                            disabled={isOtpVerified || otpLoading}
                          >
                            {isOtpVerified ? (
                              <CircleCheckBig className="" />
                            ) : otpLoading ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
                            onChange={(e) => setFormData({ ...formData, cardId: e.target.value })}
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
                              setFormData({
                                ...formData,
                                password: e.target.value,
                              })
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
                        <p className="text-xs text-gray-500 mt-1">Your password is the last 6 digits of your Card ID</p>
                      </div>

                      {/* Hidden reCAPTCHA container */}
                      <div id="recaptcha-container"></div>
                      <button
                        type="submit"
                        className="w-full bg-transparent flex items-center justify-center text-gray-700 border-2 hover:border-none hover:bg-indigo-600 hover:text-white border-gray-300 py-2 rounded-lg"
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {isLoading ? "Signing in..." : "Sign in"}
                      </button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
