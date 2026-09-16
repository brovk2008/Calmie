"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, UserPlus, Heart, Camera } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

const PRESET_AVATARS = [
  { id: "ramesh", label: "Grandfather (Eyeglasses & Kurta)", url: "/residents/ramesh.jpg" },
  { id: "kamla", label: "Grandmother (Saree & Shawl)", url: "/residents/kamla.jpg" },
  { id: "harbhajan", label: "Elder Veteran (Turban & Blazer)", url: "/residents/harbhajan.jpg" }
];

export default function PublishElderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    age: 76,
    room_number: "102",
    phone: "9821400274",
    photo_url: "/residents/ramesh.jpg",
    hometown: "",
    family_notes: "",
    hobbies: "",
    health_notes: "Slight hearing loss, speak clearly",
    personality: "Warm, loves reminiscing, speaks fondly about the old days",
    preferred_lang: "Hindi with some English words",
    favorite_topics: "",
    avoid_topics: "",
    current_routine: "Takes a morning stroll, listens to old radio songs, spends afternoons reading"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      alert("Please provide the senior citizen's full name and phone number.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/residents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          family_notes: `${form.family_notes}. Current daily routine: ${form.current_routine}`
        })
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/residents/${data.id || ""}`);
      } else {
        router.push("/residents");
      }
    } catch (err) {
      console.warn("Error publishing senior profile:", err);
      router.push("/residents");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link
        href="/residents"
        className="inline-flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-calmie-dark hover:text-calmie-pink transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Seniors Directory</span>
      </Link>

      <div className="border-b-3 border-black pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 bg-calmie-yellow border-2 border-black px-3 py-1 font-heading font-black text-xs uppercase tracking-wider shadow-brutal-sm">
          <Heart className="w-3.5 h-3.5 text-red-600 fill-red-600" />
          <span>Public Elder Enrollment</span>
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-calmie-dark">
          Publish an Elder Profile on Calmie
        </h1>
        <p className="text-xs sm:text-sm text-gray-700 max-w-2xl font-medium">
          Have an aging parent, grandparent, or neighbor living in a care home or living alone?
          Register them so compassionate individuals can book AI companion calls that know their stories.
        </p>
      </div>

      <div className="card-brutal p-6 sm:p-10 bg-white border-3 border-black shadow-brutal-xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar / Portrait Selection */}
          <div className="space-y-3">
            <label className="block font-heading font-black text-sm uppercase tracking-wide text-calmie-dark flex items-center gap-2">
              <Camera className="w-4 h-4 text-calmie-pink" />
              <span>1. Choose Portrait Photo</span>
            </label>
            <p className="text-xs text-gray-600">
              Select an authentic senior portrait avatar, or paste a custom photo URL below:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {PRESET_AVATARS.map((av) => {
                const isSelected = form.photo_url === av.url;
                return (
                  <button
                    type="button"
                    key={av.id}
                    onClick={() => setForm({ ...form, photo_url: av.url })}
                    className={`p-3 border-2 border-black text-left flex items-center gap-3 transition-all ${
                      isSelected
                        ? "bg-calmie-yellow shadow-brutal -translate-y-0.5 border-black"
                        : "bg-white hover:bg-calmie-soft"
                    }`}
                  >
                    <div className="relative w-14 h-14 border-2 border-black flex-shrink-0 overflow-hidden">
                      <Image
                        src={av.url}
                        alt={av.label}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs font-bold text-calmie-dark leading-tight">
                      {av.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <span className="text-[11px] font-bold text-gray-600 block mb-1">
                Or Custom Photo URL:
              </span>
              <input
                type="url"
                name="photo_url"
                placeholder="https://example.com/photo.jpg"
                value={form.photo_url}
                onChange={handleChange}
                className="input-brutal text-xs py-2"
              />
            </div>
          </div>

          {/* Basic Identity */}
          <div className="space-y-4 pt-4 border-t-2 border-black">
            <label className="block font-heading font-black text-sm uppercase tracking-wide text-calmie-dark">
              2. Basic Information
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <span className="block text-xs font-bold text-gray-700 mb-1">Senior's Full Name *</span>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Ramesh Chandra Srivastava"
                  value={form.name}
                  onChange={handleChange}
                  className="input-brutal text-sm py-2.5"
                />
              </div>

              <div>
                <span className="block text-xs font-bold text-gray-700 mb-1">Age *</span>
                <input
                  type="number"
                  name="age"
                  required
                  value={form.age}
                  onChange={handleChange}
                  className="input-brutal text-sm py-2.5"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="block text-xs font-bold text-gray-700 mb-1">
                  Phone Number (Twilio Demo Verified) *
                </span>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="9821400274"
                  value={form.phone}
                  onChange={handleChange}
                  className="input-brutal text-sm py-2.5 font-mono-brutal"
                />
                <span className="text-[10px] text-gray-500 mt-1 block">
                  This phone will receive the live AI companion calls.
                </span>
              </div>

              <div>
                <span className="block text-xs font-bold text-gray-700 mb-1">
                  Hometown / City of Origin
                </span>
                <input
                  type="text"
                  name="hometown"
                  placeholder="e.g. Prayagraj, UP / Ludhiana, Punjab"
                  value={form.hometown}
                  onChange={handleChange}
                  className="input-brutal text-sm py-2.5"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="block text-xs font-bold text-gray-700 mb-1">Room / Address</span>
                <input
                  type="text"
                  name="room_number"
                  placeholder="e.g. Room 104, Shanti Niwas"
                  value={form.room_number}
                  onChange={handleChange}
                  className="input-brutal text-sm py-2.5"
                />
              </div>

              <div>
                <span className="block text-xs font-bold text-gray-700 mb-1">Preferred Language</span>
                <select
                  name="preferred_lang"
                  value={form.preferred_lang}
                  onChange={handleChange}
                  className="input-brutal text-sm py-2.5 font-bold"
                >
                  <option value="Hindi with some English words">Hindi with some English words</option>
                  <option value="Hindi (Formal / Devotional)">Hindi (Formal / Devotional)</option>
                  <option value="English and Punjabi mix">English and Punjabi mix</option>
                  <option value="English (Conversational)">English (Conversational)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Life History & What they are doing now */}
          <div className="space-y-4 pt-4 border-t-2 border-black">
            <label className="block font-heading font-black text-sm uppercase tracking-wide text-calmie-dark">
              3. Life History & Current Routine
            </label>

            <div>
              <span className="block text-xs font-bold text-gray-700 mb-1">
                Life History & Career ("What did they do in life?")
              </span>
              <textarea
                rows={3}
                name="hobbies"
                placeholder="e.g. Worked for 35 years as an Indian Railways station master. Loved cricket since 1983 World Cup, loves classic Mohammed Rafi and Kishore Kumar songs..."
                value={form.hobbies}
                onChange={handleChange}
                className="input-brutal text-sm py-2.5"
              />
            </div>

            <div>
              <span className="block text-xs font-bold text-gray-700 mb-1">
                What are they doing now? (Daily routine & habits)
              </span>
              <textarea
                rows={2}
                name="current_routine"
                placeholder="e.g. Wakes up at 6 AM, sits on the balcony with morning tea, waters the tulsi plant, plays evening carrom..."
                value={form.current_routine}
                onChange={handleChange}
                className="input-brutal text-sm py-2.5"
              />
            </div>

            <div>
              <span className="block text-xs font-bold text-gray-700 mb-1">
                Family Context & Visiting Notes
              </span>
              <input
                type="text"
                name="family_notes"
                placeholder="e.g. Son lives in Noida and visits monthly; daughter is abroad in Canada"
                value={form.family_notes}
                onChange={handleChange}
                className="input-brutal text-sm py-2.5"
              />
            </div>
          </div>

          {/* What Cures Their Loneliness & Strict Boundaries */}
          <div className="space-y-4 pt-4 border-t-2 border-black">
            <label className="block font-heading font-black text-sm uppercase tracking-wide text-calmie-dark">
              4. Curing Loneliness & Conversational Boundaries
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="block text-xs font-bold text-emerald-800 mb-1">
                  Topics That Bring Them Joy (Cures Their Loneliness)
                </span>
                <textarea
                  rows={2}
                  name="favorite_topics"
                  placeholder="e.g. 1983 Cricket World Cup, old railway station stories, talking about grandchildren"
                  value={form.favorite_topics}
                  onChange={handleChange}
                  className="input-brutal text-sm py-2.5 bg-emerald-50/50"
                />
              </div>

              <div>
                <span className="block text-xs font-bold text-red-700 mb-1">
                  Strict Boundaries (Topics to AVOID)
                </span>
                <textarea
                  rows={2}
                  name="avoid_topics"
                  placeholder="e.g. Do not mention his late wife Savitri unless he brings her up"
                  value={form.avoid_topics}
                  onChange={handleChange}
                  className="input-brutal text-sm py-2.5 bg-red-50/50"
                />
              </div>
            </div>

            <div>
              <span className="block text-xs font-bold text-blue-800 mb-1">
                Hearing & Health Accommodations for AI
              </span>
              <input
                type="text"
                name="health_notes"
                placeholder="e.g. Slight hearing loss in left ear, speak slightly louder and 10% slower"
                value={form.health_notes}
                onChange={handleChange}
                className="input-brutal text-sm py-2.5 bg-blue-50/50"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6 border-t-2 border-black flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn-pink text-base py-3.5 px-10 flex items-center gap-2 shadow-brutal-lg"
            >
              <UserPlus className="w-5 h-5" />
              <span>{loading ? "Publishing Profile..." : "Publish Senior Profile to Calmie"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
