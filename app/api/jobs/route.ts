import { type NextRequest, NextResponse } from "next/server"
import { DataService } from "@/lib/data-service"
import type { JobPosting } from "@/lib/types"

// GET /api/jobs - Get all jobs with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") as JobPosting["status"] | null
    const company = searchParams.get("company")
    const search = searchParams.get("search")

    let jobs = DataService.getAllJobs()

    // Apply filters
    if (status) {
      jobs = jobs.filter((job) => job.status === status)
    }

    if (company) {
      jobs = jobs.filter((job) => job.company.toLowerCase().includes(company.toLowerCase()))
    }

    if (search) {
      jobs = jobs.filter(
        (job) =>
          job.role.toLowerCase().includes(search.toLowerCase()) ||
          job.company.toLowerCase().includes(search.toLowerCase()) ||
          job.location?.toLowerCase().includes(search.toLowerCase()),
      )
    }

    // Add computed fields
    const jobsWithDays = jobs.map((job) => ({
      ...job,
      daysAdded: DataService.getDaysAdded(job.createdAt),
    }))

    return NextResponse.json({
      success: true,
      data: jobsWithDays,
      count: jobsWithDays.length,
    })
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch jobs" }, { status: 500 })
  }
}

// POST /api/jobs - Create a new job
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["company", "companyLogo", "role", "status", "applicationLink"]
    const missingFields = requiredFields.filter((field) => !body[field])

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 },
      )
    }

    // Validate status
    const validStatuses = ["Open", "Closed", "Yet to Open"]
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        },
        { status: 400 },
      )
    }

    const newJob = DataService.createJob({
      company: body.company,
      companyLogo: body.companyLogo,
      role: body.role,
      location: body.location,
      season: body.season,
      status: body.status,
      applicationLink: body.applicationLink,
    })

    return NextResponse.json(
      {
        success: true,
        data: {
          ...newJob,
          daysAdded: DataService.getDaysAdded(newJob.createdAt),
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating job:", error)
    return NextResponse.json({ success: false, error: "Failed to create job" }, { status: 500 })
  }
}
