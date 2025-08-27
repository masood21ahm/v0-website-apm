"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DataService } from "@/lib/data-service"
import type { JobPosting } from "@/lib/types"
import { Briefcase, Eye, MousePointer, TrendingUp, Calendar, Building } from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    openJobs: 0,
    closedJobs: 0,
    yetToOpenJobs: 0,
    totalViews: 0,
    totalClicks: 0,
    recentJobs: [] as JobPosting[],
  })

  useEffect(() => {
    const jobs = DataService.getAllJobs()
    const recentJobs = jobs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5)

    setStats({
      totalJobs: jobs.length,
      openJobs: jobs.filter((job) => job.status === "Open").length,
      closedJobs: jobs.filter((job) => job.status === "Closed").length,
      yetToOpenJobs: jobs.filter((job) => job.status === "Yet to Open").length,
      totalViews: jobs.reduce((sum, job) => sum + job.analytics.views, 0),
      totalClicks: jobs.reduce((sum, job) => sum + job.analytics.clicks, 0),
      recentJobs,
    })
  }, [])

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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your APM job postings and track performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalJobs}</div>
            <p className="text-xs text-muted-foreground">Active job postings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews}</div>
            <p className="text-xs text-muted-foreground">Job listing views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClicks}</div>
            <p className="text-xs text-muted-foreground">Application clicks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Jobs</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.openJobs}</div>
            <p className="text-xs text-muted-foreground">Currently accepting applications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed Jobs</CardTitle>
            <Calendar className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.closedJobs}</div>
            <p className="text-xs text-muted-foreground">No longer accepting applications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yet to Open</CardTitle>
            <Building className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.yetToOpenJobs}</div>
            <p className="text-xs text-muted-foreground">Coming soon</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Job Postings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <img
                    src={job.companyLogo || "/placeholder.svg"}
                    alt={job.company}
                    className="w-10 h-10 rounded object-contain"
                  />
                  <div>
                    <h3 className="font-medium">{job.role}</h3>
                    <p className="text-sm text-gray-600">{job.company}</p>
                    {job.location && <p className="text-xs text-gray-500">{job.location}</p>}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Eye className="w-3 h-3" />
                      <span>{job.analytics.views}</span>
                      <MousePointer className="w-3 h-3 ml-2" />
                      <span>{job.analytics.clicks}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{DataService.getDaysAdded(job.createdAt)} days ago</p>
                  </div>
                  <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
