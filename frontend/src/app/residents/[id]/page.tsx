import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, MapPin, Phone } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

async function getResident(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/residents/${id}`, { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend fetch failed, using fallback:", e);
  }

  // Fallback data
  const mocks: Record<string, Record<string, unknown>> = {
    "95c6eaba-fda4-44c0-8d8e-d13d9211808e": {
      id: "95c6eaba-fda4-44c0-8d8e-d13d9211808e",
      name: "Ramesh Tiwari",
      age: 79,
      room_number: "104",
      phone: "9821400274",
      photo_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80",
      hometown: "Allahabad (Prayagraj), UP",
      family_notes: "Son Vikram lives in Noida, daughter Meena in Canada. Vikram visits once a month. Meena calls every Sunday.",
      hobbies: "Cricket (huge fan since 1983 World Cup), chess, listening to old Mohammed Rafi songs",
      health_notes: "Slight hearing loss in left ear. Calmie speaks clearly and slightly louder. No cognitive impairment.",
      personality: "Very talkative. Loves telling stories about his railway job (retired station master). Laughs easily. Repeats himself sometimes with fond nostalgia.",
      preferred_lang: "Hindi with some English words",
      favorite_topics: "1983 Cricket World Cup, Indian Railways, partition stories his father told him, Mohammed Rafi",
      avoid_topics: "His wife Savitri who passed 2 years ago — do not bring up unless he does"
    },
    "d9cde304-cad5-4d9c-ab22-2a169e3846d2": {
      id: "d9cde304-cad5-4d9c-ab22-2a169e3846d2",
      name: "Kamla Devi",
      age: 74,
      room_number: "108",
      phone: "9821400274",
      photo_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80",
      hometown: "Jaipur, Rajasthan",
      family_notes: "Three sons, none living in Gurugram. Calls them every Saturday but misses daily conversation.",
      hobbies: "Bhajan singing, reading Ramcharitmanas, watching nature documentaries, watering her balcony plants",
      health_notes: "Type 2 diabetes — low-stress conversation. Sharp memory.",
      personality: "Calm, thoughtful, philosophical. Not very talkative unless asked the right questions. Warms up about spirituality or her jasmine plants.",
      preferred_lang: "Hindi (prefers), basic English understood",
      favorite_topics: "Bhakti poetry, Rajasthan memories, her garden, her grandchildren's studies",
      avoid_topics: "None specified"
    },
    "f1e8c218-bf30-44ed-84d4-6a129b12d99d": {
      id: "f1e8c218-bf30-44ed-84d4-6a129b12d99d",
      name: "Col. (Retd.) Harbhajan Singh",
      age: 82,
      room_number: "201",
      phone: "9821400274",
      photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80",
      hometown: "Ludhiana, Punjab",
      family_notes: "Widower. Daughter Navneet in Singapore, keeps in touch on video call. Proud of her but misses her. Has a dog named Sheru.",
      hobbies: "Reading newspapers (Times of India, daily), chess, talking about military history and 1971 war",
      health_notes: "Hearing is excellent. Sometimes gets breathless — keep call under 8 minutes.",
      personality: "Formal, dignified. Calls himself 'Colonel.' Warms up when addressed respectfully. Dry sense of humor.",
      preferred_lang: "English and Punjabi mix, formal register",
      favorite_topics: "1971 India-Pakistan war, Punjab, Indian Army, chess, Sheru the dog, Navneet",
      avoid_topics: "Partition violence — too personal"
    }
  };

  return mocks[id] || mocks["95c6eaba-fda4-44c0-8d8e-d13d9211808e"];
}

export default async function ResidentDetailPage({ params }: { params: { id: string } }) {
  const resident = await getResident(params.id);
  if (!resident) notFound();

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
                src={resident.photo_url}
                alt={resident.name}
                fill
                className="object-cover"
                priority
              />
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

            {/* Booking CTA Bar */}
            <div className="pt-4 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs text-gray-500">Typical Call Length</p>
                <p className="font-heading font-bold text-sm text-calmie-dark">8 – 15 Minutes</p>
              </div>
              <Link
                href={`/book/${resident.id}`}
                className="btn-pink text-sm py-3.5 px-8 flex items-center justify-center gap-2 w-full sm:w-auto shadow-brutal-lg"
              >
                <Phone className="w-4 h-4 fill-white" />
                <span>Schedule a Warm Call for {resident.name.split(" ")[0]}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
