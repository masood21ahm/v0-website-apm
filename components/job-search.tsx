import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function JobSearch() {
  return (
    <div className="flex gap-2 max-w-md">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input placeholder="Get notified when a new APM role drops" className="pl-10 bg-white" />
      </div>
      <Button className="bg-emerald-600 hover:bg-emerald-700">Subscribe</Button>
    </div>
  )
}
