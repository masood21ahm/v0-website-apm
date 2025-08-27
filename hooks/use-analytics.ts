"use client"

import { useCallback } from "react"

interface AnalyticsEvent {
  jobId: string
  eventType: "view" | "click"
}

export function useAnalytics() {
  const trackEvent = useCallback(async (event: AnalyticsEvent) => {
    try {
      // Track in API
      await fetch("/api/analytics/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      })
    } catch (error) {
      console.error("Failed to track analytics event:", error)
    }
  }, [])

  const trackView = useCallback(
    (jobId: string) => {
      trackEvent({ jobId, eventType: "view" })
    },
    [trackEvent],
  )

  const trackClick = useCallback(
    (jobId: string) => {
      trackEvent({ jobId, eventType: "click" })
    },
    [trackEvent],
  )

  return {
    trackView,
    trackClick,
  }
}
