"use client"

import { useState } from "react"
import { firestore } from "../../../../Database/Firebase" // Import your existing firebase config
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { toast } from "react-toastify"


function BrandRegister() {
  const [brandName, setBrandName] = useState("")
  const [termsConditions, setTermsConditions] = useState("")
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({ show: false, type: "", message: "" })

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Basic validation
    if (!brandName.trim() || !termsConditions.trim()) {
      setAlert({
        show: true,
        type: "error",
        message: "Please fill in all fields",
      })
      return
    }

    setLoading(true)

    try {
      // Reference to the "brands" collection in Firestore
      const brandsCollection = collection(firestore, "brands")

      // Check if brand already exists
      const brandQuery = query(brandsCollection, where("brandName", "==", brandName.trim()))

      const querySnapshot = await getDocs(brandQuery)

      if (!querySnapshot.empty) {
        // Brand already exists
        toast.error("Brand already exist!");
        setLoading(false)
        return
      }

      // Add a new document to the collection
      await addDoc(brandsCollection, {
        brandName: brandName,
        termsConditions: termsConditions,
        createdAt: serverTimestamp(), // Firestore server timestamp
      })

      // Show success alert
      toast.success("Brand added successfully.")

      // Reset form
      setBrandName("")
      setTermsConditions("")
    } catch (error) {
      console.error("Error registering brand:", error)
      toast.error("Something went wrong!");
    } finally {
      setLoading(false)

      // Hide alert after 5 seconds
      setTimeout(() => {
        setAlert({ show: false, type: "", message: "" })
      }, 5000)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Register Brand</CardTitle>
          <CardDescription>Enter your brand details to register</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {alert.show && (
              <Alert variant={alert.type === "error" ? "destructive" : "default"}>
                {alert.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                <AlertTitle>{alert.type === "error" ? "Error" : "Success"}</AlertTitle>
                <AlertDescription>{alert.message}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="brand-name">Brand Name</Label>
              <Input
                id="brand-name"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Enter your brand name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="terms-conditions">Terms and Conditions</Label>
              <Textarea
                id="terms-conditions"
                value={termsConditions}
                onChange={(e) => setTermsConditions(e.target.value)}
                placeholder="Enter terms and conditions for your brand"
                className="min-h-[150px]"
                required
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registering..." : "Register Brand"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default BrandRegister
