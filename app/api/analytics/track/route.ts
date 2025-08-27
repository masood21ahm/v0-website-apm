import { type NextRequest, NextResponse } from "next/server"
import { DataService } from "@/lib/data-service"

// POST /api/analytics/track - Track user interactions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { jobId, eventType } = body

    if (!jobId || !eventType) {
      return NextResponse.json({ success: false, error: "jobId and eventType are required" }, { status: 400 })
    }

    if (!["view", "click"].includes(eventType)) {
      return NextResponse.json({ success: false, error: 'eventType must be either "view" or "click"' }, { status: 400 })
    }

    // Check if job exists
    const job = DataService.getJobById(jobId)
    if (!job) {
      return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 })
    }

    // Track the event
    if (eventType === "view") {
      DataService.incrementViews(jobId)
    } else if (eventType === "click") {
      DataService.incrementClicks(jobId)
    }

    return NextResponse.json({
      success: true,
      message: `${eventType} tracked successfully`,
    })
  } catch (error) {
    console.error("Error tracking analytics:", error)
    return NextResponse.json({ success: false, error: "Failed to track analytics" }, { status: 500 })
  }
}
