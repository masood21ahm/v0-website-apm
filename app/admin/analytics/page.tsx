"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DataService } from "@/lib/data-service"
import type { JobPosting } from "@/lib/types"
import { TrendingUp, Eye, MousePointer, Award } from "lucide-react"

export default function Analytics() {
  const [analytics, setAnalytics] = useState({
    totalViews: 0,
    totalClicks: 0,
    clickThroughRate: 0,
    topPerformingJobs: [] as (JobPosting & { daysAdded: number; ctr: number })[],
    companyStats: [] as Array<{
      company: string
      jobCount: number
      totalViews: number
      totalClicks: number
      avgCTR: number
    }>,
    recentActivity: [] as any[],
  })

  useEffect(() => {
    const jobs = DataService.getAllJobs()
    const analyticsData = DataService.getAnalyticsData()

    const totalViews = jobs.reduce((sum, job) => sum + job.analytics.views, 0)
    const totalClicks = jobs.reduce((sum, job) => sum + job.analytics.clicks, 0)
    const clickThroughRate = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0

    // Top performing jobs
    const topPerformingJobs = jobs
      .map((job) => ({
        ...job,
        daysAdded: DataService.getDaysAdded(job.createdAt),
        ctr: job.analytics.views > 0 ? (job.analytics.clicks / job.analytics.views) * 100 : 0,
      }))
      .sort((a, b) => b.analytics.views - a.analytics.views)
      .slice(0, 10)

    // Company statistics
    const companyStats = jobs
      .reduce((acc: any[], job) => {
        const existing = acc.find((item) => item.company === job.company)
        if (existing) {
          existing.jobCount++
          existing.totalViews += job.analytics.views
          existing.totalClicks += job.analytics.clicks
        } else {
          acc.push({
            company: job.company,
            jobCount: 1,
            totalViews: job.analytics.views,
            totalClicks: job.analytics.clicks,
          })
        }
        return acc
      }, [])
      .map((stat) => ({
        ...stat,
        avgCTR: stat.totalViews > 0 ? (stat.totalClicks / stat.totalViews) * 100 : 0,
      }))
      .sort((a, b) => b.totalViews - a.totalViews)

    setAnalytics({
      totalViews,
      totalClicks,
      clickThroughRate,
      topPerformingJobs,
      companyStats,
      recentActivity: analyticsData.slice(-20).reverse(),
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
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">Track job performance and user engagement</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Job listing impressions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalClicks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Application link clicks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click-Through Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.clickThroughRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Average conversion rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Jobs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Top Performing Jobs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.topPerformingJobs.map((job, index) => (
              <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-sm font-bold">
                    #{index + 1}
                  </div>
                  <img
                    src={job.companyLogo || "/placeholder.svg"}
                    alt={job.company}
                    className="w-10 h-10 rounded object-contain"
                  />
                  <div>
                    <h3 className="font-medium">{job.role}</h3>
                    <p className="text-sm text-gray-600">{job.company}</p>
                    <p className="text-xs text-gray-500">{job.daysAdded} days ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{job.analytics.views}</div>
                    <div className="text-xs text-gray-500">Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{job.analytics.clicks}</div>
                    <div className="text-xs text-gray-500">Clicks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{job.ctr.toFixed(1)}%</div>
                    <div className="text-xs text-gray-500">CTR</div>
                  </div>
                  <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Company Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Company Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.companyStats.map((company) => (
              <div key={company.company} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{company.company}</h3>
                  <p className="text-sm text-gray-600">
                    {company.jobCount} job{company.jobCount !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-sm font-bold">{company.totalViews}</div>
                    <div className="text-xs text-gray-500">Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold">{company.totalClicks}</div>
                    <div className="text-xs text-gray-500">Clicks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold">{company.avgCTR.toFixed(1)}%</div>
                    <div className="text-xs text-gray-500">Avg CTR</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
