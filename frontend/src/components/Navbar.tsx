"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, ShieldAlert } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-calmie-cream/95 backdrop-blur-sm border-b-2 border-black">
      {/* Top emergency & live ticker */}
      <div className="bg-calmie-yellow text-calmie-dark text-xs font-bold py-1.5 px-4 border-b-2 border-black flex items-center justify-between overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
          <span className="uppercase tracking-wider">LIVE PILOT — Shanti Niwas Old Age Home (Gurugram)</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[11px] uppercase tracking-wider">
          <span>Outbound Calling Live on Twilio Voice</span>
          <span>•</span>
          <span>Connected Seniors: 3</span>
          <span>•</span>
          <span className="bg-black text-white px-1.5 py-0.5 rounded-sm">Verified Line: +91 98214 00274</span>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-14 w-44 transition-transform group-hover:scale-105 duration-200">
            <Image
              src="/logo.png"
              alt="Calmie Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6 font-bold text-sm">
          <Link
            href="/residents"
            className="text-calmie-dark hover:text-calmie-pink transition-colors px-2 py-1"
          >
            Find Seniors
          </Link>
          <Link
            href="/publish-elder"
            className="text-calmie-dark hover:text-calmie-pink transition-colors px-2 py-1 flex items-center gap-1"
          >
            <span className="text-calmie-pink font-black">+</span>
            <span>Publish an Elder</span>
          </Link>
          <Link
            href="/homes"
            className="text-calmie-dark hover:text-calmie-pink transition-colors px-2 py-1"
          >
            Care Homes
          </Link>
          <Link
            href="/vakh"
            className="text-calmie-dark hover:text-calmie-pink transition-colors px-2 py-1 flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-calmie-pink animate-pulse"></span>
            <span>Vakh Booking</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-calmie-dark hover:text-calmie-pink transition-colors px-2 py-1"
          >
            <ShieldAlert className="w-4 h-4 text-calmie-coral" />
            <span>Caseworker Feed</span>
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/vakh"
            className="hidden sm:inline-flex btn-yellow text-xs py-2 px-3 font-bold"
          >
            💬 Vakh Hub
          </Link>
          <Link
            href="/residents"
            className="btn-pink text-xs sm:text-sm py-2 px-4 sm:px-5 flex items-center gap-2"
          >
            <Phone className="w-4 h-4 fill-white" />
            <span>Book a Call</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
