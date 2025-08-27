import { type NextRequest, NextResponse } from "next/server"
import { DataService } from "@/lib/data-service"
import type { JobPosting } from "@/lib/types"

// POST /api/admin/bulk - Bulk operations for admin
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, jobIds, status, data } = body

    if (!action) {
      return NextResponse.json({ success: false, error: "Action is required" }, { status: 400 })
    }

    switch (action) {
      case "updateStatus":
        if (!jobIds || !Array.isArray(jobIds) || !status) {
          return NextResponse.json(
            { success: false, error: "jobIds array and status are required for updateStatus" },
            { status: 400 },
          )
        }

        const validStatuses = ["Open", "Closed", "Yet to Open"]
        if (!validStatuses.includes(status)) {
          return NextResponse.json(
            { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
            { status: 400 },
          )
        }

        const updatedCount = DataService.bulkUpdateStatus(jobIds, status as JobPosting["status"])

        return NextResponse.json({
          success: true,
          message: `Updated ${updatedCount} jobs`,
          updatedCount,
        })

      case "export":
        const exportData = DataService.exportData()

        return NextResponse.json({
          success: true,
          data: exportData,
          filename: `apm-jobs-export-${new Date().toISOString().split("T")[0]}.json`,
        })

      case "import":
        if (!data) {
          return NextResponse.json({ success: false, error: "Data is required for import" }, { status: 400 })
        }

        const importSuccess = DataService.importData(JSON.stringify(data))

        if (!importSuccess) {
          return NextResponse.json({ success: false, error: "Failed to import data. Invalid format." }, { status: 400 })
        }

        return NextResponse.json({
          success: true,
          message: "Data imported successfully",
        })

      default:
        return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error in bulk operation:", error)
    return NextResponse.json({ success: false, error: "Failed to perform bulk operation" }, { status: 500 })
  }
}
