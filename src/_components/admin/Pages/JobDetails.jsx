"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowLeft, Calendar, MapPin, Briefcase, Clock } from 'lucide-react'
import { firestore } from "../../../../Database/Firebase" // Adjust path as needed
import { doc, getDoc } from "firebase/firestore"

function JobDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Get status badge variant based on status
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "default"
      case "inactive":
        return "secondary"
      case "closed":
        return "destructive"
      case "draft":
        return "outline"
      default:
        return "secondary"
    }
  }

  // Format Firestore timestamp to readable date
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A"

    try {
      // Handle both Firestore Timestamp objects and date strings
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid date"
    }
  }

  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true)
      try {
        const jobDoc = doc(firestore, "careers", id)
        const jobSnapshot = await getDoc(jobDoc)

        if (jobSnapshot.exists()) {
          setJob({
            id: jobSnapshot.id,
            ...jobSnapshot.data(),
          })
        } else {
          setError("Job not found")
        }
      } catch (err) {
        console.error("Error fetching job details:", err)
        setError("Failed to load job details")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchJobDetails()
    }
  }, [id])

  // Handle back navigation
  const handleBack = () => {
    navigate("/admin/careers")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-2 text-gray-600">Loading job details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <Button onClick={handleBack} variant="outline">
            Back to Jobs
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Button variant="ghost" onClick={handleBack} className="mb-6 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Button>

        {job && (
          <>
            {/* Header */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{job.jobTitle || job.jobRole}</h1>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Posted on {formatDate(job.createdAt)}
                    </div>
                    {job.location && (
                      <div className="flex items-center ml-4">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <Badge variant={getStatusVariant(job.status)} className="text-sm px-3 py-1">
                    {job.status || "Active"}
                  </Badge>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md text-sm flex items-center">
                  <Briefcase className="h-4 w-4 mr-1" />
                  {job.employmentType || "Full-time"}
                </div>
                {job.experience && (
                  <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md text-sm flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {job.experience}
                  </div>
                )}
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm">
                  Job ID: {job.jobId || job.id.substring(0, 8).toUpperCase()}
                </div>
              </div>
            </div>

            {/* Job Details */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {job.description ? (
                    <div className="whitespace-pre-wrap">{job.description}</div>
                  ) : (
                    <p className="text-gray-500 italic">No description provided</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Admin Actions */}
            <div className="mt-8 flex gap-4 w-full items-center justify-center">
              <Button variant="outline" className="w-fit" onClick={handleBack}>
                Back to Jobs
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default JobDetails