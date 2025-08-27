import { type NextRequest, NextResponse } from "next/server"
import { DataService } from "@/lib/data-service"

// GET /api/jobs/[id] - Get a specific job by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const job = DataService.getJobById(params.id)

    if (!job) {
      return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        ...job,
        daysAdded: DataService.getDaysAdded(job.createdAt),
      },
    })
  } catch (error) {
    console.error("Error fetching job:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch job" }, { status: 500 })
  }
}

// PUT /api/jobs/[id] - Update a specific job
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // Validate status if provided
    if (body.status) {
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
    }

    const updatedJob = DataService.updateJob(params.id, body)

    if (!updatedJob) {
      return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        ...updatedJob,
        daysAdded: DataService.getDaysAdded(updatedJob.createdAt),
      },
    })
  } catch (error) {
    console.error("Error updating job:", error)
    return NextResponse.json({ success: false, error: "Failed to update job" }, { status: 500 })
  }
}

// DELETE /api/jobs/[id] - Delete a specific job
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = DataService.deleteJob(params.id)

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Job deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting job:", error)
    return NextResponse.json({ success: false, error: "Failed to delete job" }, { status: 500 })
  }
}
