import type { JobPosting } from "./types"
import jobsData from "../data/jobs.json"

export class DataService {
  private static readonly STORAGE_KEY = "apm_jobs_data"
  private static readonly ANALYTICS_KEY = "apm_analytics_data"

  private static loadJobsFromStorage(): JobPosting[] {
    if (typeof window === "undefined") return []

    const stored = localStorage.getItem(this.STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return parsed.map((job: any) => ({
        ...job,
        createdAt: new Date(job.createdAt),
        updatedAt: new Date(job.updatedAt),
      }))
    }

    // Initialize with default data if no stored data exists
    const initialJobs = jobsData.map((job) => ({
      ...job,
      createdAt: new Date(job.createdAt),
      updatedAt: new Date(job.updatedAt),
    }))

    this.saveJobsToStorage(initialJobs)
    return initialJobs
  }

  private static saveJobsToStorage(jobs: JobPosting[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(jobs))
  }

  private static get jobs(): JobPosting[] {
    return this.loadJobsFromStorage()
  }

  static getAllJobs(): JobPosting[] {
    return this.jobs
  }

  static getJobById(id: string): JobPosting | undefined {
    return this.jobs.find((job) => job.id === id)
  }

  static createJob(jobData: Omit<JobPosting, "id" | "createdAt" | "updatedAt" | "analytics">): JobPosting {
    const jobs = this.jobs
    const newJob: JobPosting = {
      ...jobData,
      id: `${jobData.company.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      analytics: {
        views: 0,
        clicks: 0,
      },
    }

    jobs.push(newJob)
    this.saveJobsToStorage(jobs)
    return newJob
  }

  static updateJob(id: string, updates: Partial<JobPosting>): JobPosting | null {
    const jobs = this.jobs
    const jobIndex = jobs.findIndex((job) => job.id === id)
    if (jobIndex === -1) return null

    jobs[jobIndex] = {
      ...jobs[jobIndex],
      ...updates,
      updatedAt: new Date(),
    }

    this.saveJobsToStorage(jobs)
    return jobs[jobIndex]
  }

  static deleteJob(id: string): boolean {
    const jobs = this.jobs
    const jobIndex = jobs.findIndex((job) => job.id === id)
    if (jobIndex === -1) return false

    jobs.splice(jobIndex, 1)
    this.saveJobsToStorage(jobs)
    return true
  }

  static incrementViews(id: string): void {
    const jobs = this.jobs
    const job = jobs.find((job) => job.id === id)
    if (job) {
      job.analytics.views++
      job.updatedAt = new Date()
      this.saveJobsToStorage(jobs)
      this.trackAnalyticsEvent(id, "view")
    }
  }

  static incrementClicks(id: string): void {
    const jobs = this.jobs
    const job = jobs.find((job) => job.id === id)
    if (job) {
      job.analytics.clicks++
      job.updatedAt = new Date()
      this.saveJobsToStorage(jobs)
      this.trackAnalyticsEvent(id, "click")
    }
  }

  private static trackAnalyticsEvent(jobId: string, eventType: "view" | "click"): void {
    if (typeof window === "undefined") return

    const analyticsData = JSON.parse(localStorage.getItem(this.ANALYTICS_KEY) || "[]")
    const event = {
      id: `${jobId}-${eventType}-${Date.now()}`,
      jobId,
      eventType,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
    }

    analyticsData.push(event)
    localStorage.setItem(this.ANALYTICS_KEY, JSON.stringify(analyticsData))
  }

  static getAnalyticsData(): any[] {
    if (typeof window === "undefined") return []
    return JSON.parse(localStorage.getItem(this.ANALYTICS_KEY) || "[]")
  }

  static getDaysAdded(createdAt: Date): number {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - createdAt.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  static bulkUpdateStatus(jobIds: string[], status: JobPosting["status"]): number {
    const jobs = this.jobs
    let updatedCount = 0

    jobs.forEach((job) => {
      if (jobIds.includes(job.id)) {
        job.status = status
        job.updatedAt = new Date()
        updatedCount++
      }
    })

    if (updatedCount > 0) {
      this.saveJobsToStorage(jobs)
    }

    return updatedCount
  }

  static getJobsByStatus(status: JobPosting["status"]): JobPosting[] {
    return this.jobs.filter((job) => job.status === status)
  }

  static getJobsByCompany(company: string): JobPosting[] {
    return this.jobs.filter((job) => job.company.toLowerCase().includes(company.toLowerCase()))
  }

  static exportData(): string {
    return JSON.stringify(
      {
        jobs: this.jobs,
        analytics: this.getAnalyticsData(),
        exportedAt: new Date().toISOString(),
      },
      null,
      2,
    )
  }

  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData)
      if (data.jobs && Array.isArray(data.jobs)) {
        this.saveJobsToStorage(
          data.jobs.map((job: any) => ({
            ...job,
            createdAt: new Date(job.createdAt),
            updatedAt: new Date(job.updatedAt),
          })),
        )

        if (data.analytics && Array.isArray(data.analytics)) {
          localStorage.setItem(this.ANALYTICS_KEY, JSON.stringify(data.analytics))
        }

        return true
      }
      return false
    } catch (error) {
      console.error("Failed to import data:", error)
      return false
    }
  }
}
