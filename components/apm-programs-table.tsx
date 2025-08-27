"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { DataService } from "@/lib/data-service"
import { useAnalytics } from "@/hooks/use-analytics"
import type { JobPosting } from "@/lib/types"

export function APMProgramsTable() {
  const [programs, setPrograms] = useState<(JobPosting & { daysAdded: number })[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<string>("All")
  const [email, setEmail] = useState("")
  const { trackView, trackClick } = useAnalytics()
  const viewedJobs = useRef(new Set<string>())

  useEffect(() => {
    loadPrograms()
  }, [])

  const loadPrograms = async () => {
    try {
      const jobs = await DataService.getAllJobs()
      const programsWithDays = jobs.map((job) => ({
        ...job,
        daysAdded: DataService.getDaysAdded(job.createdAt),
      }))
      setPrograms(programsWithDays)
    } catch (error) {
      console.error("Failed to load programs:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPrograms = programs.filter((program) => {
    if (activeFilter === "All") return true
    return program.status === activeFilter
  })

  const filterTabs = [
    { label: "All", value: "All" },
    { label: "Open", value: "Open" },
    { label: "Closed", value: "Closed" },
    { label: "Yet to Open", value: "Yet to Open" },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const jobId = entry.target.getAttribute("data-job-id")
            if (jobId && !viewedJobs.current.has(jobId)) {
              viewedJobs.current.add(jobId)
              trackView(jobId)
            }
          }
        })
      },
      { threshold: 0.5 },
    )

    const jobElements = document.querySelectorAll("[data-job-id]")
    jobElements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [programs, trackView])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Open":
        return { variant: "default" as const, className: "bg-emerald-100 text-emerald-700 border-emerald-200" }
      case "Closed":
        return { variant: "destructive" as const, className: "" }
      case "Yet to Open":
        return { variant: "secondary" as const, className: "bg-amber-100 text-amber-700 border-amber-200" }
      default:
        return { variant: "outline" as const, className: "" }
    }
  }

  const getStatusButton = (status: string, program: any) => {
    switch (status) {
      case "Open":
        return (
          <Button
            variant="outline"
            size="sm"
            className="text-emerald-700 border-emerald-300 bg-emerald-100 hover:bg-emerald-100 cursor-default h-6 px-2 text-xs font-bold"
            disabled
          >
            Open →
          </Button>
        )
      case "Closed":
        return (
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 bg-red-50 hover:bg-red-50 cursor-default h-6 px-2 text-xs font-bold"
            disabled
          >
            Closed
          </Button>
        )
      case "Yet to Open":
        return (
          <Button
            variant="outline"
            size="sm"
            className="text-amber-700 border-amber-300 bg-amber-100 hover:bg-amber-100 cursor-default h-6 px-2 text-xs font-bold"
            disabled
          >
            Yet to Open
          </Button>
        )
      default:
        return null
    }
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // Handle subscription logic here
      console.log("Subscribing email:", email)
      setEmail("")
      // You can add actual subscription logic here
    }
  }

  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-start mb-4">
            <div className="w-1 h-8 bg-emerald-500 mr-4 flex-shrink-0"></div>
            <h2 className="text-3xl font-bold text-gray-900">Open APM Programs</h2>
          </div>
          <p className="text-gray-600 mb-6">Below is a list of companies actively hiring associate product managers.</p>

          <div className="flex justify-center mb-6">
            <div className="border-2 border-emerald-200 rounded-lg p-4 bg-white max-w-2xl w-full">
              <h3 className="text-base font-semibold text-gray-900 mb-3 text-center">
                Get email updates when a full-time APM or internship role opens.
              </h3>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 border-gray-300"
                  required
                />
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 whitespace-nowrap"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>

          <p className="text-sm text-gray-500">Modified Date: August 23, 2025</p>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveFilter(tab.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === tab.value
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Mobile Card Layout */}
          <div className="block md:hidden">
            <div className="divide-y divide-gray-200">
              {filteredPrograms.map((program, index) => (
                <div key={program.id} className="p-3 hover:bg-gray-50" data-job-id={program.id}>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <Image
                        src={program.companyLogo || "/placeholder.svg"}
                        alt={`${program.company} logo`}
                        width={40}
                        height={40}
                        unoptimized
                        className="rounded-md object-contain bg-white p-1 border border-gray-100"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 truncate">{program.company}</h3>
                          {(program.location || program.season) && (
                            <div className="text-xs text-gray-500 mt-1">
                              <span className="text-xs">
                                {program.location && program.season
                                  ? `${program.location} - ${program.season}`
                                  : program.location || program.season}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{program.role}</p>
                      <div style={{ fontSize: "10px" }} className="text-gray-400 mb-2">
                        Added {program.daysAdded} days ago
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <div className="flex items-center space-x-2 mb-1">
                            {getStatusButton(program.status, program)}
                          </div>
                          <div style={{ fontSize: "8px" }} className="text-gray-500">
                            {program.analytics.clicks} clicks applied
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tablet and Desktop Table Layout */}
          <div className="hidden md:block overflow-x-auto">
            <div className="flex justify-center">
              <table className="max-w-4xl w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                      Company
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                      Role
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPrograms.map((program, index) => (
                    <tr key={program.id} className="hover:bg-gray-50" data-job-id={program.id}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <Image
                              src={program.companyLogo || "/placeholder.svg"}
                              alt={`${program.company} logo`}
                              width={48}
                              height={48}
                              unoptimized
                              className="rounded-md object-contain bg-white p-2 border border-gray-100"
                            />
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-gray-900">{program.company}</div>
                            {(program.location || program.season) && (
                              <div className="text-sm text-gray-500 mt-1">
                                <span className="text-xs">
                                  {program.location && program.season
                                    ? `${program.location} - ${program.season}`
                                    : program.location || program.season}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900 font-medium mb-1">{program.role}</div>
                        <div style={{ fontSize: "10px" }} className="text-gray-400">
                          Added {program.daysAdded} days ago
                        </div>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-col items-center">
                          <div className="flex items-center justify-center mb-1">
                            {getStatusButton(program.status, program)}
                          </div>
                          <div style={{ fontSize: "8px" }} className="text-gray-500 text-center">
                            {program.analytics.clicks} clicks applied
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Any feedback or want to add your company here?</p>
          <p className="text-sm text-gray-500">
            If you have any info or feedback regarding the roles mentioned above, reply to{" "}
            <a href="mailto:contact@apmcareer.com" className="text-emerald-600 hover:underline">
              this email
            </a>
            , and we will try to update them as soon as possible.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            If we missed any APM programs that should be listed,{" "}
            <a href="mailto:info@apmcareer.com" className="text-emerald-600 hover:underline">
              contact us
            </a>{" "}
            and share the information with us.
          </p>
        </div>
      </div>
    </section>
  )
}
