import Image from "next/image";
import Link from "next/link";
import { Heart, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import PhoneDemoWidget from "@/components/PhoneDemoWidget";

export default function HomePage() {
  return (
    <div className="space-y-20 pb-20">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 bg-calmie-yellow border-2 border-black px-4 py-1.5 shadow-brutal-sm">
            <Sparkles className="w-4 h-4 text-calmie-dark" />
            <span className="font-heading font-black text-xs uppercase tracking-wider text-calmie-dark">
              AI & Automation Track · BuildSprint 2026
            </span>
          </div>

          {/* Logo Showcase */}
          <div className="relative h-28 sm:h-36 w-full max-w-md mx-auto my-2 transform hover:scale-105 transition-transform">
            <Image
              src="/logo.png"
              alt="Calmie"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Big Punchy Headline */}
          <h1 className="font-heading font-black text-4xl sm:text-6xl text-calmie-dark leading-tight tracking-tight">
            The world forgot to call.{" "}
            <span className="bg-calmie-yellow px-2 border-2 border-black inline-block shadow-brutal-sm rotate-[-1deg]">
              We didn’t.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-700 font-medium leading-relaxed max-w-2xl mx-auto">
            Book a warm, deeply personalized AI phone call for senior citizens in registered
            old age homes. Calmie knows their life stories, their favorite cricket matches,
            and their daily routine before it even rings.
          </p>

          {/* CTA Group */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/residents"
              className="btn-pink text-base py-3.5 px-8 flex items-center gap-2.5 shadow-brutal-lg"
            >
              <Heart className="w-5 h-5 fill-white" />
              <span>Meet the Seniors & Book</span>
            </Link>
            <Link
              href="/dashboard"
              className="btn-white text-base py-3.5 px-6 flex items-center gap-2"
            >
              <ShieldCheck className="w-5 h-5 text-calmie-dark" />
              <span>Caseworker Feed</span>
            </Link>
          </div>
        </div>

        {/* INTERACTIVE DEMO WIDGET */}
        <div className="mt-14 max-w-4xl mx-auto">
          <PhoneDemoWidget />
        </div>
      </section>

      {/* STATS MARQUEE / TICKER */}
      <section className="bg-calmie-yellow border-y-3 border-black py-4 overflow-hidden">
        <div className="animate-marquee flex items-center gap-12 text-sm sm:text-base font-heading font-black uppercase tracking-wider text-calmie-dark">
          <span>❤️ 1,240+ Warm Minutes Delivered</span>
          <span>•</span>
          <span>👵 68% Loneliness Reduction Reported</span>
          <span>•</span>
          <span>⚡ Live Twilio Voice Integration</span>
          <span>•</span>
          <span>🔔 Instant Vakh Family Feed Dispatches</span>
          <span>•</span>
          <span>🏏 Ramesh Tiwari’s Favorite 1983 World Cup Memories</span>
          <span>•</span>
          <span>🌸 Kamla Devi’s Balcony Garden Updates</span>
          <span>•</span>
          <span>❤️ 1,240+ Warm Minutes Delivered</span>
          <span>•</span>
          <span>👵 68% Loneliness Reduction Reported</span>
        </div>
      </section>

      {/* PROBLEM VS SOLUTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="badge-brutal bg-calmie-coral text-white mb-3">
            Why Calmie Matters
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-calmie-dark">
            The Silent Isolation Crisis in Care Homes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Problem Card */}
          <div className="card-brutal p-8 bg-red-50/50 border-3 border-black">
            <div className="inline-block bg-red-600 text-white font-black text-xs px-3 py-1 mb-4 border-2 border-black shadow-brutal-sm">
              THE REALITY TODAY
            </div>
            <h3 className="font-heading font-black text-2xl mb-4 text-calmie-dark">
              Elders Wait Days for a Phone to Ring
            </h3>
            <ul className="space-y-4 text-sm text-gray-700 font-medium">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-none bg-red-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs border border-black">✕</span>
                <span>Families live across cities or continents; daily calls get delayed amidst busy schedules.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-none bg-red-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs border border-black">✕</span>
                <span>Generic robocalls feel robotic, cold, and confuse elderly residents with dementia or hearing loss.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-none bg-red-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs border border-black">✕</span>
                <span>Early signs of depression, loneliness, or medication neglect go unnoticed until it’s too late.</span>
              </li>
            </ul>
          </div>

          {/* Solution Card */}
          <div className="card-brutal p-8 bg-emerald-50/50 border-3 border-black">
            <div className="inline-block bg-calmie-lime text-black font-black text-xs px-3 py-1 mb-4 border-2 border-black shadow-brutal-sm">
              THE CALMIE REVOLUTION
            </div>
            <h3 className="font-heading font-black text-2xl mb-4 text-calmie-dark">
              A Warm, Context-Aware Voice That Never Forgets
            </h3>
            <ul className="space-y-4 text-sm text-gray-700 font-medium">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-none bg-emerald-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs border border-black">✓</span>
                <span>Anyone can sponsor or book a call; old age homes register verified seniors in seconds.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-none bg-emerald-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs border border-black">✓</span>
                <span>Zero introduction burden: Calmie speaks in their preferred language with memories of their youth and hobbies.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-none bg-emerald-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs border border-black">✓</span>
                <span>Automatic clinical mood analysis & Vakh family digests flag health emergencies instantly.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3-STEP HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="badge-brutal bg-calmie-yellow text-calmie-dark mb-3">
            Simple 3-Step Journey
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-calmie-dark">
            How Calmie Delivers Comfort
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="card-brutal p-6 bg-white border-2 border-black hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 bg-calmie-yellow border-2 border-black flex items-center justify-center font-heading font-black text-xl mb-4 shadow-brutal-sm">
              1
            </div>
            <h3 className="font-heading font-black text-xl mb-2 text-calmie-dark">
              Choose a Senior & Slot
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Browse residents at partner care homes. Select a convenient time when they love to chat, and leave an optional loving note.
            </p>
          </div>

          {/* Step 2 */}
          <div className="card-brutal p-6 bg-white border-2 border-black hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 bg-calmie-pink text-white border-2 border-black flex items-center justify-center font-heading font-black text-xl mb-4 shadow-brutal-sm">
              2
            </div>
            <h3 className="font-heading font-black text-xl mb-2 text-calmie-dark">
              AI Ingests Life Story
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Before dialing, Calmie loads their preferred language, personality, topics to cherish (and topics to strictly avoid).
            </p>
          </div>

          {/* Step 3 */}
          <div className="card-brutal p-6 bg-white border-2 border-black hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 bg-calmie-lime border-2 border-black flex items-center justify-center font-heading font-black text-xl mb-4 shadow-brutal-sm">
              3
            </div>
            <h3 className="font-heading font-black text-xl mb-2 text-calmie-dark">
              Live Call & Family Digest
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Twilio rings their phone. Post-call, sentiment scoring, loneliness flags, and a family digest are pushed to the Vakh feed.
            </p>
          </div>
        </div>
      </section>

      {/* MEET THE RESIDENTS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 pb-4 border-b-2 border-black">
          <div>
            <span className="badge-brutal bg-calmie-lime text-black mb-2">
              Featured Elders
            </span>
            <h2 className="font-heading font-black text-3xl text-calmie-dark">
              Seniors at Shanti Niwas Old Age Home
            </h2>
          </div>
          <Link
            href="/residents"
            className="btn-white text-xs py-2.5 px-4 flex items-center gap-1.5"
          >
            <span>View All Seniors</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Senior 1: Ramesh Tiwari */}
          <div className="card-brutal p-6 bg-white border-2 border-black space-y-4">
            <div className="relative h-52 w-full border-2 border-black overflow-hidden shadow-brutal-sm">
              <Image
                src="/residents/ramesh.jpg"
                alt="Ramesh Tiwari"
                fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2 bg-calmie-yellow border border-black font-bold text-[10px] px-2 py-0.5 shadow-brutal-sm">
                Room 104
              </div>
            </div>
            <div>
              <h3 className="font-heading font-black text-xl text-calmie-dark">
                Ramesh Tiwari, 79
              </h3>
              <p className="text-xs text-gray-600">Allahabad, UP · Retired Station Master</p>
            </div>
            <p className="text-xs text-gray-700 line-clamp-2">
              Huge cricket enthusiast since the 1983 World Cup. Enjoys Mohammed Rafi songs and telling railway tales.
            </p>
            <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
              <span className="text-[11px] font-bold text-calmie-pink">Hindi/English Mix</span>
              <Link
                href="/book/95c6eaba-fda4-44c0-8d8e-d13d9211808e"
                className="btn-yellow text-xs py-1.5 px-3"
              >
                Book Call
              </Link>
            </div>
          </div>

          {/* Senior 2: Kamla Devi */}
          <div className="card-brutal p-6 bg-white border-2 border-black space-y-4">
            <div className="relative h-52 w-full border-2 border-black overflow-hidden shadow-brutal-sm">
              <Image
                src="/residents/kamla.jpg"
                alt="Kamla Devi"
                fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2 bg-calmie-yellow border border-black font-bold text-[10px] px-2 py-0.5 shadow-brutal-sm">
                Room 108
              </div>
            </div>
            <div>
              <h3 className="font-heading font-black text-xl text-calmie-dark">
                Kamla Devi, 74
              </h3>
              <p className="text-xs text-gray-600">Jaipur, Rajasthan · Devotional Singer</p>
            </div>
            <p className="text-xs text-gray-700 line-clamp-2">
              Loves singing bhajans, tending to her balcony plants, and reminiscing about sweet memories in Jaipur.
            </p>
            <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
              <span className="text-[11px] font-bold text-calmie-pink">Hindi</span>
              <Link
                href="/book/d9cde304-cad5-4d9c-ab22-2a169e3846d2"
                className="btn-yellow text-xs py-1.5 px-3"
              >
                Book Call
              </Link>
            </div>
          </div>

          {/* Senior 3: Col Harbhajan Singh */}
          <div className="card-brutal p-6 bg-white border-2 border-black space-y-4">
            <div className="relative h-52 w-full border-2 border-black overflow-hidden shadow-brutal-sm">
              <Image
                src="/residents/harbhajan.jpg"
                alt="Col. Harbhajan Singh"
                fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2 bg-calmie-yellow border border-black font-bold text-[10px] px-2 py-0.5 shadow-brutal-sm">
                Room 201
              </div>
            </div>
            <div>
              <h3 className="font-heading font-black text-xl text-calmie-dark">
                Col. (Retd.) Harbhajan Singh, 82
              </h3>
              <p className="text-xs text-gray-600">Ludhiana, Punjab · 1971 War Veteran</p>
            </div>
            <p className="text-xs text-gray-700 line-clamp-2">
              Proud veteran, chess player, newspaper enthusiast. Lives with his companion dog Sheru.
            </p>
            <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
              <span className="text-[11px] font-bold text-calmie-pink">English/Punjabi</span>
              <Link
                href="/book/f1e8c218-bf30-44ed-84d4-6a129b12d99d"
                className="btn-yellow text-xs py-1.5 px-3"
              >
                Book Call
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-calmie-dark text-white border-3 border-black p-8 sm:p-12 shadow-brutal-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="badge-brutal bg-calmie-yellow text-black">
              Care Homes & NGOs
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-white">
              Are you an Old Age Home Administrator?
            </h2>
            <p className="text-sm text-gray-300">
              Enroll your residents in under 2 minutes. Provide their background, medical notes,
              and call preferences so our AI voice engine can bring joy to their daily routines.
            </p>
          </div>
          <div className="flex-shrink-0 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link
              href="/dashboard/residents/new"
              className="btn-yellow text-sm py-3 px-6 text-center"
            >
              Enroll a Senior Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
