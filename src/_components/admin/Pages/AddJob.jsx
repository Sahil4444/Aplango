"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Loader2, ArrowLeft } from "lucide-react"
import { firestore } from "../../../../Database/Firebase" // Adjust the import path as needed
import { collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from "firebase/firestore"
import { toast } from "react-toastify"

function AddJob() {
  const [formData, setFormData] = useState({
    jobTitle: "",
    description: "",
    location: "",
    employmentType: "",
    experience: "",
    status: "Draft",
  })
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({ show: false, type: "", message: "" })
  const [errors, setErrors] = useState({})

  const navigate = useNavigate()

  // Generate next sequential job ID
  const generateJobId = async () => {
    try {
      const careersCollection = collection(firestore, "careers")
      const q = query(careersCollection, orderBy("jobIdNumber", "desc"), limit(1))
      const querySnapshot = await getDocs(q)

      let nextJobIdNumber = 1

      if (!querySnapshot.empty) {
        const lastDoc = querySnapshot.docs[0]
        const lastJobIdNumber = lastDoc.data().jobIdNumber || 0
        nextJobIdNumber = lastJobIdNumber + 1
      }

      // Format as 3-digit string (001, 002, etc.)
      const jobId = nextJobIdNumber.toString().padStart(3, "0")
      return { jobId, jobIdNumber: nextJobIdNumber }
    } catch (error) {
      console.error("Error generating job ID:", error)
      throw new Error("Failed to generate job ID")
    }
  }

  // Validate form data
  const validateForm = () => {
    const newErrors = {}

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = "Job title is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Job description is required"
    } else if (formData.description.trim().length < 50) {
      newErrors.description = "Description should be at least 50 characters"
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required"
    }

    if (!formData.employmentType) {
      newErrors.employmentType = "Employment type is required"
    }

    if (!formData.experience) {
      newErrors.experience = "Experience level is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      setAlert({
        show: true,
        type: "error",
        message: "Please fix the errors below and try again.",
      })
      return
    }

    setLoading(true)
    setAlert({ show: false, type: "", message: "" })

    try {
      // Generate sequential job ID
      const { jobId, jobIdNumber } = await generateJobId()

      // Prepare data for Firestore
      const jobData = {
        jobId,
        jobIdNumber,
        jobTitle: formData.jobTitle.trim(),
        jobRole: formData.jobTitle.trim(), // For compatibility with Career.jsx
        description: formData.description.trim(),
        location: formData.location.trim(),
        employmentType: formData.employmentType,
        experience: formData.experience,
        status: formData.status,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      // Add to Firestore
      const careersCollection = collection(firestore, "careers")
      const docRef = await addDoc(careersCollection, jobData)

      // Success feedback
      toast.success(`Job posted successfully! Job ID: ${jobId}`)
      setAlert({
        show: true,
        type: "success",
        message: `Job "${formData.jobTitle}" has been posted successfully with ID: ${jobId}`,
      })

      // Reset form
      setFormData({
        jobTitle: "",
        description: "",
        location: "",
        employmentType: "",
        experience: "",
        status: "Draft",
      })

      // Navigate back after a delay
      setTimeout(() => {
        navigate("/admin/careers") // Adjust path as needed
      }, 2000)
    } catch (error) {
      console.error("Error adding job:", error)
      toast.error("Failed to post job. Please try again.")
      setAlert({
        show: true,
        type: "error",
        message: "Failed to post job: " + error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle back navigation
  const handleBack = () => {
    navigate("/admin/careers") // Adjust path as needed
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={handleBack} className="mb-4 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Careers
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Post New <span className="text-indigo-600">Job</span>
            </h1>
            <p className="mt-2 text-gray-600">Create a new job posting to attract top talent</p>
          </div>
        </div>

        {/* Alert */}
        {alert.show && (
          <Alert variant={alert.type === "error" ? "destructive" : "default"} className="mb-6">
            {alert.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
            <AlertTitle>{alert.type === "error" ? "Error" : "Success"}</AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}

        {/* Form Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>Fill in the information below to create a new job posting</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Title */}
              <div className="space-y-2">
                <Label htmlFor="jobTitle" className="text-sm font-medium">
                  Job Title *
                </Label>
                <Input
                  id="jobTitle"
                  type="text"
                  placeholder="e.g., Senior Software Engineer"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                  className={errors.jobTitle ? "border-red-500" : ""}
                />
                {errors.jobTitle && <p className="text-sm text-red-500">{errors.jobTitle}</p>}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium">
                  Location *
                </Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="e.g., New York, NY / Remote"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className={errors.location ? "border-red-500" : ""}
                />
                {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
              </div>

              {/* Employment Type and Experience - Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employmentType" className="text-sm font-medium">
                    Employment Type *
                  </Label>
                  <Select
                    value={formData.employmentType}
                    onValueChange={(value) => handleInputChange("employmentType", value)}
                  >
                    <SelectTrigger className={errors.employmentType ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Freelance">Freelance</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.employmentType && <p className="text-sm text-red-500">{errors.employmentType}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-sm font-medium">
                    Experience Level *
                  </Label>
                  <Select value={formData.experience} onValueChange={(value) => handleInputChange("experience", value)}>
                    <SelectTrigger className={errors.experience ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Entry Level">Entry Level (0-1 years)</SelectItem>
                      <SelectItem value="Junior">Junior (1-3 years)</SelectItem>
                      <SelectItem value="Mid Level">Mid Level (3-5 years)</SelectItem>
                      <SelectItem value="Senior">Senior (5-8 years)</SelectItem>
                      <SelectItem value="Lead">Lead (8+ years)</SelectItem>
                      <SelectItem value="Executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.experience && <p className="text-sm text-red-500">{errors.experience}</p>}
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  Status
                </Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">Draft jobs won't be visible to applicants</p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Job Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the role, responsibilities, requirements, and benefits..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className={`min-h-[200px] ${errors.description ? "border-red-500" : ""}`}
                />
                <div className="flex justify-between items-center">
                  {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                  <p className="text-xs text-gray-500 ml-auto">{formData.description.length} characters (minimum 50)</p>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <Button type="button" variant="outline" onClick={handleBack} className="flex-1" disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Posting Job...
                    </>
                  ) : (
                    "Post Job"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-800">Job ID Assignment</h3>
                <p className="text-sm text-blue-700 mt-1">
                  A unique 3-digit job ID will be automatically assigned to this posting (e.g., 001, 002, 003). This ID
                  will be used for tracking and reference purposes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AddJob
