"use client"
import { useState } from "react"
import { firestore } from "../../../../Database/Firebase" // Import your existing firebase config
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, Upload, X, ImageIcon } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { toast } from "react-toastify"

function BrandRegister() {
  const [brandName, setBrandName] = useState("")
  const [brandEmail, setBrandEmail] = useState("")
  const [termsConditions, setTermsConditions] = useState("")
  const [brandLogo, setBrandLogo] = useState(null)
  const [logoPreview, setLogoPreview] = useState("")
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({ show: false, type: "", message: "" })

  // Handle file upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file")
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB")
        return
      }

      setBrandLogo(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Remove uploaded logo
  const removeLogo = () => {
    setBrandLogo(null)
    setLogoPreview("")
    // Reset file input
    const fileInput = document.getElementById('logo-upload')
    if (fileInput) fileInput.value = ''
  }

  // Convert file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!brandName.trim() || !termsConditions.trim() || !brandEmail.trim()) {
      setAlert({
        show: true,
        type: "error",
        message: "Please fill in all required fields",
      })
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(brandEmail.trim())) {
      setAlert({
        show: true,
        type: "error",
        message: "Please enter a valid email address",
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
        toast.error("Brand already exists!")
        setLoading(false)
        return
      }

      // Prepare brand data
      const brandData = {
        brandName: brandName.trim(),
        brandEmail: brandEmail.trim(),
        termsConditions: termsConditions.trim(),
        createdAt: serverTimestamp(),
      }

      // Add logo if uploaded
      if (brandLogo) {
        const logoBase64 = await convertToBase64(brandLogo)
        brandData.brandlogo = logoBase64
      }

      // Add a new document to the collection
      await addDoc(brandsCollection, brandData)

      // Show success alert
      toast.success("Brand registered successfully!")
      
      // Reset form
      setBrandName("")
      setTermsConditions("")
      setBrandEmail("")
      setBrandLogo(null)
      setLogoPreview("")
      
      // Reset file input
      const fileInput = document.getElementById('logo-upload')
      if (fileInput) fileInput.value = ''

    } catch (error) {
      console.error("Error registering brand:", error)
      toast.error("Something went wrong!")
    } finally {
      setLoading(false)
      // Hide alert after 5 seconds
      setTimeout(() => {
        setAlert({ show: false, type: "", message: "" })
      }, 5000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="flex justify-center items-center min-h-full">
        <Card className="w-full max-w-2xl shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <ImageIcon className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Register Your Brand
            </CardTitle>
            <CardDescription className="text-base sm:text-lg text-gray-600 mt-2">
              Join our platform and showcase your brand to millions of customers
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 px-6 sm:px-8">
              {alert.show && (
                <Alert variant={alert.type === "error" ? "destructive" : "default"} className="border-l-4">
                  {alert.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                  <AlertTitle className="font-semibold">
                    {alert.type === "error" ? "Error" : "Success"}
                  </AlertTitle>
                  <AlertDescription>{alert.message}</AlertDescription>
                </Alert>
              )}

              {/* Brand Logo Upload */}
              <div className="space-y-3">
                <Label htmlFor="logo-upload" className="text-sm font-semibold text-gray-700">
                  Brand Logo <span className="text-gray-400">(Optional)</span>
                </Label>
                
                {!logoPreview ? (
                  <div className="relative">
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="flex flex-col items-center justify-center w-full h-32 sm:h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 text-center px-4">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="flex items-center justify-center w-full h-32 sm:h-40 border-2 border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                      <img
                        src={logoPreview || "/placeholder.svg"}
                        alt="Brand logo preview"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200 shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Brand Name */}
              <div className="space-y-3">
                <Label htmlFor="brand-name" className="text-sm font-semibold text-gray-700">
                  Brand Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="brand-name"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Enter your brand name"
                  className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Brand Email */}
              <div className="space-y-3">
                <Label htmlFor="brand-email" className="text-sm font-semibold text-gray-700">
                  Brand Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="brand-email"
                  type="email"
                  value={brandEmail}
                  onChange={(e) => setBrandEmail(e.target.value)}
                  placeholder="Enter your brand email address"
                  className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-3">
                <Label htmlFor="terms-conditions" className="text-sm font-semibold text-gray-700">
                  Terms and Conditions <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="terms-conditions"
                  value={termsConditions}
                  onChange={(e) => setTermsConditions(e.target.value)}
                  placeholder="Enter terms and conditions for your brand..."
                  className="min-h-[120px] sm:min-h-[150px] text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                  required
                />
                <p className="text-xs text-gray-500">
                  Provide clear terms and conditions that will apply to your brand offers
                </p>
              </div>
            </CardContent>
            
            <CardFooter className="px-6 sm:px-8 pt-6">
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Registering Brand...
                  </div>
                ) : (
                  "Register Brand"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default BrandRegister
