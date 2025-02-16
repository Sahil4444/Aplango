import { useState } from "react";
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
} from "lucide-react";
import Navbar from "../Navbar/Navbar";
import { useNavigate, useLocation } from "react-router-dom";

export default function AnimatedLoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
    cardid: "",
    otp: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    navigate("/Aplango/ui");
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
                  <Label htmlFor="cardid">Card id</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      id="cardid"
                      type="varchar"
                      placeholder="Enter your Card id"
                      className="pl-10"
                      value={formData.cardid}
                      onChange={(e) =>
                        setFormData({ ...formData, cardid: e.target.value })
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
                      type={showPassword ? "text" : "password"}
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
                <div className="space-y-2">
                  <Label htmlFor="varchar">OTP</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      id="otp"
                      type="varchar"
                      placeholder="Enter OTP sent on your mail and phone number"
                      className="pl-10"
                      value={formData.otp}
                      onChange={(e) =>
                        setFormData({ ...formData, otp: e.target.value })
                      }
                      required
                    />
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
