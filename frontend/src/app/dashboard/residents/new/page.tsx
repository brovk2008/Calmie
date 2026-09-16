"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, UserPlus } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

export default function NewResidentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    age: 78,
    room_number: "",
    phone: "9821400274",
    photo_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80",
    hometown: "",
    family_notes: "",
    hobbies: "",
    health_notes: "",
    personality: "",
    preferred_lang: "Hindi with some English words",
    favorite_topics: "",
    avoid_topics: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("Please enter the elder's full name.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/residents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        router.push("/residents");
      } else {
        router.push("/residents");
      }
    } catch (e) {
      console.warn("Backend error, redirecting:", e);
      router.push("/residents");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-calmie-dark hover:text-calmie-pink transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Caseworker Console</span>
      </Link>

      <div className="border-b-3 border-black pb-6">
        <span className="badge-brutal bg-calmie-yellow text-black text-xs mb-2">
          Elder Care Onboarding
        </span>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-calmie-dark">
          Enroll a New Senior Citizen
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          The details you provide here are injected directly into Calmie&apos;s conversational intelligence
          so that every call feels like talking to a lifelong companion.
        </p>
      </div>

      <div className="card-brutal p-6 sm:p-8 bg-white border-3 border-black shadow-brutal-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Smt. Pushpa Sharma"
                value={form.name}
                onChange={handleChange}
                className="input-brutal text-sm py-2.5"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Age *
              </label>
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
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Room Number *
              </label>
              <input
                type="text"
                name="room_number"
                placeholder="e.g. 112"
                value={form.room_number}
                onChange={handleChange}
                className="input-brutal text-sm py-2.5"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Phone Number (Twilio Demo Verified) *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={form.phone}
                onChange={handleChange}
                className="input-brutal text-sm py-2.5 font-mono-brutal"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Hometown / Roots
              </label>
              <input
                type="text"
                name="hometown"
                placeholder="e.g. Varanasi, Uttar Pradesh"
                value={form.hometown}
                onChange={handleChange}
                className="input-brutal text-sm py-2.5"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Preferred Language
              </label>
              <select
                name="preferred_lang"
                value={form.preferred_lang}
                onChange={handleChange}
                className="input-brutal text-sm py-2.5 font-bold"
              >
                <option value="Hindi with some English words">Hindi with English words</option>
                <option value="Hindi (Formal)">Hindi (Formal)</option>
                <option value="English and Punjabi mix">English and Punjabi mix</option>
                <option value="Bengali / Hindi mix">Bengali / Hindi mix</option>
              </select>
            </div>
          </div>

          {/* Life History & Personality */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
              Personality & Conversational Style
            </label>
            <textarea
              rows={2}
              name="personality"
              placeholder="e.g. Gentle, loves laughing, speaks softly, enjoys sharing school memories..."
              value={form.personality}
              onChange={handleChange}
              className="input-brutal text-sm py-2.5"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
              Hobbies & Lifelong Passions
            </label>
            <input
              type="text"
              name="hobbies"
              placeholder="e.g. Classical sitar music, gardening, solving crosswords, cooking recipes..."
              value={form.hobbies}
              onChange={handleChange}
              className="input-brutal text-sm py-2.5"
            />
          </div>

          {/* Strict Boundaries & Health Accommodations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-emerald-800 mb-1">
                Favorite Topics to Cherish (Recommended)
              </label>
              <textarea
                rows={2}
                name="favorite_topics"
                placeholder="e.g. Her grandchildren's achievements, Banaras ghat memories, sweet dishes..."
                value={form.favorite_topics}
                onChange={handleChange}
                className="input-brutal text-sm py-2.5 bg-emerald-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-red-700 mb-1">
                Strict Topics to Avoid (Boundaries)
              </label>
              <textarea
                rows={2}
                name="avoid_topics"
                placeholder="e.g. Medical treatments or stressful family disputes..."
                value={form.avoid_topics}
                onChange={handleChange}
                className="input-brutal text-sm py-2.5 bg-red-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-blue-800 mb-1">
              Health, Hearing & Communication Accommodations
            </label>
            <input
              type="text"
              name="health_notes"
              placeholder="e.g. Speak slowly, slight hearing loss, pauses to catch breath..."
              value={form.health_notes}
              onChange={handleChange}
              className="input-brutal text-sm py-2.5 bg-blue-50/50"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 border-t-2 border-black flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn-pink text-sm py-3.5 px-8 flex items-center gap-2 shadow-brutal-lg"
            >
              <UserPlus className="w-4 h-4" />
              <span>{loading ? "Enrolling Elder..." : "Enroll Resident & Enable Calling"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
