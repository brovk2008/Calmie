"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Building2, MapPin, Phone, Copy, Check, MessageSquare } from "lucide-react";
import VakhBookingModal from "@/components/VakhBookingModal";

interface Resident {
  id: string;
  name: string;
  code?: string;
  age: number;
  room_number: string;
  phone?: string;
  photo_url: string;
  hometown: string;
  family_notes?: string;
  hobbies?: string;
  health_notes?: string;
  personality?: string;
  preferred_lang: string;
  favorite_topics?: string;
  avoid_topics?: string;
}

export default function ResidentDetailClient({ resident }: { resident: Resident }) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [isVakhModalOpen, setIsVakhModalOpen] = useState(false);

  const seniorCode = resident.code || `CLM-${resident.name.split(" ")[0].toUpperCase()}`;

  const replyTemplate = `Senior Code: ${seniorCode}
Booker Name: Family Member
Phone: +919821400274
Time: 2026-09-20 18:30
Voice: Anjura
Note: Discuss ${resident.favorite_topics || "fond memories and childhood stories"}`;

  const copyCode = () => {
    navigator.clipboard.writeText(seniorCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyTemplate = () => {
    navigator.clipboard.writeText(replyTemplate);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Back Button */}
      <Link
        href="/residents"
        className="inline-flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-calmie-dark hover:text-calmie-pink transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Seniors Directory</span>
      </Link>

      {/* Main Profile Grid */}
      <div className="card-brutal p-6 sm:p-10 bg-white border-3 border-black shadow-brutal-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Photo & Quick Info */}
          <div className="space-y-4">
            <div className="relative h-72 w-full border-3 border-black shadow-brutal overflow-hidden">
              <Image
                src={resident.photo_url || "/residents/ramesh.jpg"}
                alt={resident.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Senior Code Box */}
            <div className="bg-white border-2 border-black p-3.5 shadow-brutal-sm space-y-1.5">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Unique Vakh Senior Code:
              </p>
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-base text-calmie-pink bg-calmie-yellow px-2 py-0.5 border border-black">
                  {seniorCode}
                </span>
                <button
                  type="button"
                  onClick={copyCode}
                  className="btn-white text-xs py-1 px-2.5 flex items-center gap-1 font-bold"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-calmie-yellow border-2 border-black p-4 space-y-2 text-xs font-medium">
              <p className="font-heading font-black text-sm text-calmie-dark">Residence Info</p>
              <p className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-black" />
                <span>Shanti Niwas Old Age Home</span>
              </p>
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-black" />
                <span>Sector 21, Gurugram</span>
              </p>
              <p className="font-bold text-calmie-dark pt-1 border-t border-black/20">
                Room Number: {resident.room_number || "104"}
              </p>
            </div>
          </div>

          {/* Detailed Biography & Prompts */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="badge-brutal bg-calmie-lime text-black text-xs">
                  Verified Resident
                </span>
                <span className="badge-brutal bg-calmie-pink text-white text-xs">
                  🗣️ {resident.preferred_lang}
                </span>
                <span className="font-mono font-bold text-xs bg-black text-white px-2 py-0.5">
                  Code: {seniorCode}
                </span>
              </div>
              <h1 className="font-heading font-black text-3xl sm:text-4xl text-calmie-dark">
                {resident.name}, {resident.age}
              </h1>
              <p className="text-sm font-semibold text-gray-600 mt-1">
                From {resident.hometown}
              </p>
            </div>

            {/* Personality & Bio */}
            <div className="space-y-2 text-sm text-gray-700">
              <h3 className="font-heading font-bold text-base text-calmie-dark uppercase tracking-wide">
                About & Personality
              </h3>
              <p className="leading-relaxed bg-[#fbf9f4] p-4 border-2 border-black">
                {resident.personality}
              </p>
            </div>

            {/* Family & Roots */}
            <div className="space-y-2 text-sm text-gray-700">
              <h3 className="font-heading font-bold text-base text-calmie-dark uppercase tracking-wide">
                Family & Background
              </h3>
              <p className="leading-relaxed">{resident.family_notes}</p>
            </div>

            {/* Injected Context Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-emerald-50 border-2 border-black p-3.5 space-y-1">
                <p className="font-bold text-emerald-800 uppercase tracking-wide">
                  Topics They Love (Favs)
                </p>
                <p className="text-gray-800 font-medium">🎯 {resident.favorite_topics}</p>
              </div>

              <div className="bg-red-50 border-2 border-black p-3.5 space-y-1">
                <p className="font-bold text-red-800 uppercase tracking-wide">
                  Avoid Topics (Sensitive)
                </p>
                <p className="text-gray-800 font-medium">🚫 {resident.avoid_topics}</p>
              </div>

              <div className="bg-blue-50 border-2 border-black p-3.5 space-y-1 sm:col-span-2">
                <p className="font-bold text-blue-800 uppercase tracking-wide">
                  Care & Communication Accommodations
                </p>
                <p className="text-gray-800 font-medium">🩺 {resident.health_notes}</p>
              </div>
            </div>

            {/* Vakh Community Booking Card */}
            <div className="bg-calmie-cream border-2 border-black p-5 shadow-brutal-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="badge-brutal bg-black text-white text-[10px]">
                    VAKH COMMUNITY BOOKING
                  </span>
                  <h4 className="font-heading font-black text-base text-calmie-dark mt-1">
                    Book a Call for {resident.name.split(" ")[0]} via Vakh
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setIsVakhModalOpen(true)}
                  className="btn-pink text-xs py-2 px-4 flex items-center justify-center gap-1.5 font-bold shadow-brutal-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Open Vakh Booker</span>
                </button>
              </div>

              <p className="text-xs text-gray-700">
                You can book directly using Senior Code <strong className="font-mono bg-white px-1 border border-black">{seniorCode}</strong> on the Vakh Form or by replying to the official post.
              </p>

              <div className="bg-white border border-black p-3 space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center justify-between text-gray-500 font-sans font-bold text-[10px]">
                  <span>REPLY TEMPLATE FOR THIS ELDER:</span>
                  <button
                    type="button"
                    onClick={copyTemplate}
                    className="text-calmie-pink hover:underline font-bold flex items-center gap-1"
                  >
                    {copiedTemplate ? "Copied!" : "Copy Template"}
                  </button>
                </div>
                <p className="text-gray-800 whitespace-pre-line">{replyTemplate}</p>
              </div>
            </div>

            {/* Booking CTA Bar */}
            <div className="pt-4 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs text-gray-500">Typical Call Length</p>
                <p className="font-heading font-bold text-sm text-calmie-dark">8 – 15 Minutes</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsVakhModalOpen(true)}
                  className="btn-white text-xs sm:text-sm py-3 px-5 flex items-center justify-center gap-1.5 flex-1 sm:flex-none shadow-brutal"
                >
                  <MessageSquare className="w-4 h-4 text-calmie-pink" />
                  <span>Book on Vakh</span>
                </button>
                <Link
                  href={`/book/${resident.id}`}
                  className="btn-pink text-xs sm:text-sm py-3 px-6 flex items-center justify-center gap-2 flex-1 sm:flex-none shadow-brutal"
                >
                  <Phone className="w-4 h-4 fill-white" />
                  <span>Schedule Call</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vakh Modal */}
      <VakhBookingModal
        isOpen={isVakhModalOpen}
        onClose={() => setIsVakhModalOpen(false)}
        initialSeniorId={resident.id}
        initialSeniorCode={seniorCode}
      />
    </div>
  );
}
