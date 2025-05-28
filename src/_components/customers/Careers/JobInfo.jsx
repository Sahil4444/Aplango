"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Navbar from "../Navbar/Navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { ArrowLeft, MapPin, Briefcase, Clock, Calendar, Mail, Copy, CheckCircle, Loader2, Share2 } from "lucide-react"
import { firestore } from "../../../../Database/Firebase" // Adjust the import path as needed
import { doc, getDoc } from "firebase/firestore"

function JobInfo() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [applyDialogOpen, setApplyDialogOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  // Format Firestore timestamp to readable date
  const formatDate = (timestamp) => {
    if (!timestamp) return "Recently posted"

    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      return "Recently posted"
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
          const data = jobSnapshot.data()
          setJob({
            id: jobSnapshot.id,
            jobId: data.jobId || jobSnapshot.id.substring(0, 8).toUpperCase(),
            title: data.jobTitle || data.jobRole,
            description: data.description || "",
            location: data.location || "Not specified",
            employmentType: data.employmentType || "Full-time",
            experience: data.experience || "Not specified",
            status: data.status || "Active",
            createdAt: data.createdAt,
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

  // Copy email to clipboard
  const copyEmail = () => {
    navigator.clipboard.writeText("aplango940@gmail.com")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Share job
  const shareJob = () => {
    if (navigator.share) {
      navigator.share({
        title: `Job Opening: ${job.title}`,
        text: `Check out this job opportunity: ${job.title} at Aplango`,
        url: window.location.href,
      })
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 mt-10 absolute w-full">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading job details...</p>
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8 mt-10 absolute w-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{error}</h2>
            <p className="text-gray-600 mb-8">
              The job you're looking for might have been removed or is no longer active.
            </p>
            <Button onClick={() => navigate("/careers")} className="bg-indigo-600 hover:bg-indigo-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Careers
            </Button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8 mt-10 absolute w-full">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/careers")}
            className="mb-8 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Careers
          </Button>

          {/* Job Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
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
                <Badge variant="default" className="text-sm px-3 py-1">
                  {job.status}
                </Badge>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md text-sm flex items-center">
                <Briefcase className="h-4 w-4 mr-1" />
                {job.employmentType}
              </div>
              {job.experience && (
                <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md text-sm flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {job.experience}
                </div>
              )}
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm">Job ID: {job.jobId}</div>
            </div>
          </div>

          {/* Job Description */}
          <Card className="mb-8">
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700" onClick={() => setApplyDialogOpen(true)}>
              Apply Now
            </Button>
            <Button variant="outline" className="flex-1" onClick={shareJob}>
              <Share2 className="mr-2 h-4 w-4" />
              Share Job
            </Button>
          </div>

          {/* Related Jobs Section - You can implement this if needed */}
          {/* <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Jobs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Related job cards would go here */}
          {/* </div>
          </div> */}
        </div>

        {/* Application Dialog */}
        <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Apply for {job?.title}</DialogTitle>
              <DialogDescription>
                Job ID: <span className="font-mono font-medium">{job?.jobId}</span>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">How to Apply</h3>
                <p className="text-gray-700 text-sm mb-4">
                  To apply for this position, please send your resume and cover letter to our HR team via email. Make
                  sure to include the job ID in your email subject line.
                </p>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Email Format:</p>
                  <div className="bg-white p-3 rounded border text-sm">
                    <p>
                      <strong>Subject:</strong> Application for {job?.title} - {job?.jobId}
                    </p>
                    <p className="mt-2">
                      <strong>Body:</strong>
                    </p>
                    <p className="mt-1">Dear Hiring Manager,</p>
                    <p className="mt-1">
                      I am writing to apply for the {job?.title} position (Job ID: {job?.jobId}) as advertised on your
                      website.
                    </p>
                    <p className="mt-1">Please find attached my resume and cover letter for your consideration.</p>
                    <p className="mt-1">Thank you for your time and consideration.</p>
                    <p className="mt-1">Sincerely,</p>
                    <p className="mt-1">[Your Name]</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <p className="text-sm font-medium text-gray-700">Send your application to:</p>
                  <div className="flex items-center">
                    <Mail className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="font-medium">aplango940@gmail.com</span>
                  </div>
                </div>
                <Button type="button" size="sm" className="px-3" onClick={copyEmail} disabled={copied}>
                  {copied ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
            <DialogFooter className="sm:justify-start">
              <Button type="button" variant="secondary" onClick={() => setApplyDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}

export default JobInfo
