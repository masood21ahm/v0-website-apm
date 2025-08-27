import { Button } from "@/components/ui/button"

export function JobFilters() {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Button variant="default" size="sm" className="bg-emerald-500 hover:bg-emerald-600">
            Find APM Roles
          </Button>
          <Button variant="outline" size="sm">
            Internship
          </Button>
          <Button variant="outline" size="sm">
            New
          </Button>
          <Button variant="outline" size="sm">
            Non-Tech
          </Button>
        </div>
        <div className="text-sm text-gray-500">Last Updated: 10/2/2025</div>
      </div>
    </div>
  )
}
