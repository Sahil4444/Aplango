import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify"
import { firestore } from "../../../../Database/Firebase";


// Initialize Firebase

function CouponRegister() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couponData, setCouponData] = useState({
    title: "",
    desc: "",
    termsAndConditions: "",
    createdAt: null,
    expiryDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCouponData({
      ...couponData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!couponData.title.trim()) {
      toast.warning("Coupon title is required!");
      return;
    }

    if (!couponData.termsAndConditions.trim()) {
      toast.warning("Terms and conditions required!");
      return;
    }

    try {
      setIsSubmitting(true);

      // Create a new coupon document in the "offers" collection
      const couponWithTimestamp = {
        ...couponData,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(
        collection(firestore, "offers"),
        couponWithTimestamp
      );

      toast.success("Coupon created successfully.")

      // Reset form after successful submission
      setCouponData({
        title: "",
        desc: "",
        termsAndConditions: "",
        createdAt: null,
        expiryDate: "",
      });
    } catch (error) {
      console.error("Error adding coupon: ", error);
      toast.error("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 max-w-5xl flex items-center flex-col">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Coupon Registration
      </h1>

      <div className="w-full">
        <Card className="shadow-lg">
          <CardHeader className='text-center'>
            <CardTitle>Create New Coupon</CardTitle>
            <CardDescription>
              Fill in the details to create a new coupon offer
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Brand Name</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter coupon title"
                  value={couponData.title}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Coupon Title</Label>
                <Input
                  id="desc"
                  name="desc"
                  placeholder="Enter coupon description"
                  value={couponData.desc}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  value={couponData.expiryDate}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="termsAndConditions">Terms & Conditions</Label>
                <Textarea
                  id="termsAndConditions"
                  name="termsAndConditions"
                  placeholder="Enter terms and conditions"
                  value={couponData.termsAndConditions}
                  onChange={handleChange}
                  rows={5}
                  className="w-full resize-none"
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700"
              >
                {isSubmitting ? "Submitting..." : "Create Coupon"}
              </Button>
            </CardFooter>
          </form>
        </Card>

      </div>
    </div>
  );
}

export default CouponRegister;
