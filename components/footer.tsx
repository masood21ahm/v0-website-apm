"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      console.log("Subscribing email:", email)
      setIsSubscribed(true)
      setEmail("")
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  return (
    <footer className="bg-emerald-500 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left side - Important Links */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold mb-4">Important Links</h3>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 text-sm">
              <a href="/about" className="hover:underline">
                About Us
              </a>
              <span>|</span>
              <a href="/contact" className="hover:underline">
                Contact Us
              </a>
              <span>|</span>
              <a href="/terms" className="hover:underline">
                Terms and Conditions
              </a>
              <span>|</span>
              <a href="/privacy" className="hover:underline">
                Privacy Policy
              </a>
              <span>|</span>
              <a href="/refund" className="hover:underline">
                Refund Policy
              </a>
            </div>
          </div>

          {/* Right side - Subscription Box */}
          <div className="flex justify-center md:justify-end">
            <div className="bg-white text-gray-800 p-6 rounded-lg max-w-sm w-full">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-orange-500">📧</span>
                <p className="text-sm font-medium">Get notified as soon as new APM roles go live.</p>
              </div>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 text-sm"
                  required
                />
                <Button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 text-sm"
                  disabled={isSubscribed}
                >
                  {isSubscribed ? "Subscribed!" : "Subscribe"}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom section - Description and Copyright */}
        <div className="mt-12 text-center space-y-4">
          <p className="text-sm leading-relaxed max-w-4xl mx-auto">
            APM Career is the #1 platform to explore the best 2025-2026 APM jobs, APM internships, and rotational APM
            programs at top tech companies. Discover a complete APM list of opportunities to kickstart your product
            management career.
          </p>
          <p className="text-sm">© 2025 APM Career • Built with ♡ for PMs by PMs</p>
        </div>
      </div>
    </footer>
  )
}
