"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../Navbar/Navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  MapPin,
  Briefcase,
  Clock,
  Search,
  Users,
  TrendingUp,
  Heart,
  Loader2,
  Mail,
  Copy,
  CheckCircle,
} from "lucide-react"
import { firestore } from "../../../../Database/Firebase" // Adjust the import path as needed
import { collection, getDocs } from "firebase/firestore"

function CareerHome() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [experienceFilter, setExperienceFilter] = useState("all")
  const [applyDialogOpen, setApplyDialogOpen] = useState(false)
  const [resumeDialogOpen, setResumeDialogOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [copied, setCopied] = useState(false)

  // Format Firestore timestamp to readable date
  const formatDate = (timestamp) => {
    if (!timestamp) return "Recently posted"

    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) return "1 day ago"
      if (diffDays < 7) return `${diffDays} days ago`
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
      return `${Math.ceil(diffDays / 30)} months ago`
    } catch (error) {
      return "Recently posted"
    }
  }

  // Fetch jobs from Firestore
  const fetchJobs = async () => {
    setLoading(true)
    try {
      const careersCollection = collection(firestore, "careers")

      // Simple query without orderBy to avoid index requirement
      const querySnapshot = await getDocs(careersCollection)

      console.log("Total jobs in database:", querySnapshot.docs.length)

      const jobsData = querySnapshot.docs
        .map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            jobId: data.jobId || doc.id.substring(0, 8).toUpperCase(),
            title: data.jobTitle || data.jobRole,
            description: data.description || "",
            location: data.location || "Not specified",
            employmentType: data.employmentType || "Full-time",
            experience: data.experience || "Not specified",
            status: data.status || "Active", // Default to Active if no status
            createdAt: data.createdAt,
          }
        })
        .filter((job) => {
          // Only show jobs with Active status (case insensitive)
          const isActive = job.status && job.status.toLowerCase() === "active"
          console.log(`Job "${job.title}" status: "${job.status}", isActive: ${isActive}`)
          return isActive
        })
        .sort((a, b) => {
          // Sort by createdAt if available, otherwise by title
          if (a.createdAt && b.createdAt) {
            try {
              return b.createdAt.toDate() - a.createdAt.toDate()
            } catch (error) {
              return a.title.localeCompare(b.title)
            }
          }
          return a.title.localeCompare(b.title)
        })

      console.log("Filtered active jobs:", jobsData.length)
      setJobs(jobsData)
      setFilteredJobs(jobsData)
    } catch (error) {
      console.error("Error fetching jobs:", error)
      setJobs([])
      setFilteredJobs([])
    } finally {
      setLoading(false)
    }
  }

  // Filter jobs based on search and filters
  useEffect(() => {
    let filtered = jobs

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Location filter
    if (locationFilter !== "all") {
      filtered = filtered.filter((job) => job.location.toLowerCase().includes(locationFilter.toLowerCase()))
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((job) => job.employmentType === typeFilter)
    }

    // Experience filter
    if (experienceFilter !== "all") {
      filtered = filtered.filter((job) => job.experience === experienceFilter)
    }

    setFilteredJobs(filtered)
  }, [jobs, searchTerm, locationFilter, typeFilter, experienceFilter])

  // Get unique values for filters
  const getUniqueLocations = () => {
    const locations = jobs.map((job) => job.location)
    return [...new Set(locations)].filter(Boolean)
  }

  const getUniqueTypes = () => {
    const types = jobs.map((job) => job.employmentType)
    return [...new Set(types)].filter(Boolean)
  }

  const getUniqueExperience = () => {
    const experience = jobs.map((job) => job.experience)
    return [...new Set(experience)].filter(Boolean)
  }

  // Handle job application dialog
  const handleApply = (job) => {
    setSelectedJob(job)
    setApplyDialogOpen(true)
  }

  // Handle general resume submission dialog
  const handleSendResume = () => {
    setResumeDialogOpen(true)
  }

  // Handle read more (navigate to job details)
  const handleReadMore = (job) => {
    navigate(`/careers/${job.id}`)
  }

  // Copy email to clipboard
  const copyEmail = () => {
    navigator.clipboard.writeText("aplango940@gmail.com")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs()
  }, [])

  return (
    <>
      <Navbar />
      <div className="bg-[#fff] lg:px-10 xl:px-10 md:px-10 px-6 py-16 w-full min-h-screen mt-10 absolute">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Join Our <span className="text-indigo-600">Amazing Team</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover exciting career opportunities and be part of something extraordinary. We're looking for passionate
            individuals to help us shape the future.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{jobs.length}+</h3>
              <p className="text-gray-600">Open Positions</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">95%</h3>
              <p className="text-gray-600">Employee Satisfaction</p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">4.8/5</h3>
              <p className="text-gray-600">Company Rating</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Location Filter */}
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {getUniqueLocations().map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {getUniqueTypes().map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Experience Filter */}
            <Select value={experienceFilter} onValueChange={setExperienceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Experience</SelectItem>
                {getUniqueExperience().map((exp) => (
                  <SelectItem key={exp} value={exp}>
                    {exp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            {loading ? "Loading jobs..." : `Showing ${filteredJobs.length} of ${jobs.length} positions`}
          </div>
        </div>

        {/* Job Cards */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading amazing opportunities...</p>
            </div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || locationFilter !== "all" || typeFilter !== "all" || experienceFilter !== "all"
                ? "Try adjusting your search criteria"
                : "We don't have any open positions at the moment. Check back soon!"}
            </p>
            {(searchTerm || locationFilter !== "all" || typeFilter !== "all" || experienceFilter !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setLocationFilter("all")
                  setTypeFilter("all")
                  setExperienceFilter("all")
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.map((job) => (
              <Card
                key={job.id}
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg"
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {job.jobId}
                    </Badge>
                    <span className="text-xs text-gray-500">{formatDate(job.createdAt)}</span>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 leading-tight">{job.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* Job Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">{job.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">{job.employmentType}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">{job.experience}</span>
                    </div>
                  </div>

                  {/* Description Preview */}
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                    {job.description.length > 120 ? `${job.description.substring(0, 120)}...` : job.description}
                  </p>

                  {/* Action Buttons - Updated to have two full buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700" onClick={() => handleApply(job)}>
                      Apply Now
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => handleReadMore(job)}>
                      Read More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Call to Action */}
        {!loading && filteredJobs.length > 0 && (
          <div className="text-center mt-16 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Don't see the perfect role?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              We're always looking for talented individuals. Send us your resume and we'll keep you in mind for future
              opportunities.
            </p>
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700" onClick={handleSendResume}>
              Send Your Resume
            </Button>
          </div>
        )}

        {/* Job Application Dialog */}
        <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
          <DialogContent className="sm:max-w-md max-h-[92vh] overflow-y-auto px-10 pb-2">
            <DialogHeader className="sticky top-0 bg-white z-10 pb-2">
              <DialogTitle className="text-xl">Apply for {selectedJob?.title}</DialogTitle>
              <DialogDescription>
                Job ID: <span className="font-mono font-medium">{selectedJob?.jobId}</span>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-1">
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
                      <strong>Subject:</strong> Application for {selectedJob?.title} - {selectedJob?.jobId}
                    </p>
                    <p className="mt-2">
                      <strong>Body:</strong>
                    </p>
                    <p className="mt-1">Dear Hiring Manager,</p>
                    <p className="mt-1">
                      I am writing to apply for the {selectedJob?.title} position (Job ID: {selectedJob?.jobId}) as
                      advertised on your website.
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
            <DialogFooter className="sticky bottom-0 bg-white z-10 pt-2">
              <Button type="button" variant="secondary" onClick={() => setApplyDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* General Resume Submission Dialog */}
        <Dialog open={resumeDialogOpen} onOpenChange={setResumeDialogOpen}>
          <DialogContent className="sm:max-w-md max-h-[91vh] overflow-y-auto px-10 py-0">
            <DialogHeader className="sticky top-0 bg-white z-10 py-2">
              <DialogTitle className="text-xl">Send Your Resume</DialogTitle>
              <DialogDescription>Submit your resume for future opportunities</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-1">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">How to Submit Your Resume</h3>
                <p className="text-gray-700 text-sm mb-4">
                  Send us your resume and we'll keep you in mind for future opportunities that match your skills and
                  interests. Please mention your preferred position or area of interest in your email.
                </p>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Email Format:</p>
                  <div className="bg-white p-3 rounded border text-sm">
                    <p>
                      <strong>Subject:</strong> Resume Submission - [Your Preferred Position/Field]
                    </p>
                    <p className="mt-2">
                      <strong>Body:</strong>
                    </p>
                    <p className="mt-1">Dear Hiring Manager,</p>
                    <p className="mt-1">
                      I am interested in joining your team and would like to submit my resume for your consideration.
                    </p>
                    <p className="mt-1">
                      I am particularly interested in [mention your preferred role/department/field according to your
                      skills and interests].
                    </p>
                    <p className="mt-1">
                      Please find attached my resume. I would welcome the opportunity to discuss how my skills and
                      experience can contribute to your organization.
                    </p>
                    <p className="mt-1">Thank you for your time and consideration.</p>
                    <p className="mt-1">Sincerely,</p>
                    <p className="mt-1">[Your Name]</p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> Be specific about your interests! Mention areas like Software Development,
                    Marketing, Sales, Design, Operations, or any other field you're passionate about.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <p className="text-sm font-medium text-gray-700">Send your resume to:</p>
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
            <DialogFooter className="sticky bottom-0 bg-white z-10 py-2">
              <Button type="button" variant="secondary" onClick={() => setResumeDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}

export default CareerHome
