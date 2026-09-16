"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Search, Filter, MapPin, Building2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

interface Resident {
  id: string;
  name: string;
  age: number;
  room_number: string;
  photo_url: string;
  hometown: string;
  hobbies: string;
  preferred_lang: string;
  favorite_topics: string;
  personality: string;
  family_notes: string;
}

const FALLBACK_RESIDENTS: Resident[] = [
  {
    id: "95c6eaba-fda4-44c0-8d8e-d13d9211808e",
    name: "Ramesh Tiwari",
    age: 79,
    room_number: "104",
    photo_url: "/residents/ramesh.jpg",
    hometown: "Allahabad (Prayagraj), UP",
    hobbies: "Cricket (1983 World Cup fan), chess, Mohammed Rafi songs",
    preferred_lang: "Hindi with English mix",
    favorite_topics: "1983 World Cup, Indian Railways, Mohammed Rafi",
    personality: "Talkative, retired station master, repeats stories with joy",
    family_notes: "Son Vikram in Noida, daughter Meena in Canada."
  },
  {
    id: "d9cde304-cad5-4d9c-ab22-2a169e3846d2",
    name: "Kamla Devi",
    age: 74,
    room_number: "108",
    photo_url: "/residents/kamla.jpg",
    hometown: "Jaipur, Rajasthan",
    hobbies: "Bhajan singing, Ramcharitmanas, balcony garden",
    preferred_lang: "Hindi",
    favorite_topics: "Bhakti poetry, Rajasthan, jasmine plants",
    personality: "Quiet, spiritual, warms up over her garden",
    family_notes: "Three sons living outside Gurugram; feels distance."
  },
  {
    id: "f1e8c218-bf30-44ed-84d4-6a129b12d99d",
    name: "Col. (Retd.) Harbhajan Singh",
    age: 82,
    room_number: "201",
    photo_url: "/residents/harbhajan.jpg",
    hometown: "Ludhiana, Punjab",
    hobbies: "Times of India daily, military history, chess",
    preferred_lang: "English and Punjabi mix",
    favorite_topics: "1971 war, Indian Army, Sheru the dog",
    personality: "Formal, dignified, dry wit, loves world affairs",
    family_notes: "Daughter Navneet in Singapore; proud veteran."
  }
];

export default function ResidentsPage() {
  const [residents, setResidents] = useState<Resident[]>(FALLBACK_RESIDENTS);
  const [search, setSearch] = useState("");
  const [langFilter, setLangFilter] = useState("all");

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/residents`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setResidents(data);
        }
      })
      .catch((err) => console.warn("Using fallback residents:", err));
  }, []);

  const filtered = residents.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      (r.hometown && r.hometown.toLowerCase().includes(search.toLowerCase())) ||
      (r.hobbies && r.hobbies.toLowerCase().includes(search.toLowerCase()));

    const matchesLang =
      langFilter === "all" ||
      (r.preferred_lang && r.preferred_lang.toLowerCase().includes(langFilter.toLowerCase()));

    return matchesSearch && matchesLang;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="border-b-3 border-black pb-8 space-y-4">
        <div className="inline-block bg-calmie-yellow border-2 border-black px-3 py-1 font-heading font-black text-xs uppercase tracking-wider shadow-brutal-sm">
          Registered Elders Directory
        </div>
        <h1 className="font-heading font-black text-4xl sm:text-5xl text-calmie-dark">
          Meet the Seniors Awaiting a Warm Call
        </h1>
        <p className="text-gray-700 max-w-2xl font-medium">
          Select an elder to learn about their background, their passions, and schedule a
          heartwarming AI conversation that makes their week brighter.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name, hometown, hobby..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-brutal pl-10 py-2.5 text-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold uppercase text-gray-600 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Language:
          </span>
          <select
            value={langFilter}
            onChange={(e) => setLangFilter(e.target.value)}
            className="border-2 border-black bg-white px-3 py-2 text-xs font-bold shadow-brutal-sm focus:outline-none"
          >
            <option value="all">All Languages</option>
            <option value="Hindi">Hindi</option>
            <option value="English">English</option>
            <option value="Punjabi">Punjabi</option>
          </select>
        </div>
      </div>

      {/* Resident Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filtered.map((r) => (
          <div
            key={r.id}
            className="card-brutal-hover flex flex-col justify-between overflow-hidden bg-white"
          >
            {/* Image Banner */}
            <div className="relative h-60 w-full border-b-2 border-black">
              <Image
                src={r.photo_url || "/residents/ramesh.jpg"}
                alt={r.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-3 left-3 bg-white border border-black font-bold text-xs px-2.5 py-1 shadow-brutal-sm flex items-center gap-1">
                <Building2 className="w-3 h-3 text-calmie-dark" />
                <span>Shanti Niwas</span>
              </div>
              <div className="absolute top-3 right-3 bg-calmie-yellow border border-black font-bold text-xs px-2.5 py-1 shadow-brutal-sm">
                Room {r.room_number || "101"}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 flex-1">
              <div>
                <h2 className="font-heading font-black text-2xl text-calmie-dark">
                  {r.name}, {r.age}
                </h2>
                <p className="text-xs font-medium text-gray-600 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-calmie-pink" />
                  <span>{r.hometown}</span>
                </p>
              </div>

              <div className="space-y-2 text-xs text-gray-700">
                <p>
                  <strong className="text-calmie-dark">Passions:</strong> {r.hobbies}
                </p>
                <p>
                  <strong className="text-calmie-dark">Personality:</strong> {r.personality}
                </p>
                <p>
                  <strong className="text-calmie-dark">Loves Discussing:</strong> {r.favorite_topics}
                </p>
              </div>

              <div className="pt-2">
                <span className="badge-brutal bg-calmie-cream text-calmie-dark text-[11px]">
                  🗣️ {r.preferred_lang}
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 pt-0 border-t-2 border-black/10 flex items-center justify-between gap-3">
              <Link
                href={`/residents/${r.id}`}
                className="btn-white text-xs py-2.5 px-4 flex-1 text-center"
              >
                View Story
              </Link>
              <Link
                href={`/book/${r.id}`}
                className="btn-pink text-xs py-2.5 px-5 flex items-center justify-center gap-1.5 flex-1"
              >
                <Phone className="w-3.5 h-3.5 fill-white" />
                <span>Book Call</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
