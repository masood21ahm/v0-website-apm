import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { APMProgramsTable } from "@/components/apm-programs-table"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <APMProgramsTable />
      <Footer />
    </div>
  )
}
