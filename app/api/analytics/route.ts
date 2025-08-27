import { type NextRequest, NextResponse } from "next/server"
import { DataService } from "@/lib/data-service"

// GET /api/analytics - Get analytics data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get("jobId")
    const eventType = searchParams.get("eventType")

    let analyticsData = DataService.getAnalyticsData()

    // Filter by jobId if provided
    if (jobId) {
      analyticsData = analyticsData.filter((event: any) => event.jobId === jobId)
    }

    // Filter by eventType if provided
    if (eventType && ["view", "click"].includes(eventType)) {
      analyticsData = analyticsData.filter((event: any) => event.eventType === eventType)
    }

    // Get summary statistics
    const jobs = DataService.getAllJobs()
    const summary = {
      totalJobs: jobs.length,
      totalViews: jobs.reduce((sum, job) => sum + job.analytics.views, 0),
      totalClicks: jobs.reduce((sum, job) => sum + job.analytics.clicks, 0),
      openJobs: jobs.filter((job) => job.status === "Open").length,
      closedJobs: jobs.filter((job) => job.status === "Closed").length,
      yetToOpenJobs: jobs.filter((job) => job.status === "Yet to Open").length,
      topCompanies: jobs
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
        .sort((a, b) => b.totalViews - a.totalViews)
        .slice(0, 10),
    }

    return NextResponse.json({
      success: true,
      data: {
        events: analyticsData,
        summary,
      },
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch analytics" }, { status: 500 })
  }
}
