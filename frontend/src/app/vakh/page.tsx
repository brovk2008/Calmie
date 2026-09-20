"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Copy, Check, ExternalLink, Calendar, MessageSquare, RefreshCw, Send, CheckCircle2, ShieldCheck } from "lucide-react";
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

export default function VakhPage() {
  const [seniors, setSeniors] = useState<Senior[]>(DEFAULT_SENIORS);
  const [selectedSenior, setSelectedSenior] = useState<Senior>(DEFAULT_SENIORS[0]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [activeTab, setActiveTab] = useState<"reply" | "form" | "recent">("reply");

  // Booking fields
  const [bookerName, setBookerName] = useState("Vikram Tiwari");
  const [bookerPhone, setBookerPhone] = useState("+919821400274");
  const [customTime, setCustomTime] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("Anjura (Warm Granddaughter)");
  const [customNote, setCustomNote] = useState("Talk about 1983 World Cup and Mohammed Rafi songs");

  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [syncResult, setSyncResult] = useState<any | null>(null);

  useEffect(() => {
    const d = new Date(Date.now() + 30 * 60 * 1000);
    const pad = (n: number) => n.toString().padStart(2, "0");
    const localIso = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    setCustomTime(localIso);
  }, []);

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
        }
      })
      .catch(() => {});
  }, []);

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

  const formattedTimeDisplay = customTime.replace("T", " ");

  const replyTemplateText = `Senior Code: ${selectedSenior.code}
Booker Name: ${bookerName || "Family Member"}
Phone: ${bookerPhone || "+919821400274"}
Time: ${formattedTimeDisplay || "2026-09-20 18:30"}
Voice: ${selectedVoice.split(" ")[0]}
Note: ${customNote || "Thinking of you today"}`;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCopyTemplate = () => {
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

  const handleSync = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/vakh/sync`, { method: "POST" });
      const data = await res.json();
      setSyncResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || "Sync failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header Banner */}
      <div className="border-3 border-black bg-calmie-yellow p-6 sm:p-10 shadow-brutal-xl space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="badge-brutal bg-black text-white text-xs">VAKH PLATFORM INTEGRATION</span>
          <span className="badge-brutal bg-calmie-pink text-white text-xs">AUTOMATED CALL DISPATCH</span>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 bg-emerald-100 border border-emerald-500 px-2.5 py-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
            Live Community Slot Booking Active
          </span>
        </div>
        <h1 className="font-heading font-black text-4xl sm:text-5xl text-calmie-dark">
          Book Senior Calls via Vakh
        </h1>
        <p className="text-gray-800 text-sm sm:text-base font-medium max-w-3xl leading-relaxed">
          Calmie connects community members with elderly care home residents directly through Vakh.
          Every senior has a unique code (e.g., <strong className="font-mono bg-white px-1.5 py-0.5 border border-black">CLM-RAMESH</strong>).
          Reply to our official Vakh post or fill out the Vakh Form with your custom time, and our automated agent will confirm the slot and dial the senior!
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <a
            href={VAKH_POST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pink text-xs sm:text-sm py-2.5 px-5 flex items-center gap-2 shadow-brutal"
          >
            <span>Open Calmie Post on Vakh</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          <a
            href={VAKH_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-white text-xs sm:text-sm py-2.5 px-5 flex items-center gap-2 shadow-brutal"
          >
            <span>Open Direct Vakh Booking Form</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={handleSync}
            disabled={submitting}
            className="btn-white text-xs sm:text-sm py-2.5 px-4 flex items-center gap-1.5 shadow-brutal"
          >
            <RefreshCw className={`w-4 h-4 ${submitting ? "animate-spin" : ""}`} />
            <span>Sync Vakh Submissions</span>
          </button>
        </div>

        {syncResult && (
          <div className="bg-white border-2 border-black p-3 text-xs font-mono shadow-brutal-sm text-emerald-800 font-bold">
            ✓ Synced {syncResult.synced_count || 0} Vakh bookings. {syncResult.errors?.length ? `(${syncResult.errors.length} errors)` : "All valid slots registered!"}
          </div>
        )}
      </div>

      {/* Senior Codes Directory */}
      <div className="space-y-6">
        <div>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-calmie-dark flex items-center gap-2">
            <span>Senior Directory & Codes</span>
            <span className="text-xs font-mono font-bold bg-calmie-cream px-2 py-1 border border-black">
              Step 1: Get Code
            </span>
          </h2>
          <p className="text-gray-600 text-sm font-medium">
            Copy the Senior Code below to include in your Vakh form submission or reply message.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {seniors.map((senior) => {
            const isSelected = selectedSenior.code === senior.code;
            return (
              <div
                key={senior.code}
                onClick={() => setSelectedSenior(senior)}
                className={`card-brutal-hover cursor-pointer p-6 flex flex-col justify-between transition-all bg-white ${
                  isSelected ? "ring-4 ring-calmie-pink shadow-brutal-xl" : ""
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full border-2 border-black overflow-hidden flex-shrink-0">
                      <Image
                        src={senior.photo_url || "/residents/ramesh.jpg"}
                        alt={senior.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-heading font-black text-lg text-calmie-dark leading-tight">
                        {senior.name}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium">
                        Room {senior.room_number || "104"} • {senior.hometown}
                      </p>
                      <span className="inline-block mt-1 badge-brutal bg-calmie-cream text-[10px] text-black">
                        {senior.preferred_lang}
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#fbf9f4] border-2 border-black p-3 space-y-1 text-xs">
                    <p className="font-bold text-gray-600 uppercase text-[10px]">Unique Senior Code:</p>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-base text-calmie-pink">
                        {senior.code}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyCode(senior.code);
                        }}
                        className="btn-white text-[11px] py-1 px-2 flex items-center gap-1 font-bold"
                      >
                        {copiedCode === senior.code ? (
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
                  </div>

                  <p className="text-xs text-gray-600">
                    <strong className="text-calmie-dark">Topics:</strong> {senior.favorite_topics}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-black/10 flex items-center justify-between">
                  <span className="text-xs font-bold text-calmie-dark">
                    {isSelected ? "👉 Active for Booking" : "Click to select"}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSenior(senior);
                    }}
                    className={`text-xs font-bold px-3 py-1.5 border border-black ${
                      isSelected ? "bg-calmie-pink text-white" : "bg-gray-100 hover:bg-calmie-yellow"
                    }`}
                  >
                    Select
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Booking Section */}
      <div className="border-3 border-black bg-white shadow-brutal-xl overflow-hidden">
        <div className="bg-calmie-dark text-white p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-calmie-yellow">
              Step 2 & 3: Submit & Automate
            </span>
            <h3 className="font-heading font-black text-xl sm:text-2xl">
              Book a Call for: {selectedSenior.name} ({selectedSenior.code})
            </h3>
          </div>
          <button
            type="button"
            onClick={() => handleCopyCode(selectedSenior.code)}
            className="btn-yellow text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Code: {selectedSenior.code}</span>
          </button>
        </div>

        {/* Tabs */}
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
            <span>Option 1: Reply on Vakh Post</span>
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
            <span>Option 2: Fill Vakh Form</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("recent")}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
              activeTab === "recent"
                ? "bg-white text-calmie-dark border-b-2 border-b-white -mb-[2px]"
                : "text-gray-500 hover:bg-gray-200"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Vakh Confirmation Log</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 space-y-6">
          {/* Confirmation Banner */}
          {confirmation && (
            <div className="bg-emerald-50 border-3 border-emerald-600 p-5 shadow-brutal-sm space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-heading font-black text-lg">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <span>Slot Successfully Booked via Vakh!</span>
              </div>
              <p className="text-xs text-emerald-950 whitespace-pre-line font-medium bg-white p-4 border border-emerald-300">
                {confirmation.confirmation_text}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-emerald-800">
                <span>Booking ID: {confirmation.booking?.id || confirmation.source_id}</span>
                <span>•</span>
                <span>Scheduled: {confirmation.booking?.scheduled_at}</span>
                <span>•</span>
                <span>Voice: {confirmation.booking?.selected_voice}</span>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-50 border-2 border-red-600 p-3 text-xs text-red-700 font-bold">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* TAB 1: REPLY */}
          {activeTab === "reply" && (
            <div className="space-y-5">
              <div className="bg-calmie-cream border-2 border-black p-4 text-xs text-calmie-dark space-y-2">
                <p className="font-heading font-bold text-sm">How to book by replying on Vakh:</p>
                <p className="text-gray-700 font-medium">
                  We published an instructional post on Vakh (ID: <strong className="font-mono">{VAKH_POST_ID}</strong>).
                  Users can reply to that post with their preferred senior code, phone number, and custom time.
                  Our automated backend parses the reply, schedules the slot, and posts a confirmation reply!
                </p>
              </div>

              {/* Parameter customization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Your Name (Booker):</label>
                  <input
                    type="text"
                    value={bookerName}
                    onChange={(e) => setBookerName(e.target.value)}
                    className="input-brutal py-2 px-3 text-xs w-full"
                    placeholder="e.g. Vikram Tiwari"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Phone (+91...):</label>
                  <input
                    type="tel"
                    value={bookerPhone}
                    onChange={(e) => setBookerPhone(e.target.value)}
                    className="input-brutal py-2 px-3 text-xs w-full"
                    placeholder="+919821400274"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Custom Call Time (Exact):</label>
                  <input
                    type="datetime-local"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    className="input-brutal py-2 px-3 text-xs w-full"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">AI Voice Persona:</label>
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="input-brutal py-2 px-3 text-xs w-full bg-white"
                  >
                    <option value="Anjura (Warm Granddaughter)">Anjura (Warm Granddaughter - Native Hindi)</option>
                    <option value="Priya (Traditional Respectful)">Priya (Traditional Devotional)</option>
                    <option value="Ria (Soft & Soothing)">Ria (Soft Meditative)</option>
                    <option value="Rith (Respectful Grandson)">Rith (Courteous Grandson)</option>
                    <option value="AB (Calm Storyteller)">AB (Nostalgic Storyteller)</option>
                  </select>
                </div>
              </div>

              {/* Template box */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-black uppercase text-gray-700">
                    Formatted Vakh Reply String:
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyTemplate}
                    className="text-xs font-bold text-calmie-pink flex items-center gap-1 hover:underline"
                  >
                    {copiedTemplate ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied Template!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Reply Template</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-black text-emerald-400 font-mono text-xs p-4 border-2 border-black shadow-brutal-sm whitespace-pre-line leading-relaxed">
                  {replyTemplateText}
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleBookViaReply}
                  className="btn-pink py-3.5 px-6 text-sm font-bold flex-1 flex items-center justify-center gap-2 shadow-brutal"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? "Booking via Automation..." : "Submit Reply to Calmie Automation"}</span>
                </button>
                <a
                  href={VAKH_POST_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-white py-3.5 px-6 text-sm font-bold flex items-center justify-center gap-2 shadow-brutal"
                >
                  <span>Open Post on Vakh</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* TAB 2: FORM */}
          {activeTab === "form" && (
            <div className="space-y-5">
              <div className="bg-emerald-50 border-2 border-black p-4 text-xs text-gray-800 space-y-1">
                <p className="font-heading font-bold text-sm text-emerald-900">
                  Calmie Senior Call Slot Bookings Form
                </p>
                <p className="font-medium text-emerald-950">
                  You can submit booking requests using our dedicated Vakh Form (ID: <strong className="font-mono">{VAKH_FORM_ID}</strong>).
                  Set your exact custom time down to the minute.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <label className="block font-bold text-gray-700 mb-1">Special Topics / Notes:</label>
                  <textarea
                    rows={2}
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    className="input-brutal py-2 px-3 text-xs w-full"
                    placeholder="E.g. Ask Dadaji about 1983 cricket or his railway station master days..."
                  />
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleBookViaForm}
                  className="btn-pink py-3.5 px-6 text-sm font-bold flex-1 flex items-center justify-center gap-2 shadow-brutal"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{submitting ? "Booking..." : "Submit Slot via Vakh Form"}</span>
                </button>
                <a
                  href={VAKH_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-white py-3.5 px-6 text-sm font-bold flex items-center justify-center gap-2 shadow-brutal"
                >
                  <span>Open Official Vakh Form on Web</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* TAB 3: CONFIRMATION LOG */}
          {activeTab === "recent" && (
            <div className="space-y-4">
              <div className="bg-yellow-50 border-2 border-black p-4 space-y-2">
                <h4 className="font-heading font-black text-sm text-calmie-dark">
                  Verified Vakh Automated Confirmations
                </h4>
                <p className="text-xs text-gray-700">
                  Here are recent automated confirmations dispatched to Vakh:
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-white border-2 border-black p-4 shadow-brutal-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="badge-brutal bg-emerald-600 text-white text-[10px]">
                      VAKH FORM CONFIRMATION
                    </span>
                    <span className="text-[11px] font-mono text-gray-500">Post ID: 395c267b...</span>
                  </div>
                  <p className="text-xs font-mono bg-[#fbf9f4] p-3 border border-black/20 text-gray-800 whitespace-pre-line">
                    ✅ Slot Confirmed from Vakh Form! Calmie has reserved a call slot for Ramesh Tiwari (CLM-RAMESH) on 2026-09-20 18:30 UTC.
                    Voice Persona: Anjura (Warm Granddaughter)
                    Booker: Meena Tiwari
                    Phone: +919821400274
                    Topics: 1983 Cricket World Cup, Mohammed Rafi songs & railway days
                  </p>
                </div>

                <div className="bg-white border-2 border-black p-4 shadow-brutal-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="badge-brutal bg-calmie-pink text-white text-[10px]">
                      VAKH REPLY CONFIRMATION
                    </span>
                    <span className="text-[11px] font-mono text-gray-500">Post ID: ecff191c...</span>
                  </div>
                  <p className="text-xs font-mono bg-[#fbf9f4] p-3 border border-black/20 text-gray-800 whitespace-pre-line">
                    ✅ Slot Confirmed! Calmie has reserved a call slot for Kamla Devi (CLM-KAMLA) on 2026-09-20 19:00 UTC.
                    Voice Persona: Priya (Sweet Hindi honorifics)
                    Phone: +919821400274
                    Calmie&apos;s AI companion will dial Kamla Devi at the exact scheduled time!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
