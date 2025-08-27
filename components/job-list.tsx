import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"

const jobs = [
  {
    id: 1,
    company: "Buildkite",
    logo: "/buildkite-logo.png",
    position: "Product Strategy Associate",
    type: "Open",
    status: "available",
    applied: false,
  },
  {
    id: 2,
    company: "ML Learning",
    logo: "/ml-learning-logo.png",
    position: "Associate Product Manager",
    type: "Open",
    status: "available",
    applied: true,
  },
  {
    id: 3,
    company: "Oracle",
    logo: "/oracle-logo-red.png",
    position: "Product Manager",
    type: "Open",
    status: "available",
    applied: true,
  },
  {
    id: 4,
    company: "Meta (Facebook)",
    logo: "/meta-facebook-logo-blue.png",
    position: "Rotational Product Manager",
    type: "Open",
    status: "available",
    applied: true,
  },
  {
    id: 5,
    company: "Airbnb",
    logo: "/airbnb-logo-pink.png",
    position: "Associate Product Manager",
    type: "Open",
    status: "closed",
    applied: false,
  },
  {
    id: 6,
    company: "Databricks",
    logo: "/databricks-logo-orange.png",
    position: "Associate Product Manager",
    type: "Open",
    status: "available",
    applied: true,
  },
  {
    id: 7,
    company: "American Express",
    logo: "/american-express-logo-blue.png",
    position: "Associate Product Manager",
    type: "Open",
    status: "closed",
    applied: false,
  },
  {
    id: 8,
    company: "TikTok",
    logo: "/tiktok-logo-black.png",
    position: "Product Manager",
    type: "Open",
    status: "available",
    applied: true,
  },
  {
    id: 9,
    company: "Spotify",
    logo: "/spotify-logo-green.png",
    position: "Junior Product Manager",
    type: "Not open yet",
    status: "upcoming",
    applied: false,
  },
  {
    id: 10,
    company: "Shopify",
    logo: "/shopify-logo-green.png",
    position: "Associate Product Manager",
    type: "Not open yet",
    status: "upcoming",
    applied: true,
  },
]

export function JobList() {
  return (
    <div className="divide-y divide-gray-200">
      <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-gray-500 bg-gray-50">
        <div className="col-span-4">Company</div>
        <div className="col-span-2">Apply</div>
        <div className="col-span-4">Position</div>
        <div className="col-span-2 text-center">You Applied?</div>
      </div>

      {jobs.map((job) => (
        <div key={job.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors">
          <div className="col-span-4 flex items-center gap-3">
            <img
              src={job.logo || "/placeholder.svg"}
              alt={`${job.company} logo`}
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div>
              <div className="font-medium text-gray-900">{job.company}</div>
              <div className="text-sm text-gray-500">View on company site</div>
            </div>
          </div>

          <div className="col-span-2">
            <Badge
              variant={job.status === "available" ? "default" : job.status === "upcoming" ? "secondary" : "destructive"}
              className={
                job.status === "available"
                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                  : job.status === "upcoming"
                    ? "bg-gray-100 text-gray-700"
                    : "bg-red-100 text-red-700"
              }
            >
              {job.type}
            </Badge>
          </div>

          <div className="col-span-4">
            <div className="font-medium text-gray-900">{job.position}</div>
            <div className="text-sm text-gray-500">View on company site</div>
          </div>

          <div className="col-span-2 flex justify-center">
            {job.applied ? <Check className="h-5 w-5 text-emerald-500" /> : <X className="h-5 w-5 text-red-500" />}
          </div>
        </div>
      ))}
    </div>
  )
}
