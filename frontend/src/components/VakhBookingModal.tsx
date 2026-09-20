"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Copy, Check, ExternalLink, Calendar, MessageSquare, RefreshCw, Send, CheckCircle2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

interface Senior {
  id: string;
  name: string;
  code: string;
  room_number?: string;
  photo_url?: string;
  hometown?: string;
  preferred_lang?: string;
  favorite_topics?: string;
}

const DEFAULT_SENIORS: Senior[] = [
  {
    id: "95c6eaba-fda4-44c0-8d8e-d13d9211808e",
    name: "Ramesh Tiwari",
    code: "CLM-RAMESH",
    room_number: "104",
    photo_url: "/residents/ramesh.jpg",
    hometown: "Allahabad (Prayagraj), UP",
    preferred_lang: "Hindi / English",
    favorite_topics: "1983 World Cup, Indian Railways, Mohammed Rafi"
  },
  {
    id: "d9cde304-cad5-4d9c-ab22-2a169e3846d2",
    name: "Kamla Devi",
    code: "CLM-KAMLA",
    room_number: "108",
    photo_url: "/residents/kamla.jpg",
    hometown: "Jaipur, Rajasthan",
    preferred_lang: "Hindi",
    favorite_topics: "Bhakti poetry, Rajasthan memories, balcony garden"
  },
  {
    id: "f1e8c218-bf30-44ed-84d4-6a129b12d99d",
    name: "Col. (Retd.) Harbhajan Singh",
    code: "CLM-HARBHAJAN",
    room_number: "201",
    photo_url: "/residents/harbhajan.jpg",
    hometown: "Ludhiana, Punjab",
    preferred_lang: "English / Punjabi",
    favorite_topics: "1971 war, Indian Army, chess, Sheru the dog"
  }
];

const VAKH_POST_ID = "646247ec-90ef-41d9-8f05-b664cf963ef3";
const VAKH_FORM_ID = "7013e76d-fdb6-43c7-8cc7-9b573f21624e";
const VAKH_POST_URL = `https://xo.vakh.com/post/${VAKH_POST_ID}`;
const VAKH_FORM_URL = `https://xo.vakh.com/form/${VAKH_FORM_ID}`;

interface VakhBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSeniorId?: string;
  initialSeniorCode?: string;
}

export default function VakhBookingModal({
  isOpen,
  onClose,
  initialSeniorId,
  initialSeniorCode
}: VakhBookingModalProps) {
  const [activeTab, setActiveTab] = useState<"reply" | "form" | "sync">("reply");
  const [seniors, setSeniors] = useState<Senior[]>(DEFAULT_SENIORS);
  const [selectedSenior, setSelectedSenior] = useState<Senior>(DEFAULT_SENIORS[0]);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  // Form / Reply state
  const [bookerName, setBookerName] = useState("Vikram Tiwari");
  const [bookerPhone, setBookerPhone] = useState("+919821400274");
  const [customTime, setCustomTime] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("Anjura (Warm Granddaughter)");
  const [customNote, setCustomNote] = useState("Talk about 1983 World Cup and Mohammed Rafi songs");

  // Status state
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [syncResult, setSyncResult] = useState<any | null>(null);

  // Set default custom time to 30 mins from now formatted for datetime-local
  useEffect(() => {
    const d = new Date(Date.now() + 30 * 60 * 1000);
    const pad = (n: number) => n.toString().padStart(2, "0");
    const localIso = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    setCustomTime(localIso);
  }, []);

  // Sync initial senior if provided
  useEffect(() => {
    if (initialSeniorCode) {
      const match = seniors.find((s) => s.code.toUpperCase() === initialSeniorCode.toUpperCase());
      if (match) setSelectedSenior(match);
    } else if (initialSeniorId) {
      const match = seniors.find((s) => s.id === initialSeniorId);
      if (match) setSelectedSenior(match);
    }
  }, [initialSeniorId, initialSeniorCode, seniors]);

  // Fetch live senior list
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/residents`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((d: any) => ({
            id: d.id,
            name: d.name,
            code: d.code || `CLM-${d.name.split(" ")[0].toUpperCase()}`,
            room_number: d.room_number,
            photo_url: d.photo_url || "/residents/ramesh.jpg",
            hometown: d.hometown,
            preferred_lang: d.preferred_lang,
            favorite_topics: d.favorite_topics
          }));
          setSeniors(formatted);
          if (initialSeniorCode) {
            const found = formatted.find((s: Senior) => s.code.toUpperCase() === initialSeniorCode.toUpperCase());
            if (found) setSelectedSenior(found);
          }
        }
      })
      .catch(() => {});
  }, [initialSeniorCode]);

  // When senior changes, update note suggestions
  useEffect(() => {
    if (selectedSenior.code === "CLM-RAMESH") {
      setCustomNote("Talk about 1983 World Cup, Mohammed Rafi songs, and Indian Railways days");
      setSelectedVoice("Anjura (Warm Granddaughter)");
    } else if (selectedSenior.code === "CLM-KAMLA") {
      setCustomNote("Talk to Naniji about her balcony garden and Rajasthan memories");
      setSelectedVoice("Priya (Traditional Respectful)");
    } else if (selectedSenior.code === "CLM-HARBHAJAN") {
      setCustomNote("Discuss Times of India editorials, 1971 military service, and chess");
      setSelectedVoice("Rith (Respectful Grandson)");
    }
  }, [selectedSenior]);

  if (!isOpen) return null;

  const formattedTimeDisplay = customTime.replace("T", " ");

  const replyTemplateText = `Senior Code: ${selectedSenior.code}
Booker Name: ${bookerName || "Family Member"}
Phone: ${bookerPhone || "+919821400274"}
Time: ${formattedTimeDisplay || "2026-09-20 18:30"}
Voice: ${selectedVoice.split(" ")[0]}
Note: ${customNote || "Thinking of you today"}`;

  const copyCode = () => {
    navigator.clipboard.writeText(selectedSenior.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyTemplate = () => {
    navigator.clipboard.writeText(replyTemplateText);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  const handleBookViaReply = async () => {
    setSubmitting(true);
    setErrorMsg(null);
    setConfirmation(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/vakh/book-reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reply_text: replyTemplateText,
          post_id: VAKH_POST_ID
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Booking failed");
      setConfirmation(data);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to process reply booking");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBookViaForm = async () => {
    setSubmitting(true);
    setErrorMsg(null);
    setConfirmation(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/vakh/book-form`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senior_code: selectedSenior.code,
          booker_name: bookerName,
          booker_phone: bookerPhone,
          scheduled_at: customTime,
          selected_voice: selectedVoice.split(" ")[0],
          custom_note: customNote
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Form submission failed");
      setConfirmation(data);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit booking");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSyncVakh = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/vakh/sync`, { method: "POST" });
      const data = await res.json();
      setSyncResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to sync Vakh");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white border-3 border-black shadow-brutal-xl my-8 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-calmie-yellow border-b-3 border-black p-4 sm:p-6 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="badge-brutal bg-black text-white text-[10px] sm:text-xs">
                VAKH AUTOMATION
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-500 px-2 py-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Instant Slot Reservation & Voice Calling
              </span>
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-calmie-dark">
              Book a Call via Vakh Community Hub
            </h2>
            <p className="text-xs sm:text-sm text-gray-700 font-medium">
              Every senior has a unique Senior Code. Book either by replying to our Vakh post or filling out the direct Vakh Form.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-white border-2 border-black hover:bg-calmie-pink hover:text-white transition-colors shadow-brutal-sm"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Senior Selector Bar */}
        <div className="bg-[#fbf9f4] border-b-2 border-black p-4 sm:p-5">
          <label className="block text-xs font-black uppercase tracking-wider text-gray-600 mb-2">
            1. Select Senior & Grab Their Senior Code:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {seniors.map((s) => {
              const isSelected = selectedSenior.code === s.code;
              return (
                <button
                  key={s.code}
                  type="button"
                  onClick={() => {
                    setSelectedSenior(s);
                    setConfirmation(null);
                    setErrorMsg(null);
                  }}
                  className={`text-left p-2.5 border-2 border-black transition-all flex items-center gap-3 ${
                    isSelected
                      ? "bg-calmie-pink text-white shadow-brutal-sm scale-[1.02]"
                      : "bg-white text-calmie-dark hover:bg-yellow-50"
                  }`}
                >
                  <div className="relative w-10 h-10 rounded-full border border-black overflow-hidden flex-shrink-0">
                    <Image
                      src={s.photo_url || "/residents/ramesh.jpg"}
                      alt={s.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-heading font-black text-xs truncate">{s.name}</p>
                    <p className={`text-[10px] font-mono font-bold ${isSelected ? "text-white" : "text-calmie-pink"}`}>
                      {s.code}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Senior Code Pill */}
          <div className="mt-3 bg-white border-2 border-black p-2.5 flex items-center justify-between shadow-brutal-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase">Selected Senior Code:</span>
              <span className="font-mono font-black text-sm bg-calmie-yellow px-2 py-0.5 border border-black text-calmie-dark">
                {selectedSenior.code}
              </span>
              <span className="text-xs font-medium text-gray-600 hidden sm:inline">
                ({selectedSenior.name}, Room {selectedSenior.room_number || "104"})
              </span>
            </div>
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
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b-2 border-black bg-gray-100">
          <button
            type="button"
            onClick={() => setActiveTab("reply")}
            className={`flex-1 py-3 px-4 text-xs sm:text-sm font-heading font-black uppercase tracking-wider flex items-center justify-center gap-2 border-r-2 border-black transition-colors ${
              activeTab === "reply"
                ? "bg-white text-calmie-dark border-b-2 border-b-white -mb-[2px]"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <MessageSquare className="w-4 h-4 text-calmie-pink" />
            <span>Option A: Reply on Vakh Post</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("form")}
            className={`flex-1 py-3 px-4 text-xs sm:text-sm font-heading font-black uppercase tracking-wider flex items-center justify-center gap-2 border-r-2 border-black transition-colors ${
              activeTab === "form"
                ? "bg-white text-calmie-dark border-b-2 border-b-white -mb-[2px]"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Calendar className="w-4 h-4 text-calmie-coral" />
            <span>Option B: Fill Vakh Form</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("sync")}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
              activeTab === "sync"
                ? "bg-white text-calmie-dark border-b-2 border-b-white -mb-[2px]"
                : "text-gray-500 hover:bg-gray-200"
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sync & Status</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto space-y-5">
          {/* Confirmation Banner */}
          {confirmation && (
            <div className="bg-emerald-50 border-3 border-emerald-600 p-4 shadow-brutal-sm space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-heading font-black text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Slot Reserved & Confirmed via Vakh!</span>
              </div>
              <p className="text-xs text-emerald-950 whitespace-pre-line font-medium bg-white p-3 border border-emerald-300">
                {confirmation.confirmation_text || "Slot successfully scheduled in Calmie database!"}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-bold text-emerald-800">
                <span>Booking ID: {confirmation.booking?.id || confirmation.source_id}</span>
                <span>•</span>
                <span>Scheduled: {confirmation.booking?.scheduled_at}</span>
                <span>•</span>
                <span className="text-emerald-700">Automated dialing will trigger at exact time.</span>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-50 border-2 border-red-600 p-3 text-xs text-red-700 font-bold">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* TAB 1: REPLY FORMAT */}
          {activeTab === "reply" && (
            <div className="space-y-4">
              <div className="bg-calmie-cream border-2 border-black p-3.5 text-xs text-calmie-dark space-y-1">
                <p className="font-heading font-bold text-sm">How Reply Booking Works:</p>
                <ol className="list-decimal list-inside space-y-0.5 text-gray-700 font-medium">
                  <li>Copy the pre-formatted reply template below.</li>
                  <li>Paste it as a reply on our official Vakh Post (or submit directly below).</li>
                  <li>Calmie&apos;s AI agent automatically parses your reply, books the slot, posts confirmation feedback, and dials at the exact time!</li>
                </ol>
              </div>

              {/* Template Parameters Editor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Your Name (Booker):</label>
                  <input
                    type="text"
                    value={bookerName}
                    onChange={(e) => setBookerName(e.target.value)}
                    className="input-brutal py-1.5 px-2.5 text-xs w-full"
                    placeholder="e.g. Vikram Tiwari"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Phone (+91...):</label>
                  <input
                    type="tel"
                    value={bookerPhone}
                    onChange={(e) => setBookerPhone(e.target.value)}
                    className="input-brutal py-1.5 px-2.5 text-xs w-full"
                    placeholder="+919821400274"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Custom Call Time (Exact):</label>
                  <input
                    type="datetime-local"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    className="input-brutal py-1.5 px-2.5 text-xs w-full"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">AI Voice Persona:</label>
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="input-brutal py-1.5 px-2.5 text-xs w-full bg-white"
                  >
                    <option value="Anjura (Warm Granddaughter)">Anjura (Warm Granddaughter - Hindi)</option>
                    <option value="Priya (Traditional Respectful)">Priya (Traditional Devotional)</option>
                    <option value="Ria (Soft & Soothing)">Ria (Soft Meditative)</option>
                    <option value="Rith (Respectful Grandson)">Rith (Courteous Grandson)</option>
                    <option value="AB (Calm Storyteller)">AB (Nostalgic Storyteller)</option>
                    <option value="Ashish (Warm Grandson)">Ashish (Cheerful Grandson)</option>
                  </select>
                </div>
              </div>

              {/* Formatted Reply Preview Box */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-black uppercase text-gray-700">
                    Standard Vakh Reply Format:
                  </span>
                  <button
                    type="button"
                    onClick={copyTemplate}
                    className="text-xs font-bold text-calmie-pink flex items-center gap-1 hover:underline"
                  >
                    {copiedTemplate ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied Format!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Format</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="relative bg-black text-emerald-400 font-mono text-xs p-4 border-2 border-black rounded-none shadow-brutal-sm whitespace-pre-line leading-relaxed">
                  {replyTemplateText}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleBookViaReply}
                  className="btn-pink py-3 px-5 text-xs font-bold flex-1 flex items-center justify-center gap-2 shadow-brutal"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? "Booking via Automation..." : "Submit Reply to Vakh Automation"}</span>
                </button>
                <a
                  href={VAKH_POST_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-white py-3 px-5 text-xs font-bold flex items-center justify-center gap-1.5 shadow-brutal"
                >
                  <span>Open Post on Vakh</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* TAB 2: VAKH FORM */}
          {activeTab === "form" && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border-2 border-black p-3 text-xs text-gray-800 space-y-1">
                <p className="font-heading font-bold text-sm text-emerald-900">
                  Calmie Senior Call Slot Bookings Form
                </p>
                <p className="font-medium text-emerald-950">
                  Fill out the form fields with your preferred custom date & time. Our integration accepts the submission and generates instant confirmation!
                </p>
                <p className="font-mono text-[11px] text-gray-600">Vakh Form ID: {VAKH_FORM_ID}</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Senior Code (Required):</label>
                    <input
                      type="text"
                      value={selectedSenior.code}
                      readOnly
                      className="input-brutal py-2 px-3 text-xs w-full bg-gray-100 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Booker Full Name:</label>
                    <input
                      type="text"
                      value={bookerName}
                      onChange={(e) => setBookerName(e.target.value)}
                      className="input-brutal py-2 px-3 text-xs w-full"
                      placeholder="Your Name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Recipient Phone Number:</label>
                    <input
                      type="tel"
                      value={bookerPhone}
                      onChange={(e) => setBookerPhone(e.target.value)}
                      className="input-brutal py-2 px-3 text-xs w-full"
                      placeholder="+919821400274"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Exact Custom Time:</label>
                    <input
                      type="datetime-local"
                      value={customTime}
                      onChange={(e) => setCustomTime(e.target.value)}
                      className="input-brutal py-2 px-3 text-xs w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Voice Persona:</label>
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="input-brutal py-2 px-3 text-xs w-full bg-white"
                  >
                    <option value="Anjura (Warm Granddaughter)">Anjura (Warm Granddaughter - Native Hindi)</option>
                    <option value="Priya (Traditional Respectful)">Priya (Traditional Respectful)</option>
                    <option value="Ria (Soft & Soothing)">Ria (Soft & Soothing)</option>
                    <option value="Rith (Respectful Grandson)">Rith (Courteous Grandson)</option>
                    <option value="AB (Calm Storyteller)">AB (Nostalgic Storyteller)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Custom Notes / Topics to Discuss:</label>
                  <textarea
                    rows={2}
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    className="input-brutal py-2 px-3 text-xs w-full"
                    placeholder="E.g. Ask Dadaji about 1983 cricket or his railway days..."
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleBookViaForm}
                  className="btn-pink py-3 px-5 text-xs font-bold flex-1 flex items-center justify-center gap-2 shadow-brutal"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{submitting ? "Booking..." : "Submit Slot via Vakh Form"}</span>
                </button>
                <a
                  href={VAKH_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-white py-3 px-5 text-xs font-bold flex items-center justify-center gap-1.5 shadow-brutal"
                >
                  <span>Open Official Vakh Form</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* TAB 3: SYNC & STATUS */}
          {activeTab === "sync" && (
            <div className="space-y-4">
              <div className="bg-white border-2 border-black p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading font-black text-sm text-calmie-dark">
                      Calmie × Vakh Integration Pipeline
                    </h3>
                    <p className="text-xs text-gray-600">
                      Polls pending form submissions, parses replies, and confirms slots.
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleSyncVakh}
                    className="btn-yellow py-2 px-4 text-xs font-bold flex items-center gap-1.5 shadow-brutal-sm"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${submitting ? "animate-spin" : ""}`} />
                    <span>Sync Now</span>
                  </button>
                </div>

                {syncResult && (
                  <div className="bg-gray-50 border border-black p-3 text-xs space-y-1 font-mono">
                    <p className="font-bold text-emerald-700">Sync Status: Completed</p>
                    <p>New slots synced: {syncResult.synced_count}</p>
                    <p>Errors: {syncResult.errors?.length || 0}</p>
                  </div>
                )}
              </div>

              {/* Official IDs Reference */}
              <div className="bg-yellow-50 border-2 border-black p-4 text-xs space-y-2">
                <p className="font-heading font-bold text-xs uppercase tracking-wide text-gray-700">
                  Active Vakh Artifacts for Calmie
                </p>
                <div className="space-y-1 font-mono text-[11px] text-gray-800">
                  <p>
                    <strong className="text-black">Instructional Post:</strong> {VAKH_POST_ID}
                  </p>
                  <p>
                    <strong className="text-black">Direct Booking Form:</strong> {VAKH_FORM_ID}
                  </p>
                  <p>
                    <strong className="text-black">Public Form ID:</strong> ef430e27-decc-4a31-8e27-3be0579fa7b5
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#fbf9f4] border-t-2 border-black p-3 sm:p-4 flex items-center justify-between text-xs text-gray-600">
          <span className="font-medium">
            Verified dial line: <strong className="text-calmie-dark">+91 98214 00274</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="font-bold text-calmie-dark hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
