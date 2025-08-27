"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataService } from "@/lib/data-service"
import type { JobPosting } from "@/lib/types"
import { Plus, Search, Edit, Trash2, Eye, MousePointer, Filter } from "lucide-react"

export default function JobsManagement() {
  const [jobs, setJobs] = useState<JobPosting[]>([])
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null)
  const [newJob, setNewJob] = useState({
    company: "",
    companyLogo: "",
    role: "",
    location: "",
    season: "",
    status: "Yet to Open" as JobPosting["status"],
    applicationLink: "",
  })

  useEffect(() => {
    loadJobs()
  }, [])

  useEffect(() => {
    filterJobs()
  }, [jobs, searchTerm, statusFilter])

  const loadJobs = () => {
    const allJobs = DataService.getAllJobs()
    setJobs(allJobs)
  }

  const filterJobs = () => {
    let filtered = jobs

    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((job) => job.status === statusFilter)
    }

    setFilteredJobs(filtered)
  }

  const handleCreateJob = () => {
    if (!newJob.company || !newJob.role || !newJob.applicationLink) {
      alert("Please fill in all required fields")
      return
    }

    DataService.createJob(newJob)
    loadJobs()
    setIsCreateModalOpen(false)
    setNewJob({
      company: "",
      companyLogo: "",
      role: "",
      location: "",
      season: "",
      status: "Yet to Open",
      applicationLink: "",
    })
  }

  const handleUpdateJob = (job: JobPosting) => {
    DataService.updateJob(job.id, job)
    loadJobs()
    setEditingJob(null)
  }

  const handleDeleteJob = (jobId: string) => {
    if (confirm("Are you sure you want to delete this job?")) {
      DataService.deleteJob(jobId)
      loadJobs()
    }
  }

  const getStatusColor = (status: JobPosting["status"]) => {
    switch (status) {
      case "Open":
        return "bg-green-100 text-green-800"
      case "Closed":
        return "bg-red-100 text-red-800"
      case "Yet to Open":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Management</h1>
          <p className="text-gray-600 mt-2">Create, edit, and manage APM job postings</p>
        </div>

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add New Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Job</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  value={newJob.company}
                  onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                  placeholder="Company name"
                />
              </div>
              <div>
                <Label htmlFor="companyLogo">Company Logo URL</Label>
                <Input
                  id="companyLogo"
                  value={newJob.companyLogo}
                  onChange={(e) => setNewJob({ ...newJob, companyLogo: e.target.value })}
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div>
                <Label htmlFor="role">Role *</Label>
                <Input
                  id="role"
                  value={newJob.role}
                  onChange={(e) => setNewJob({ ...newJob, role: e.target.value })}
                  placeholder="Associate Product Manager"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newJob.location}
                  onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  placeholder="San Francisco, CA"
                />
              </div>
              <div>
                <Label htmlFor="season">Season</Label>
                <Input
                  id="season"
                  value={newJob.season}
                  onChange={(e) => setNewJob({ ...newJob, season: e.target.value })}
                  placeholder="Summer 2024"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newJob.status}
                  onValueChange={(value) => setNewJob({ ...newJob, status: value as JobPosting["status"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                    <SelectItem value="Yet to Open">Yet to Open</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="applicationLink">Application Link *</Label>
                <Input
                  id="applicationLink"
                  value={newJob.applicationLink}
                  onChange={(e) => setNewJob({ ...newJob, applicationLink: e.target.value })}
                  placeholder="https://company.com/apply"
                />
              </div>
              <Button onClick={handleCreateJob} className="w-full">
                Create Job
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                  <SelectItem value="Yet to Open">Yet to Open</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Card key={job.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={job.companyLogo || "/placeholder.svg"}
                    alt={job.company}
                    className="w-12 h-12 rounded object-contain"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{job.role}</h3>
                    <p className="text-gray-600">{job.company}</p>
                    {job.location && (
                      <p className="text-sm text-gray-500">
                        {job.location} • {job.season}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{job.analytics.views} views</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MousePointer className="w-3 h-3" />
                        <span>{job.analytics.clicks} clicks</span>
                      </div>
                      <span>Added {DataService.getDaysAdded(job.createdAt)} days ago</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                  <Button variant="outline" size="sm" onClick={() => setEditingJob(job)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteJob(job.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Job Modal */}
      {editingJob && (
        <Dialog open={!!editingJob} onOpenChange={() => setEditingJob(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Job</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-company">Company</Label>
                <Input
                  id="edit-company"
                  value={editingJob.company}
                  onChange={(e) => setEditingJob({ ...editingJob, company: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-companyLogo">Company Logo URL</Label>
                <Input
                  id="edit-companyLogo"
                  value={editingJob.companyLogo || ""}
                  onChange={(e) => setEditingJob({ ...editingJob, companyLogo: e.target.value })}
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div>
                <Label htmlFor="edit-role">Role</Label>
                <Input
                  id="edit-role"
                  value={editingJob.role}
                  onChange={(e) => setEditingJob({ ...editingJob, role: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={editingJob.location || ""}
                  onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
                  placeholder="San Francisco, CA"
                />
              </div>
              <div>
                <Label htmlFor="edit-season">Season</Label>
                <Input
                  id="edit-season"
                  value={editingJob.season || ""}
                  onChange={(e) => setEditingJob({ ...editingJob, season: e.target.value })}
                  placeholder="Summer 2024"
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editingJob.status}
                  onValueChange={(value) => setEditingJob({ ...editingJob, status: value as JobPosting["status"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                    <SelectItem value="Yet to Open">Yet to Open</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-applicationLink">Application Link</Label>
                <Input
                  id="edit-applicationLink"
                  value={editingJob.applicationLink}
                  onChange={(e) => setEditingJob({ ...editingJob, applicationLink: e.target.value })}
                  placeholder="https://company.com/apply"
                />
              </div>
              <Button onClick={() => handleUpdateJob(editingJob)} className="w-full">
                Update Job
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
