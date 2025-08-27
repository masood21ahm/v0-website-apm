import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function HeroSection() {
  return (
    <section className="bg-emerald-500 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <Badge className="bg-white/20 text-white mb-4">🎯 Dream APM job awaiting</Badge>

        <h1 className="text-5xl font-bold mb-6 max-w-4xl mx-auto">Associate Product Manager (APM) Career Platform</h1>

        <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
          An entry-level role in product management that allows professionals to gain experience and train to become
          future leaders.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button size="lg" className="bg-white text-emerald-500 hover:bg-white/90 px-8">
            Browse Reviews
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 bg-transparent">
            Upgrade to Premium
          </Button>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold mb-4">Your APM Career Roadmap:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="flex items-start space-x-2">
              <span className="text-emerald-200">📚</span>
              <div>
                <p className="font-medium">Internships or projects</p>
                <p className="text-sm text-white/80">Build your product management experience</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-emerald-200">📝</span>
              <div>
                <p className="font-medium">Craft your APM resume</p>
                <p className="text-sm text-white/80">Stand out with compelling achievements</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-emerald-200">🎯</span>
              <div>
                <p className="font-medium">Prepare for interviews</p>
                <p className="text-sm text-white/80">Master product case studies and frameworks</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-emerald-200">🚀</span>
              <div>
                <p className="font-medium">Mock are essential</p>
                <p className="text-sm text-white/80">Practice with experienced PMs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
