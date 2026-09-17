"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Phone, Calendar, Clock, Volume2, VolumeX, BookOpen, Heart, Check, Sparkles } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

interface Resident {
  id: string;
  name: string;
  age: number;
  room_number: string;
  photo_url: string;
  hometown?: string;
  preferred_lang: string;
  favorite_topics: string;
  avoid_topics?: string;
  hobbies?: string;
  family_notes?: string;
  health_notes?: string;
  personality?: string;
}

const VOICE_OPTIONS = [
  // Female Voices (Super-Human Native Indian & Multilingual)
  {
    id: "aria",
    name: "Anjura (Warm Granddaughter)",
    gender: "female",
    description: "Expressive, bright, loving granddaughter tone with joyful conversational smiles.",
    accent: "Native Hindi / Indian English",
    previewText: "Arey Namaste Dadaji!... Main Calmie bol rahi hoon... Aaj Shanti Niwas mein dhoop badi suhani hai na? Subah ki chai pee li aapne?"
  },
  {
    id: "rachel",
    name: "Ria (Soft & Soothing)",
    gender: "female",
    description: "Ultra-soft, meditative companion rhythm that melts anxiety and brings deep peace.",
    accent: "Gentle, calming Indian cadence",
    previewText: "Namaste ji... Bilkul sukoon se baithiye... Koi jaldi nahi hai, hum aaram se baatein karenge."
  },
  {
    id: "sarah",
    name: "Rashi (Reassuring Companion)",
    gender: "female",
    description: "Warm, comforting care companion listening attentively to health and routine.",
    accent: "Empathetic, caring nurse tone",
    previewText: "Hello ji!... Aapki tabiyat kaisi hai aaj? Dawaai waqt par le li na aapne? Main hamesha aapke saath hoon."
  },
  {
    id: "priya",
    name: "Priya (Traditional Respectful)",
    gender: "female",
    description: "Polite, humble, traditional granddaughter respect register with devotional warmth.",
    accent: "Sweet Hindi honorifics register",
    previewText: "Pranam Naniji!... Radhe Radhe! Main aapse milne ke liye phone kar rahi hoon... Aapse baat karke man khush ho gaya!"
  },
  {
    id: "lily",
    name: "Saanu (Velvety & Peaceful)",
    gender: "female",
    description: "Gentle, tranquil rhythm that creates emotional security and eases loneliness.",
    accent: "Velvety, peaceful rhythm",
    previewText: "Namaste!... Bilkul shaant hokar baithiye... Aaj kya socha aapne? Koi purani meethi si yaad sunaiye na."
  },

  // Male Voices (Super-Human Native Indian & Multilingual)
  {
    id: "brian",
    name: "Rith (Respectful Grandson)",
    gender: "male",
    description: "Warm, respectful, reassuring grandson tone — attentive, courteous, and polite.",
    accent: "Clear, courteous Indian grandson",
    previewText: "Arey Namaste Colonel Sahab!... Kahiye, aaj ka din kaisa chal raha hai? Radio par purane geet sune aapne?"
  },
  {
    id: "george",
    name: "AB (Calm Storyteller)",
    gender: "male",
    description: "Dignified, mature, nostalgic Indian narrator — perfect for reminiscing about old songs & memories.",
    accent: "Deep, nostalgic Indian resonance",
    previewText: "Namaste Ramesh ji!... Radio par 1983 cricket commentary sunne ka waqt ho gaya kya? Mujhe wo kahani sunaiye na!"
  },
  {
    id: "adam",
    name: "Ashish (Warm Grandson)",
    gender: "male",
    description: "Energetic yet gentle, polite, attentive listener who laughs easily and brings joy.",
    accent: "Conversational, cheerful Indian tone",
    previewText: "Namaste Dadaji!... Vikram ne aapko bahut yaad kiya tha... Kahiye, aaj subah balcony mein baithe the aap?"
  },
  {
    id: "daniel",
    name: "Pranab (Deep & Reassuring)",
    gender: "male",
    description: "Deep, fatherly, grounded presence that instills security and calm.",
    accent: "Deep soothing fatherly presence",
    previewText: "Namaste ji... Aap aaram se baithiye... Hum aapse dher saari baatein karenge, koi chinta mat kijiye."
  },
  {
    id: "kabir",
    name: "Arjun (Attentive & Polite)",
    gender: "male",
    description: "Humble Indian English and Hindi mix, deeply respectful and curious listener.",
    accent: "Courteous Indian cadence",
    previewText: "Pranam Uncle ji!... Aapka anubhav aur kisse sunne ke liye main hamesha utsuk rehta hoon. Kahiye kaise hain aap?"
  }
];

const SUGGESTED_CHIPS = [
  "I am visiting you this Sunday!",
  "How are your balcony garden plants doing?",
  "Did you watch the latest cricket match highlights?",
  "Your grandchildren scored 95% in their exams!",
  "Just calling to tell you that the whole family loves you dearly",
  "Take your evening tea peacefully in the garden lawn"
];

export default function BookingClient({ residentId: initialResidentId }: { residentId?: string }) {
  const router = useRouter();
  const [residentId, setResidentId] = useState<string>(initialResidentId || "95c6eaba-fda4-44c0-8d8e-d13d9211808e");

  useEffect(() => {
    if (initialResidentId) {
      setResidentId(initialResidentId);
    } else if (typeof window !== "undefined") {
      const parts = window.location.pathname.split("/");
      const bookIdx = parts.indexOf("book");
      if (bookIdx !== -1 && parts[bookIdx + 1]) {
        setResidentId(parts[bookIdx + 1]);
      }
    }
  }, [initialResidentId]);

  const [resident, setResident] = useState<Resident | null>(null);
  const [loading, setLoading] = useState(false);

  // Form states
  const [bookerName, setBookerName] = useState("");
  const [bookerPhone, setBookerPhone] = useState("");
  const [bookerEmail, setBookerEmail] = useState("");
  const [selectedDay, setSelectedDay] = useState("Today / Immediate Demo Mode");
  const [selectedTime, setSelectedTime] = useState("Morning (10:00 AM – 11:30 AM)");
  const [customNote, setCustomNote] = useState("");

  // Voice Customization states
  const [voiceGender, setVoiceGender] = useState<"female" | "male">("female");
  const [selectedVoice, setSelectedVoice] = useState("Anjura (Warm Granddaughter)");
  const [speakingPace, setSpeakingPace] = useState<"gentle" | "natural">("gentle");
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/residents/${residentId}`)
      .then((res) => res.json())
      .then((data) => setResident(data))
      .catch((err) => {
        console.warn("Using fallback resident:", err);
        setResident({
          id: residentId,
          name: "Ramesh Tiwari",
          age: 79,
          room_number: "104",
          photo_url: "/residents/ramesh.jpg",
          hometown: "Allahabad (Prayagraj), UP",
          preferred_lang: "Hindi with some English words",
          favorite_topics: "1983 Cricket World Cup, Indian Railways, Mohammed Rafi songs",
          avoid_topics: "Passing of his wife Savitri 2 years ago",
          hobbies: "Retired Station Master (35 yrs). Loved cricket and radio commentary.",
          personality: "Talkative, laughs easily, repeats fond memories with joy.",
          health_notes: "Slight hearing loss in left ear. Speak clearly and slightly louder."
        });
      });
  }, [residentId]);

  const availableVoices = VOICE_OPTIONS.filter((v) => v.gender === voiceGender);

  const playVoicePreview = (voiceId: string) => {
    if (typeof window === "undefined") return;

    // If already playing this voice, stop it
    if (playingVoiceId === voiceId) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlayingVoiceId(null);
      return;
    }

    // Stop any previously playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    try {
      const audio = new Audio(`/voices/${voiceId}_v2.mp3`);
      audio.playbackRate = speakingPace === "gentle" ? 0.92 : 1.0;
      audioRef.current = audio;
      setPlayingVoiceId(voiceId);

      audio.onended = () => {
        setPlayingVoiceId(null);
      };

      audio.onpause = () => {
        if (playingVoiceId === voiceId) {
          setPlayingVoiceId(null);
        }
      };

      audio.onerror = (e) => {
        console.error(`Error playing ElevenLabs voice /voices/${voiceId}.mp3:`, e);
        setPlayingVoiceId(null);
      };

      audio.play().catch((err) => {
        console.warn("Audio play failed or blocked by autoplay policy:", err);
        setPlayingVoiceId(null);
      });
    } catch (err) {
      console.error("Audio error:", err);
      setPlayingVoiceId(null);
    }
  };

  const handleApplyChip = (chip: string) => {
    if (customNote.includes(chip)) return;
    setCustomNote((prev) => (prev ? `${prev}. ${chip}` : chip));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookerName.trim() || !bookerPhone.trim()) {
      alert("Please provide your name and contact phone.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resident_id: residentId,
          booker_name: bookerName,
          booker_phone: bookerPhone,
          booker_email: bookerEmail,
          custom_note: customNote,
          scheduled_at: new Date().toISOString(),
          selected_voice: selectedVoice,
          voice_gender: voiceGender,
          speaking_pace: speakingPace
        })
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/booking/${data.id}/confirm`);
      } else {
        router.push(`/booking/demo_${Date.now()}/confirm?resident_id=${residentId}&name=${encodeURIComponent(bookerName)}`);
      }
    } catch (err) {
      console.warn("Offline booking fallback:", err);
      router.push(`/booking/demo_${Date.now()}/confirm?resident_id=${residentId}&name=${encodeURIComponent(bookerName)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link
        href="/residents"
        className="inline-flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-calmie-dark hover:text-calmie-pink transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Cancel & Back</span>
      </Link>

      <div className="border-b-3 border-black pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="badge-brutal bg-calmie-pink text-white text-xs mb-2">
            Schedule AI Companion Call
          </span>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-calmie-dark">
            Book a Warm Call for {resident?.name || "Elder"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Read their life story, customize the voice persona, and write exactly what you want Calmie to convey.
          </p>
        </div>

        <div className="bg-calmie-yellow border-2 border-black p-3 shadow-brutal-sm flex items-center gap-2">
          <Clock className="w-5 h-5 text-black" />
          <div className="text-xs">
            <span className="font-bold text-black block">5 Minutes Max Talk Time</span>
            <span className="text-[11px] text-gray-800">With human-like wrap-up at min 4</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Senior Full Life Story Drawer */}
        <div className="space-y-6">
          <div className="card-brutal p-6 bg-white border-3 border-black space-y-5 shadow-brutal">
            <div className="relative h-60 w-full border-2 border-black overflow-hidden shadow-brutal-sm">
              {resident?.photo_url && (
                <Image
                  src={resident.photo_url}
                  alt={resident?.name || "Senior"}
                  fill
                  className="object-cover"
                />
              )}
              <div className="absolute top-2 right-2 bg-calmie-yellow border border-black font-bold text-[10px] px-2 py-0.5 shadow-brutal-sm">
                Rm {resident?.room_number || "104"}
              </div>
            </div>

            <div>
              <h2 className="font-heading font-black text-2xl text-calmie-dark">
                {resident?.name}, {resident?.age}
              </h2>
              <p className="text-xs text-gray-600 font-medium">{resident?.hometown}</p>
            </div>

            {/* Life Story */}
            <div className="space-y-2 border-t-2 border-black/10 pt-3">
              <span className="text-xs font-heading font-black uppercase text-calmie-dark flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-calmie-pink" />
                <span>Life Story & Past Career</span>
              </span>
              <p className="text-xs text-gray-700 leading-relaxed bg-[#fbf9f4] p-3 border border-black">
                {resident?.hobbies || "Spent a lifetime serving and caring for family. Enjoys old stories."}
              </p>
            </div>

            {/* What Cures Their Loneliness */}
            <div className="space-y-1.5">
              <span className="text-xs font-heading font-black uppercase text-emerald-800 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                <span>What Brings Them Joy</span>
              </span>
              <p className="text-xs text-gray-800 font-medium bg-emerald-50 p-2.5 border border-black">
                🎯 {resident?.favorite_topics}
              </p>
            </div>

            {/* Boundaries & Health */}
            <div className="space-y-2 text-xs">
              {resident?.avoid_topics && (
                <div className="bg-red-50 p-2.5 border border-black text-red-800">
                  <strong>🚫 Strict Boundary:</strong> {resident.avoid_topics}
                </div>
              )}
              {resident?.health_notes && (
                <div className="bg-blue-50 p-2.5 border border-black text-blue-900">
                  <strong>🩺 Hearing Note:</strong> {resident.health_notes}
                </div>
              )}
            </div>

            <div className="bg-calmie-yellow/50 border border-black p-3 text-[11px] font-medium leading-relaxed">
              💡 Calmie is briefed with this entire dossier before dialing.
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Booking Form */}
        <div className="lg:col-span-2 card-brutal p-6 sm:p-8 bg-white border-3 border-black shadow-brutal-xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Voice & Persona Customization */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b-2 border-black pb-2">
                <label className="block font-heading font-black text-base uppercase tracking-wide text-calmie-dark">
                  1. Choose Voice Persona & Gender
                </label>
                <span className="text-xs font-bold text-calmie-pink font-mono-brutal">
                  ElevenLabs Creator Library
                </span>
              </div>

              {/* Gender Selector Toggle */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setVoiceGender("female");
                    setSelectedVoice("Anjura (Warm Granddaughter)");
                  }}
                  className={`p-3 border-2 border-black text-xs font-bold text-center transition-all ${
                    voiceGender === "female"
                      ? "bg-calmie-pink text-white shadow-brutal -translate-y-0.5"
                      : "bg-white hover:bg-calmie-soft text-calmie-dark"
                  }`}
                >
                  👩 Female Voices (Granddaughter Tone)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVoiceGender("male");
                    setSelectedVoice("Rith (Respectful Grandson)");
                  }}
                  className={`p-3 border-2 border-black text-xs font-bold text-center transition-all ${
                    voiceGender === "male"
                      ? "bg-calmie-yellow text-black shadow-brutal -translate-y-0.5"
                      : "bg-white hover:bg-calmie-soft text-calmie-dark"
                  }`}
                >
                  👨 Male Voices (Respectful Grandson Tone)
                </button>
              </div>

              {/* Voice Personas Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <label className="block text-xs font-bold text-gray-700">
                    Select Tone Persona ({availableVoices.length} Available):
                  </label>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-400 px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    Real ElevenLabs Multilingual v2
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                  {availableVoices.map((v) => {
                    const isSelected = selectedVoice === v.name;
                    const isThisPlaying = playingVoiceId === v.id;
                    return (
                      <div
                        key={v.id}
                        className={`p-3 border-2 border-black flex flex-col justify-between gap-2 cursor-pointer transition-all ${
                          isSelected
                            ? "bg-calmie-yellow/70 shadow-brutal border-black -translate-y-0.5"
                            : "bg-white hover:bg-calmie-soft"
                        }`}
                        onClick={() => setSelectedVoice(v.name)}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-heading font-black text-sm text-calmie-dark">
                              {v.name}
                            </span>
                            {isSelected && <Check className="w-4 h-4 text-black stroke-[3]" />}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            <span className="text-[10px] font-bold bg-white px-1.5 py-0.5 border border-black inline-block">
                              {v.accent}
                            </span>
                            <span className="text-[9px] font-extrabold uppercase bg-amber-100 text-amber-900 px-1.5 py-0.5 border border-amber-300 rounded inline-block">
                              ElevenLabs
                            </span>
                          </div>
                          <p className="text-xs text-gray-700 mt-1.5 line-clamp-2">{v.description}</p>
                        </div>

                        <button
                          type="button"
                          id={`sample-btn-${v.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            playVoicePreview(v.id);
                          }}
                          className={`text-[11px] font-bold py-1.5 px-3 flex items-center justify-center gap-1.5 mt-2 transition-all border-2 border-black ${
                            isThisPlaying
                              ? "bg-black text-white shadow-brutal-sm scale-[1.02]"
                              : "btn-white text-[10px] py-1 px-2.5"
                          }`}
                        >
                          {isThisPlaying ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 text-calmie-pink animate-pulse" />
                              <span className="text-calmie-yellow font-heading font-black">Playing ElevenLabs (Click to Stop)</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3 h-3 text-calmie-pink" />
                              <span>Hear Sample</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pacing Preference */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Speech Pacing for Elders:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSpeakingPace("gentle");
                      if (audioRef.current) audioRef.current.playbackRate = 0.92;
                    }}
                    className={`p-2.5 border-2 border-black text-xs font-bold text-left transition-all ${
                      speakingPace === "gentle"
                        ? "bg-emerald-100 border-emerald-900 shadow-brutal-sm"
                        : "bg-white"
                    }`}
                  >
                    🌿 Gentle & Slow (Recommended for hearing clarity)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSpeakingPace("natural");
                      if (audioRef.current) audioRef.current.playbackRate = 1.0;
                    }}
                    className={`p-2.5 border-2 border-black text-xs font-bold text-left transition-all ${
                      speakingPace === "natural"
                        ? "bg-emerald-100 border-emerald-900 shadow-brutal-sm"
                        : "bg-white"
                    }`}
                  >
                    ⚡ Natural Conversational Pace
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2: What to Convey (THE CORE USER REQUEST) */}
            <div className="space-y-3 pt-4 border-t-2 border-black bg-amber-50/50 p-5 border-2 border-black">
              <div className="flex items-center justify-between">
                <label className="block font-heading font-black text-base uppercase tracking-wide text-calmie-dark flex items-center gap-1.5">
                  <span>📝 2. What to Convey Through This Call</span>
                </label>
                <span className="badge-brutal bg-calmie-yellow text-[10px]">
                  AI Conversational Mission
                </span>
              </div>
              <p className="text-xs text-gray-700">
                Write what you want Calmie to say, ask about, or mention during the call.
                Calmie will introduce this naturally like a loving family member.
              </p>

              {/* Quick Suggestion Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {SUGGESTED_CHIPS.map((chip, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => handleApplyChip(chip)}
                    className="text-[11px] font-bold bg-white border border-black px-2.5 py-1 hover:bg-calmie-yellow transition-colors shadow-brutal-sm text-left"
                  >
                    + {chip}
                  </button>
                ))}
              </div>

              <textarea
                rows={4}
                required
                placeholder="e.g. Tell Dadaji that Vikram is visiting this Sunday with his favorite sweets, ask him about how his balcony flowers are growing, and remind him to take his afternoon rest..."
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                className="input-brutal text-sm py-2.5 bg-white"
              />
            </div>

            {/* Step 3: Calling Window */}
            <div className="space-y-3 pt-4 border-t-2 border-black">
              <label className="block font-heading font-black text-base uppercase tracking-wide text-calmie-dark">
                3. Calling Window
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Today / Immediate Demo Mode",
                  "Tomorrow Morning",
                  "This Coming Weekend"
                ].map((d) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => setSelectedDay(d)}
                    className={`p-3 border-2 border-black text-xs font-bold text-left transition-all ${
                      selectedDay === d
                        ? "bg-calmie-yellow shadow-brutal -translate-y-0.5"
                        : "bg-white hover:bg-calmie-soft"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{d}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  "Morning (10:00 AM – 11:30 AM)",
                  "Afternoon Tea (04:00 PM – 05:30 PM)",
                  "Evening Post-Dinner (07:00 PM – 08:00 PM)"
                ].map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`p-3 border-2 border-black text-xs font-bold text-left transition-all ${
                      selectedTime === t
                        ? "bg-calmie-pink text-white shadow-brutal -translate-y-0.5"
                        : "bg-white hover:bg-calmie-soft text-calmie-dark"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{t}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Booker Contact */}
            <div className="space-y-4 pt-4 border-t-2 border-black">
              <label className="block font-heading font-black text-base uppercase tracking-wide text-calmie-dark">
                4. Your Booker Information
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs font-bold text-gray-700 mb-1">Your Full Name *</span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Tiwari (Son) / Priya S."
                    value={bookerName}
                    onChange={(e) => setBookerName(e.target.value)}
                    className="input-brutal text-sm py-2.5"
                  />
                </div>
                <div>
                  <span className="block text-xs font-bold text-gray-700 mb-1">Your Phone Number *</span>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98214 00274"
                    value={bookerPhone}
                    onChange={(e) => setBookerPhone(e.target.value)}
                    className="input-brutal text-sm py-2.5 font-mono-brutal"
                  />
                </div>
              </div>

              <div>
                <span className="block text-xs font-bold text-gray-700 mb-1">
                  Email for Call Summary & Vakh Digest (Optional)
                </span>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={bookerEmail}
                  onChange={(e) => setBookerEmail(e.target.value)}
                  className="input-brutal text-sm py-2.5"
                />
              </div>
            </div>

            {/* 5-Min Limit Notice & Submit */}
            <div className="pt-6 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-gray-600 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Call will dial <strong>+91 98214 00274</strong> (Max 5 mins duration).</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-pink text-base py-3.5 px-8 flex items-center gap-2 shadow-brutal-lg w-full sm:w-auto justify-center"
              >
                <Phone className="w-4 h-4 fill-white" />
                <span>{loading ? "Saving Booking..." : "Schedule Call & Proceed"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
