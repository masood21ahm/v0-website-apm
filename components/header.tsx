"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AuthModal } from "@/components/auth-modal"

export function Header() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")

  const handleAuthClick = (mode: "login" | "signup") => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  return (
    <>
      <header className="bg-emerald-500 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold">APM Career</h1>
              <span className="text-white/80">🚀</span>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="hover:text-white/80 transition-colors">
                Browse Reviews
              </a>
              <a href="#" className="hover:text-white/80 transition-colors">
                Upgrade to Premium
              </a>
            </nav>

            <div className="flex items-center space-x-3">
              <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => handleAuthClick("login")}>
                Login
              </Button>
              <Button
                variant="secondary"
                className="bg-white text-emerald-500 hover:bg-white/90"
                onClick={() => handleAuthClick("signup")}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  )
}
