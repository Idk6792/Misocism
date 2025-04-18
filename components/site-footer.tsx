"use client"
import { DiscIcon as Discord } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SiteFooter() {
  return (
    <footer className="w-full bg-white text-black py-8 mt-12 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Logo and Tagline */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Stomp Counter</h3>
            <p className="text-gray-600">
              This website was developed by andrew, you can contact me on discord which is misocist, this website was
              made for all baddies players! if any questions feel free to dm me!
            </p>
          </div>

          {/* Platform Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Find misocist on all platforms</h3>
            <div className="grid grid-cols-3 gap-3">
              {["Discord", "Roblox", "Steam"].map((platform) => (
                <div key={platform} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-700">{platform}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-[#5865f2] hover:bg-[#4752c4] text-white border-none"
              >
                <a
                  href="https://discord.gg/misocist"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <Discord className="h-5 w-5" />
                </a>
              </Button>
              <a
                href="https://discord.gg/misocist"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                Join our Discord
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Stomp Counter. All rights reserved.</p>
          <p className="mt-1">
            For assistance with the stomp counter, contact <span className="text-blue-600">h3xed_.</span> on Discord
          </p>
        </div>
      </div>
    </footer>
  )
}
