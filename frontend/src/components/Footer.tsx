import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-calmie-dark text-white border-t-3 border-black mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Col 1: Logo & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="relative h-14 w-44 bg-white/10 p-2 rounded-md border-2 border-white/20 inline-block">
              <Image
                src="/logo.png"
                alt="Calmie"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-xl font-heading font-extrabold text-calmie-yellow">
              “The world forgot to call. We didn’t.”
            </p>
            <p className="text-sm text-gray-300 max-w-md leading-relaxed">
              Calmie connects compassionate citizens, family members, and elderly care homes
              with AI-guided, deeply personalized check-in phone calls. Powered by Twilio Voice,
              Supabase, and Vakh family feeds.
            </p>
          </div>

          {/* Col 2: Platform Links */}
          <div className="space-y-3">
            <h4 className="font-heading text-lg font-bold text-calmie-yellow uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2 text-sm font-medium text-gray-300">
              <li>
                <Link href="/residents" className="hover:text-calmie-pink transition-colors">
                  Meet the Seniors
                </Link>
              </li>
              <li>
                <Link href="/homes" className="hover:text-calmie-pink transition-colors">
                  Care Homes Directory
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-calmie-pink transition-colors">
                  Caseworker Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/residents/new" className="hover:text-calmie-pink transition-colors">
                  Enroll an Elder
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Pilot Details */}
          <div className="space-y-3">
            <h4 className="font-heading text-lg font-bold text-calmie-yellow uppercase tracking-wider">
              Pilot Home
            </h4>
            <div className="bg-white/5 border-2 border-white/20 p-3 rounded-none text-xs space-y-2 text-gray-300">
              <p className="font-bold text-white text-sm">Shanti Niwas Old Age Home</p>
              <p>Sector 21, Gurugram, Haryana</p>
              <p className="text-calmie-lime font-mono-brutal">● Verified Twilio Voice Endpoint</p>
              <p className="text-calmie-yellow font-mono-brutal">● Outbound Demo: 9821400274</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© 2026 Calmie AI — Built for BuildSprint 2026 (AI & Automation Track).</p>
          <div className="flex items-center gap-2">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-calmie-pink fill-calmie-pink" />
            <span>for our elders</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
