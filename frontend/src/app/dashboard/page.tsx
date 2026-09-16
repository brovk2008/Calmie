"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserPlus, MessageSquare, Clock } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

interface CallItem {
  id: string;
  resident?: {
    name: string;
    room_number: string;
    photo_url: string;
    preferred_lang: string;
  };
  started_at: string;
  duration_secs?: number;
  mood_score?: number;
  loneliness_flag?: boolean;
  urgent_flag?: boolean;
  urgent_reason?: string;
  summary?: string;
  vakh_post_id?: string;
  status: string;
}

const FALLBACK_CALLS: CallItem[] = [
  {
    id: "call_demo_1",
    resident: {
      name: "Ramesh Tiwari",
      room_number: "104",
      photo_url: "/residents/ramesh.jpg",
      preferred_lang: "Hindi/English"
    },
    started_at: "Just now",
    duration_secs: 184,
    mood_score: 5,
    loneliness_flag: false,
    urgent_flag: false,
    summary: "Ramesh Tiwari was in exceptional spirits reminiscing about his railway station master days and the 1983 World Cup final. He laughed often and appreciated Vikram scheduling the check-in.",
    vakh_post_id: "vakh_post_893a7f",
    status: "completed"
  },
  {
    id: "call_demo_2",
    resident: {
      name: "Kamla Devi",
      room_number: "108",
      photo_url: "/residents/kamla.jpg",
      preferred_lang: "Hindi"
    },
    started_at: "2 hours ago",
    duration_secs: 210,
    mood_score: 4,
    loneliness_flag: true,
    urgent_flag: false,
    summary: "Kamla Devi spoke peacefully about her balcony jasmine plants and recited a chaupai. However, she mentioned feeling quiet around tea time when others get visits. Follow-up recommended.",
    vakh_post_id: "vakh_post_11a84c",
    status: "completed"
  },
  {
    id: "call_demo_3",
    resident: {
      name: "Col. (Retd.) Harbhajan Singh",
      room_number: "201",
      photo_url: "/residents/harbhajan.jpg",
      preferred_lang: "English/Punjabi"
    },
    started_at: "Yesterday",
    duration_secs: 195,
    mood_score: 5,
    loneliness_flag: false,
    urgent_flag: false,
    summary: "Colonel Sahab had a lively discussion on defense history and shared proud updates about his daughter Navneet in Singapore. Voice was crisp, confident, and satisfied.",
    vakh_post_id: "vakh_post_67b93e",
    status: "completed"
  }
];

export default function DashboardPage() {
  const [calls, setCalls] = useState<CallItem[]>(FALLBACK_CALLS);
  const [stats, setStats] = useState({
    total_calls: 16,
    avg_mood: 4.8,
    loneliness_flags: 2,
    urgent_flags: 0,
    connected_seniors: 3
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/calls`)
      .then((res) => res.json())
      .then((data) => {
        if (data.calls && data.calls.length > 0) {
          setCalls(data.calls);
        }
        if (data.stats) {
          setStats(data.stats);
        }
      })
      .catch((err) => console.warn("Using fallback dashboard data:", err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-3 border-black pb-8">
        <div>
          <div className="inline-block bg-calmie-yellow border-2 border-black px-3 py-1 font-heading font-black text-xs uppercase tracking-wider shadow-brutal-sm mb-2">
            Caregiver & NGO Console
          </div>
          <h1 className="font-heading font-black text-4xl text-calmie-dark">
            Shanti Niwas Call Intelligence Feed
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Real-time mood telemetry, clinical alerts, and Vakh family feed synchronization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/residents/new"
            className="btn-pink text-xs py-2.5 px-5 flex items-center gap-2 shadow-brutal"
          >
            <UserPlus className="w-4 h-4" />
            <span>Enroll New Elder</span>
          </Link>
        </div>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="card-brutal p-5 bg-white border-2 border-black">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Total Calls</span>
          <p className="font-heading font-black text-3xl sm:text-4xl text-calmie-dark mt-1">
            {stats.total_calls}
          </p>
          <span className="text-[11px] text-gray-600 font-medium mt-1 block">Completed via Twilio</span>
        </div>

        <div className="card-brutal p-5 bg-calmie-yellow border-2 border-black">
          <span className="text-xs font-bold text-calmie-dark uppercase tracking-wide">Average Mood</span>
          <p className="font-heading font-black text-3xl sm:text-4xl text-calmie-dark mt-1 flex items-baseline gap-1">
            <span>{stats.avg_mood}</span>
            <span className="text-base text-gray-700">/ 5.0</span>
          </p>
          <span className="text-[11px] text-gray-800 font-bold mt-1 block">⭐⭐⭐⭐⭐ Sentiment</span>
        </div>

        <div className="card-brutal p-5 bg-white border-2 border-black">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Loneliness Alerts</span>
          <p className="font-heading font-black text-3xl sm:text-4xl text-amber-600 mt-1">
            {stats.loneliness_flags}
          </p>
          <span className="text-[11px] text-gray-600 font-medium mt-1 block">Follow-up requested</span>
        </div>

        <div className="card-brutal p-5 bg-white border-2 border-black">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Urgent Care Flags</span>
          <p className="font-heading font-black text-3xl sm:text-4xl text-emerald-600 mt-1">
            {stats.urgent_flags}
          </p>
          <span className="text-[11px] text-emerald-700 font-bold mt-1 block">Zero active distress</span>
        </div>

        <div className="card-brutal p-5 bg-calmie-lime border-2 border-black col-span-2 lg:col-span-1">
          <span className="text-xs font-bold text-black uppercase tracking-wide">Seniors Enrolled</span>
          <p className="font-heading font-black text-3xl sm:text-4xl text-black mt-1">
            {stats.connected_seniors}
          </p>
          <span className="text-[11px] text-gray-900 font-bold mt-1 block">Shanti Niwas Pilot</span>
        </div>
      </div>

      {/* Live Call Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-black text-2xl text-calmie-dark flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-calmie-pink" />
            <span>Recent AI Check-in Conversations</span>
          </h2>
          <span className="badge-brutal bg-white text-xs">
            Auto-Sync Active (Supabase + Vakh)
          </span>
        </div>

        <div className="space-y-4">
          {calls.map((c) => {
            const resident = c.resident || { name: "Senior Resident", room_number: "101", photo_url: "" };
            const mood = c.mood_score || 4;

            return (
              <div
                key={c.id}
                className="card-brutal p-6 sm:p-7 bg-white border-3 border-black shadow-brutal hover:shadow-brutal-lg transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 border-2 border-black overflow-hidden flex-shrink-0">
                      <Image
                        src={resident.photo_url || "/residents/ramesh.jpg"}
                        alt={resident.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading font-black text-xl text-calmie-dark">
                          {resident.name}
                        </h3>
                        <span className="bg-calmie-yellow text-black font-bold text-[10px] px-2 py-0.5 border border-black">
                          Rm {resident.room_number}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{c.started_at || "Recent"} · Duration: {c.duration_secs || 180}s</span>
                      </p>
                    </div>
                  </div>

                  {/* Mood & Flags */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="bg-[#fbf9f4] border-2 border-black px-3 py-1 text-xs font-bold flex items-center gap-1.5 shadow-brutal-sm">
                      <span className="text-gray-600">Mood:</span>
                      <span className="text-yellow-500">{"⭐".repeat(mood)}</span>
                      <span className="text-calmie-dark font-black">({mood}/5)</span>
                    </div>

                    {c.loneliness_flag && (
                      <span className="badge-brutal bg-amber-100 text-amber-900 border-amber-900">
                        ⚠️ Loneliness Signal
                      </span>
                    )}

                    {c.urgent_flag && (
                      <span className="badge-brutal bg-red-600 text-white animate-pulse">
                        🚨 Urgent Flag
                      </span>
                    )}
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Family & Caseworker Digest:
                  </p>
                  <p className="text-sm text-gray-800 font-medium leading-relaxed bg-[#fbf9f4] p-4 border border-black">
                    {c.summary || "Call completed with warm nostalgic stories and good cheer."}
                  </p>
                </div>

                {/* Vakh Integration Metadata Footer */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="font-mono-brutal font-bold text-calmie-dark">
                      Vakh Feed Dispatched: {c.vakh_post_id || "vakh_post_sync_demo"}
                    </span>
                  </div>
                  <span className="text-gray-500 text-[11px]">
                    Platform: Twilio Outbound Voice + Claude Haiku Clinical Analysis
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
