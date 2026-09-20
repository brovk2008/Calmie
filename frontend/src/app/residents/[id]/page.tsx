import { notFound } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";
import ResidentDetailClient from "./ResidentDetailClient";

async function getResident(id: string) {
  try {
    if (API_BASE_URL && !API_BASE_URL.includes("localhost")) {
      const res = await fetch(`${API_BASE_URL}/api/residents/${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data) {
          return {
            ...data,
            code: data.code || `CLM-${data.name.split(" ")[0].toUpperCase()}`
          };
        }
      }
    }
  } catch (e) {
    console.warn("Backend fetch failed, using fallback:", e);
  }

  // Fallback data with Senior Codes
  const mocks: Record<string, any> = {
    "95c6eaba-fda4-44c0-8d8e-d13d9211808e": {
      id: "95c6eaba-fda4-44c0-8d8e-d13d9211808e",
      name: "Ramesh Tiwari",
      code: "CLM-RAMESH",
      age: 79,
      room_number: "104",
      phone: "9821400274",
      photo_url: "/residents/ramesh.jpg",
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
      code: "CLM-KAMLA",
      age: 74,
      room_number: "108",
      phone: "9821400274",
      photo_url: "/residents/kamla.jpg",
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
      code: "CLM-HARBHAJAN",
      age: 82,
      room_number: "201",
      phone: "9821400274",
      photo_url: "/residents/harbhajan.jpg",
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

export function generateStaticParams() {
  return [
    { id: "95c6eaba-fda4-44c0-8d8e-d13d9211808e" },
    { id: "d9cde304-cad5-4d9c-ab22-2a169e3846d2" },
    { id: "f1e8c218-bf30-44ed-84d4-6a129b12d99d" },
  ];
}

export default async function ResidentDetailPage({ params }: { params: { id: string } }) {
  const resident = await getResident(params.id);
  if (!resident) notFound();

  return <ResidentDetailClient resident={resident} />;
}
