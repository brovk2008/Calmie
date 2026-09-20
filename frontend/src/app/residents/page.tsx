"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Search, Filter, MapPin, Building2, Copy, Check, MessageSquare, ExternalLink } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import VakhBookingModal from "@/components/VakhBookingModal";

interface Resident {
  id: string;
  name: string;
  code?: string;
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
    code: "CLM-RAMESH",
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
    code: "CLM-KAMLA",
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
    code: "CLM-HARBHAJAN",
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
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Vakh modal state
  const [vakhModalOpen, setVakhModalOpen] = useState(false);
  const [selectedSeniorForVakh, setSelectedSeniorForVakh] = useState<Resident | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/residents`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const enriched = data.map((r: any) => ({
            ...r,
            code: r.code || `CLM-${r.name.split(" ")[0].toUpperCase()}`
          }));
          setResidents(enriched);
        }
      })
      .catch((err) => console.warn("Using fallback residents:", err));
  }, []);

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleOpenVakhModal = (resident?: Resident) => {
    if (resident) setSelectedSeniorForVakh(resident);
    setVakhModalOpen(true);
  };

  const filtered = residents.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      (r.code && r.code.toLowerCase().includes(search.toLowerCase())) ||
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

      {/* Vakh Community Booking Announcement Banner */}
      <div className="bg-gradient-to-r from-calmie-yellow via-yellow-100 to-calmie-cream border-3 border-black p-6 shadow-brutal-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="badge-brutal bg-black text-white text-xs">VAKH INTEGRATION</span>
            <span className="text-xs font-bold text-emerald-900 bg-emerald-200 border border-emerald-600 px-2 py-0.5">
              ⚡ Unique Senior Codes Enabled
            </span>
          </div>
          <h2 className="font-heading font-black text-xl sm:text-2xl text-calmie-dark">
            Book Calls Directly via Vakh (Post Reply or Form)
          </h2>
          <p className="text-xs sm:text-sm text-gray-800 font-medium max-w-2xl">
            Every elder below has a dedicated Senior Code (e.g. <strong className="font-mono bg-white px-1.5 py-0.5 border border-black">CLM-RAMESH</strong>).
            You can book a slot with custom time by replying to our Vakh post or submitting the Vakh form!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={() => handleOpenVakhModal(residents[0])}
            className="btn-pink text-xs sm:text-sm py-3 px-5 flex items-center justify-center gap-2 shadow-brutal flex-1 md:flex-none"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Book via Vakh Hub</span>
          </button>
          <Link
            href="/vakh"
            className="btn-white text-xs sm:text-sm py-3 px-4 flex items-center justify-center gap-1.5 shadow-brutal flex-1 md:flex-none"
          >
            <span>Learn More</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name, code (CLM-...), hobby..."
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
        {filtered.map((r) => {
          const seniorCode = r.code || `CLM-${r.name.split(" ")[0].toUpperCase()}`;
          return (
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

                {/* Senior Code Badge */}
                <div className="bg-[#fbf9f4] border-2 border-black p-2.5 flex items-center justify-between shadow-brutal-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Senior Code:</span>
                    <span className="font-mono font-black text-xs text-calmie-dark bg-calmie-yellow px-1.5 py-0.5 border border-black">
                      {seniorCode}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleCopyCode(seniorCode, e)}
                    className="text-[11px] font-bold px-2 py-0.5 border border-black bg-white hover:bg-calmie-yellow transition-colors flex items-center gap-1"
                  >
                    {copiedCode === seniorCode ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
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
              <div className="p-6 pt-0 border-t-2 border-black/10 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Link
                    href={`/residents/${r.id}`}
                    className="btn-white text-xs py-2.5 px-3 flex-1 text-center"
                  >
                    View Story
                  </Link>
                  <Link
                    href={`/book/${r.id}`}
                    className="btn-pink text-xs py-2.5 px-4 flex items-center justify-center gap-1.5 flex-1"
                  >
                    <Phone className="w-3.5 h-3.5 fill-white" />
                    <span>Book Call</span>
                  </Link>
                </div>
                {/* Vakh Quick Trigger */}
                <button
                  type="button"
                  onClick={() => handleOpenVakhModal(r)}
                  className="w-full bg-calmie-cream hover:bg-calmie-yellow border-2 border-black py-2 px-3 text-xs font-bold text-calmie-dark flex items-center justify-center gap-1.5 transition-colors shadow-brutal-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-calmie-pink" />
                  <span>Book via Vakh Hub (Code: {seniorCode})</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Vakh Booking Modal */}
      <VakhBookingModal
        isOpen={vakhModalOpen}
        onClose={() => setVakhModalOpen(false)}
        initialSeniorId={selectedSeniorForVakh?.id}
        initialSeniorCode={selectedSeniorForVakh?.code}
      />
    </div>
  );
}
