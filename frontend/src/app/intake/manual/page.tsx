"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Loader2, CheckCircle } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://calmie-lol.vercel.app";

const STEPS = ["Basic Info", "Life Story", "Health & Family", "Review"];

interface FormData {
  name: string;
  age: string;
  room_number: string;
  phone: string;
  hometown: string;
  preferred_lang: string;
  hobbies: string;
  favorite_topics: string;
  avoid_topics: string;
  health_notes: string;
  family_notes: string;
  personality: string;
  emergency_contact: string;
}

const EMPTY: FormData = {
  name: "", age: "", room_number: "", phone: "", hometown: "",
  preferred_lang: "", hobbies: "", favorite_topics: "", avoid_topics: "",
  health_notes: "", family_notes: "", personality: "", emergency_contact: "",
};

function Field({ label, name, value, onChange, hint, multiline = false, required = false }: {
  label: string; name: keyof FormData; value: string; onChange: (n: keyof FormData, v: string) => void;
  hint?: string; multiline?: boolean; required?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {hint && <p className="text-[11px] text-gray-400">{hint}</p>}
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="w-full border-2 border-black px-3 py-2 text-sm focus:outline-none focus:border-calmie-pink bg-white resize-none"
          placeholder={hint}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="w-full border-2 border-black px-3 py-2 text-sm focus:outline-none focus:border-calmie-pink bg-white"
          placeholder={hint}
        />
      )}
    </div>
  );
}

export default function ManualIntakePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const update = (name: keyof FormData, value: string) =>
    setForm((f) => ({ ...f, [name]: value }));

  const canNext = () => {
    if (step === 0) return form.name.trim().length > 1;
    return true;
  };

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...form,
        age: form.age ? parseInt(form.age) : null,
      };
      const res = await fetch(`${API_BASE}/api/intake/resident`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Submission failed. Please try again.");
        setLoading(false);
        return;
      }
      setDone(true);
    } catch (e) {
      setError("Network error — please check your connection.");
    }
    setLoading(false);
  };

  if (done) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-calmie-yellow border-3 border-black flex items-center justify-center mx-auto shadow-brutal">
          <CheckCircle className="w-10 h-10 text-calmie-dark" />
        </div>
        <h1 className="font-heading font-black text-3xl text-calmie-dark">Resident Added!</h1>
        <p className="text-gray-600">
          <strong>{form.name}</strong> has been added to the Calmie platform.
          They'll appear in the residents directory shortly.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => { setForm(EMPTY); setStep(0); setDone(false); }}
            className="btn-white py-3 px-6 border-2 border-black font-bold"
          >
            Add Another Resident
          </button>
          <button
            onClick={() => router.push("/residents")}
            className="btn-pink py-3 px-6 font-bold shadow-brutal"
          >
            View Residents Directory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => step > 0 ? setStep(s => s - 1) : router.push("/intake")} className="p-2 border-2 border-black hover:bg-calmie-yellow transition">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="font-heading font-black text-2xl text-calmie-dark">Add Resident Manually</h1>
          <p className="text-xs text-gray-500 mt-0.5">Step {step + 1} of {STEPS.length}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`w-8 h-8 border-2 border-black flex items-center justify-center text-xs font-black transition-colors flex-shrink-0
              ${i < step ? "bg-calmie-yellow" : i === step ? "bg-calmie-pink text-white" : "bg-white text-gray-400"}`}>
              {i < step ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <div className={`hidden sm:block text-[10px] font-bold ml-1.5 uppercase tracking-wide ${i === step ? "text-calmie-pink" : "text-gray-400"}`}>
              {s}
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < step ? "bg-calmie-yellow" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      {/* Form card */}
      <div className="card-brutal border-3 border-black bg-white shadow-brutal-lg p-6 sm:p-8 space-y-5">
        <h2 className="font-heading font-black text-lg text-calmie-dark border-b-2 border-black pb-2">
          {STEPS[step]}
        </h2>

        {step === 0 && (
          <>
            <Field label="Full Name" name="name" value={form.name} onChange={update} hint="As on Aadhaar card" required />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Age" name="age" value={form.age} onChange={update} hint="Years" />
              <Field label="Room Number" name="room_number" value={form.room_number} onChange={update} hint="e.g., 104" />
            </div>
            <Field label="Phone Number" name="phone" value={form.phone} onChange={update} hint="10-digit mobile number" required />
            <Field label="Emergency Contact" name="emergency_contact" value={form.emergency_contact} onChange={update} hint="Name & phone of family member to notify" />
          </>
        )}

        {step === 1 && (
          <>
            <Field label="Hometown / City of Origin" name="hometown" value={form.hometown} onChange={update} hint="Where they grew up" />
            <Field label="Languages Spoken" name="preferred_lang" value={form.preferred_lang} onChange={update} hint="e.g., Hindi, English, Punjabi" />
            <Field label="Hobbies & Interests" name="hobbies" value={form.hobbies} onChange={update} hint="Cricket, bhajan singing, chess…" multiline />
            <Field label="Favorite Topics to Discuss" name="favorite_topics" value={form.favorite_topics} onChange={update} hint="Stories they love telling, memories, subjects" multiline />
            <Field label="Topics to Avoid" name="avoid_topics" value={form.avoid_topics} onChange={update} hint="Sensitive areas — deceased relatives, estrangements etc." />
          </>
        )}

        {step === 2 && (
          <>
            <Field label="Personality Description" name="personality" value={form.personality} onChange={update}
              hint="Calm? Talkative? Formal? Loves jokes? Warms up when asked about X?" multiline />
            <Field label="Health Notes" name="health_notes" value={form.health_notes} onChange={update}
              hint="Hearing loss, memory, mobility issues, conditions the AI should know" multiline />
            <Field label="Family Notes" name="family_notes" value={form.family_notes} onChange={update}
              hint="Who visits, who calls, family dynamics, how often they're in touch" multiline />
          </>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Please review the information before submitting.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                ["Name", form.name], ["Age", form.age], ["Room", form.room_number],
                ["Phone", form.phone], ["Hometown", form.hometown], ["Languages", form.preferred_lang],
                ["Emergency Contact", form.emergency_contact],
              ].map(([label, val]) => val ? (
                <div key={label} className="bg-gray-50 border border-gray-200 p-2.5 rounded">
                  <p className="text-gray-400 uppercase tracking-wide text-[10px]">{label}</p>
                  <p className="font-semibold text-gray-800 mt-0.5">{val}</p>
                </div>
              ) : null)}
            </div>
            {form.personality && (
              <div className="bg-gray-50 border border-gray-200 p-2.5 rounded text-xs">
                <p className="text-gray-400 uppercase tracking-wide text-[10px]">Personality</p>
                <p className="text-gray-700 mt-0.5">{form.personality}</p>
              </div>
            )}
            {form.health_notes && (
              <div className="bg-blue-50 border border-blue-200 p-2.5 rounded text-xs">
                <p className="text-blue-500 uppercase tracking-wide text-[10px]">Health Notes</p>
                <p className="text-gray-700 mt-0.5">{form.health_notes}</p>
              </div>
            )}
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
          </div>
        )}
      </div>

      {/* Nav buttons */}
      <div className="flex gap-3 justify-between">
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          className="btn-white py-3 px-6 border-2 border-black font-bold disabled:opacity-30"
        >
          Back
        </button>
        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!canNext()}
            className="btn-pink py-3 px-8 font-bold shadow-brutal flex items-center gap-2 disabled:opacity-40"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={loading || !form.name}
            className="btn-pink py-3 px-8 font-bold shadow-brutal flex items-center gap-2 disabled:opacity-40"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : <><Check className="w-4 h-4" /> Save Resident</>}
          </button>
        )}
      </div>
    </div>
  );
}
