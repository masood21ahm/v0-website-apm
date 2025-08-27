export interface JobPosting {
  id: string
  company: string
  companyLogo: string
  role: string
  location?: string
  season?: string
  status: "Open" | "Closed" | "Yet to Open"
  applicationLink: string
  createdAt: Date
  updatedAt: Date
  analytics: {
    views: number
    clicks: number
  }
}

export interface JobAnalytics {
  id: string
  jobId: string
  views: number
  clicks: number
  lastUpdated: Date
}

export interface AdminUser {
  id: string
  email: string
  role: "admin" | "editor"
  createdAt: Date
}

export interface AnalyticsEvent {
  id: string
  jobId: string
  eventType: "view" | "click"
  timestamp: string
  userAgent: string
  referrer: string
}

export interface AdminSettings {
  id: string
  autoApproveJobs: boolean
  emailNotifications: boolean
  analyticsRetentionDays: number
  createdAt: Date
  updatedAt: Date
}

export interface JobFilters {
  status?: JobPosting["status"][]
  companies?: string[]
  locations?: string[]
  seasons?: string[]
  searchTerm?: string
}

export interface DashboardStats {
  totalJobs: number
  openJobs: number
  closedJobs: number
  yetToOpenJobs: number
  totalViews: number
  totalClicks: number
  topCompanies: Array<{
    company: string
    jobCount: number
    totalViews: number
    totalClicks: number
  }>
  recentActivity: Array<{
    type: "job_created" | "job_updated" | "job_deleted"
    jobId: string
    jobTitle: string
    company: string
    timestamp: Date
  }>
}
