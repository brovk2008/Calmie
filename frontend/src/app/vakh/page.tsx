"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Copy,
  Check,
  ExternalLink,
  Calendar,
  MessageSquare,
  RefreshCw,
  Send,
  CheckCircle2,
  ShieldCheck,
  PenSquare,
  Heart,
  Sparkles,
  PhoneCall
} from "lucide-react";
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

interface CommunityPost {
  id: string;
  form_id?: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  title: string;
  content: string;
  category: string;
  senior_code?: string | null;
  senior_name?: string | null;
  heart_count: number;
  created_at: string;
  status: string;
}

interface AutomatedResponse {
  id: string;
  booking_id: string;
  senior_code: string;
  senior_name: string;
  booker_name: string;
  phone: string;
  scheduled_at: string;
  voice: string;
  status: string;
  confirmation_text: string;
  source_type?: string;
  timestamp: string;
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
const VAKH_CALMIE_FORM_ID = "ef430e27-decc-4a31-8e27-3be0579fa7b5";
const VAKH_BOOKING_FORM_ID = "7013e76d-fdb6-43c7-8cc7-9b573f21624e";

const VAKH_CALMIE_FORM_URL = `https://xo.vakh.com/form/${VAKH_CALMIE_FORM_ID}`;
const VAKH_BOOKING_FORM_URL = `https://xo.vakh.com/form/${VAKH_BOOKING_FORM_ID}`;
const VAKH_POST_URL = `https://xo.vakh.com/post/${VAKH_POST_ID}`;

export default function VakhPage() {
  const [seniors, setSeniors] = useState<Senior[]>(DEFAULT_SENIORS);
  const [selectedSenior, setSelectedSenior] = useState<Senior>(DEFAULT_SENIORS[0]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [activeTab, setActiveTab] = useState<"feed" | "write" | "reply" | "form" | "responses">("feed");

  // Post creation state
  const [postAuthor, setPostAuthor] = useState("Vikram Tiwari");
  const [postTitle, setPostTitle] = useState("");
  const [postCategory, setPostCategory] = useState("care_update");
  const [postSeniorCode, setPostSeniorCode] = useState("CLM-RAMESH");
  const [postContent, setPostContent] = useState("");
  const [postingStatus, setPostingStatus] = useState<string | null>(null);

  // Feed & responses data
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [responses, setResponses] = useState<AutomatedResponse[]>([]);
  const [feedCategoryFilter, setFeedCategoryFilter] = useState("all");
  const [feedSeniorFilter, setFeedSeniorFilter] = useState("all");
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

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

  // Fetch residents
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

  // Load posts and responses
  const loadPostsAndResponses = () => {
    fetch(`${API_BASE_URL}/api/vakh/posts`)
      .then((res) => res.json())
      .then((data) => {
        if (data.posts && Array.isArray(data.posts)) {
          setPosts(data.posts);
        }
      })
      .catch(() => {});

    fetch(`${API_BASE_URL}/api/vakh/responses`)
      .then((res) => res.json())
      .then((data) => {
        if (data.responses && Array.isArray(data.responses)) {
          setResponses(data.responses);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadPostsAndResponses();
  }, []);

  useEffect(() => {
    if (selectedSenior.code === "CLM-RAMESH") {
      setCustomNote("Talk about 1983 World Cup, Mohammed Rafi songs, and Indian Railways days");
      setSelectedVoice("Anjura (Warm Granddaughter)");
      setPostSeniorCode("CLM-RAMESH");
    } else if (selectedSenior.code === "CLM-KAMLA") {
      setCustomNote("Talk to Naniji about her balcony garden and Rajasthan memories");
      setSelectedVoice("Priya (Traditional Respectful)");
      setPostSeniorCode("CLM-KAMLA");
    } else if (selectedSenior.code === "CLM-HARBHAJAN") {
      setCustomNote("Discuss Times of India editorials, 1971 military service, and chess");
      setSelectedVoice("Rith (Respectful Grandson)");
      setPostSeniorCode("CLM-HARBHAJAN");
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

  // 1. Submit a community post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) {
      setErrorMsg("Please enter content for your post.");
      return;
    }
    setSubmitting(true);
    setErrorMsg(null);
    setPostingStatus("Publishing your post to Calmie feed...");

    try {
      const res = await fetch(`${API_BASE_URL}/api/vakh/create-post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author_name: postAuthor || "Calmie Contributor",
          title: postTitle || undefined,
          content: postContent,
          senior_code: postSeniorCode === "general" ? null : postSeniorCode,
          category: postCategory
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to publish post.");

      setPostingStatus("✓ Post successfully published to Calmie feed!");
      setPostContent("");
      setPostTitle("");
      // Add immediately to feed
      if (data.post) {
        setPosts((prev) => [data.post, ...prev]);
      }
      setTimeout(() => {
        setActiveTab("feed");
        setPostingStatus(null);
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || "Could not publish post.");
      setPostingStatus(null);
    } finally {
      setSubmitting(false);
    }
  };

  // 2. Book via Reply
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
      loadPostsAndResponses();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to process reply booking");
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Book via Form
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
      loadPostsAndResponses();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit booking");
    } finally {
      setSubmitting(false);
    }
  };

  // 4. Sync
  const handleSync = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/vakh/sync`, { method: "POST" });
      const data = await res.json();
      setSyncResult(data);
      loadPostsAndResponses();
    } catch (err: any) {
      setErrorMsg(err.message || "Sync failed");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleHeart = (postId: string) => {
    setLikedPosts((prev) => {
      const current = !!prev[postId];
      return { ...prev, [postId]: !current };
    });
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const delta = likedPosts[postId] ? -1 : 1;
          return { ...p, heart_count: Math.max(0, p.heart_count + delta) };
        }
        return p;
      })
    );
  };

  const handleQuickBookForSenior = (seniorCode: string) => {
    const s = seniors.find((item) => item.code === seniorCode);
    if (s) {
      setSelectedSenior(s);
    }
    setActiveTab("reply");
  };

  const filteredPosts = posts.filter((p) => {
    const matchCat = feedCategoryFilter === "all" || p.category === feedCategoryFilter;
    const matchSenior =
      feedSeniorFilter === "all" ||
      (p.senior_code && p.senior_code.toUpperCase() === feedSeniorFilter.toUpperCase());
    return matchCat && matchSenior;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="border-3 border-black bg-calmie-yellow p-6 sm:p-8 shadow-brutal-xl space-y-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="badge-brutal bg-black text-white text-xs">VAKH PLATFORM INTEGRATION</span>
          <span className="badge-brutal bg-calmie-pink text-white text-xs">FORM: CALMIE</span>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 bg-emerald-100 border border-emerald-500 px-2.5 py-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
            Live Community Posting & Slot Booking
          </span>
        </div>

        <h1 className="font-heading font-black text-3xl sm:text-5xl text-calmie-dark">
          Calmie Community & Vakh Hub
        </h1>

        <p className="text-gray-800 text-sm sm:text-base font-medium max-w-3xl leading-relaxed">
          Write updates, post memories, book companion phone calls, and review real-time feedback.
          Everything connects to the official <strong>Calmie</strong> form on Vakh. Every senior has a unique code
          (e.g., <strong className="font-mono bg-white px-1.5 py-0.5 border border-black">CLM-RAMESH</strong>).
        </p>

        {/* Action / Vakh links */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => setActiveTab("write")}
            className="btn-pink text-xs sm:text-sm py-2.5 px-5 flex items-center gap-2 shadow-brutal"
          >
            <PenSquare className="w-4 h-4" />
            <span>Write a Post on Calmie</span>
          </button>
          <a
            href={VAKH_CALMIE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-white text-xs sm:text-sm py-2.5 px-4 flex items-center gap-2 shadow-brutal"
          >
            <span>Open &quot;Calmie&quot; on Vakh</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href={VAKH_BOOKING_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-white text-xs sm:text-sm py-2.5 px-4 flex items-center gap-2 shadow-brutal"
          >
            <span>Open Booking Form on Vakh</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={handleSync}
            disabled={submitting}
            className="btn-white text-xs sm:text-sm py-2.5 px-4 flex items-center gap-1.5 shadow-brutal"
          >
            <RefreshCw className={`w-4 h-4 ${submitting ? "animate-spin" : ""}`} />
            <span>Sync Vakh</span>
          </button>
        </div>

        {syncResult && (
          <div className="bg-white border-2 border-black p-3 text-xs font-mono shadow-brutal-sm text-emerald-800 font-bold">
            ✓ Synced {syncResult.synced_count || 0} Vakh bookings. All valid slots registered!
          </div>
        )}
      </div>

      {/* Senior Codes Directory */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-heading font-black text-2xl text-calmie-dark flex items-center gap-2">
              <span>Senior Directory & Codes</span>
              <span className="text-xs font-mono font-bold bg-calmie-cream px-2 py-0.5 border border-black">
                Directory
              </span>
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm font-medium">
              Copy a code to tag in your post or book an automated phone call.
            </p>
          </div>
          <button
            onClick={() => setActiveTab("write")}
            className="btn-yellow text-xs py-2 px-3 self-start sm:self-auto font-bold flex items-center gap-1.5"
          >
            <PenSquare className="w-3.5 h-3.5" />
            <span>Write Post for Senior</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {seniors.map((senior) => {
            const isSelected = selectedSenior.code === senior.code;
            return (
              <div
                key={senior.code}
                onClick={() => setSelectedSenior(senior)}
                className={`card-brutal-hover cursor-pointer p-5 flex flex-col justify-between transition-all bg-white ${
                  isSelected ? "ring-4 ring-calmie-pink shadow-brutal-xl" : ""
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-full border-2 border-black overflow-hidden flex-shrink-0">
                      <Image
                        src={senior.photo_url || "/residents/ramesh.jpg"}
                        alt={senior.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-heading font-black text-base text-calmie-dark leading-tight">
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

                  <div className="bg-[#fbf9f4] border-2 border-black p-2.5 space-y-1 text-xs">
                    <p className="font-bold text-gray-600 uppercase text-[10px]">Senior Code:</p>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-sm text-calmie-pink">
                        {senior.code}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyCode(senior.code);
                        }}
                        className="btn-white text-[11px] py-0.5 px-2 flex items-center gap-1 font-bold"
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

                  <p className="text-xs text-gray-600 line-clamp-2">
                    <strong className="text-calmie-dark">Topics:</strong> {senior.favorite_topics}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-black/10 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickBookForSenior(senior.code);
                    }}
                    className="text-xs font-bold px-2.5 py-1 bg-calmie-yellow hover:bg-yellow-400 border border-black flex items-center gap-1"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>Book Call</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSenior(senior);
                      setPostSeniorCode(senior.code);
                      setActiveTab("write");
                    }}
                    className="text-xs font-bold px-2.5 py-1 bg-gray-100 hover:bg-calmie-pink hover:text-white border border-black flex items-center gap-1"
                  >
                    <PenSquare className="w-3 h-3" />
                    <span>Post Note</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Workstation Tabs */}
      <div className="border-3 border-black bg-white shadow-brutal-xl overflow-hidden">
        {/* Navigation Bar for Tabs */}
        <div className="flex border-b-2 border-black bg-gray-100 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("feed")}
            className={`py-3.5 px-4 sm:px-6 text-xs sm:text-sm font-heading font-black uppercase tracking-wider flex items-center gap-2 border-r-2 border-black whitespace-nowrap transition-colors ${
              activeTab === "feed"
                ? "bg-white text-calmie-dark border-b-2 border-b-white -mb-[2px]"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Sparkles className="w-4 h-4 text-calmie-coral" />
            <span>📰 Calmie Feed ({posts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("write")}
            className={`py-3.5 px-4 sm:px-6 text-xs sm:text-sm font-heading font-black uppercase tracking-wider flex items-center gap-2 border-r-2 border-black whitespace-nowrap transition-colors ${
              activeTab === "write"
                ? "bg-white text-calmie-dark border-b-2 border-b-white -mb-[2px]"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <PenSquare className="w-4 h-4 text-calmie-pink" />
            <span>✍️ Write a Post</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("reply")}
            className={`py-3.5 px-4 sm:px-6 text-xs sm:text-sm font-heading font-black uppercase tracking-wider flex items-center gap-2 border-r-2 border-black whitespace-nowrap transition-colors ${
              activeTab === "reply"
                ? "bg-white text-calmie-dark border-b-2 border-b-white -mb-[2px]"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <MessageSquare className="w-4 h-4 text-calmie-pink" />
            <span>💬 Book via Reply</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("form")}
            className={`py-3.5 px-4 sm:px-6 text-xs sm:text-sm font-heading font-black uppercase tracking-wider flex items-center gap-2 border-r-2 border-black whitespace-nowrap transition-colors ${
              activeTab === "form"
                ? "bg-white text-calmie-dark border-b-2 border-b-white -mb-[2px]"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>📋 Direct Form</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("responses")}
            className={`py-3.5 px-4 sm:px-6 text-xs sm:text-sm font-heading font-black uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === "responses"
                ? "bg-white text-calmie-dark border-b-2 border-b-white -mb-[2px]"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>🤖 Responses ({responses.length})</span>
          </button>
        </div>

        {/* Global Notifications */}
        <div className="p-6 space-y-6">
          {confirmation && (
            <div className="bg-emerald-50 border-3 border-emerald-600 p-5 shadow-brutal-sm space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-heading font-black text-lg">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <span>Slot Successfully Reserved on Calmie & Vakh!</span>
              </div>
              <p className="text-xs text-emerald-950 whitespace-pre-line font-mono font-medium bg-white p-4 border border-emerald-300">
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
            <div className="bg-red-50 border-2 border-red-600 p-3.5 text-xs text-red-700 font-bold">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 1: CALMIE COMMUNITY FEED */}
          {/* ========================================================================= */}
          {activeTab === "feed" && (
            <div className="space-y-6">
              {/* Feed Header & Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#fbf9f4] border-2 border-black p-4">
                <div className="space-y-1">
                  <h3 className="font-heading font-black text-lg text-calmie-dark flex items-center gap-2">
                    <span>Live Calmie Community Feed</span>
                    <span className="badge-brutal bg-calmie-yellow text-[10px] text-black">Form: Calmie</span>
                  </h3>
                  <p className="text-xs text-gray-600">
                    Showing community posts, senior care updates, memories, and automated call feedback.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={feedCategoryFilter}
                    onChange={(e) => setFeedCategoryFilter(e.target.value)}
                    className="input-brutal py-1.5 px-2.5 text-xs bg-white"
                  >
                    <option value="all">All Categories</option>
                    <option value="announcement">Announcements</option>
                    <option value="care_update">Care Updates</option>
                    <option value="confirmation">Confirmations</option>
                    <option value="memory">Memories</option>
                    <option value="guide">Guides</option>
                  </select>

                  <select
                    value={feedSeniorFilter}
                    onChange={(e) => setFeedSeniorFilter(e.target.value)}
                    className="input-brutal py-1.5 px-2.5 text-xs bg-white"
                  >
                    <option value="all">All Seniors</option>
                    <option value="CLM-RAMESH">Ramesh Tiwari (CLM-RAMESH)</option>
                    <option value="CLM-KAMLA">Kamla Devi (CLM-KAMLA)</option>
                    <option value="CLM-HARBHAJAN">Harbhajan Singh (CLM-HARBHAJAN)</option>
                  </select>

                  <button
                    onClick={() => setActiveTab("write")}
                    className="btn-pink text-xs py-1.5 px-3 flex items-center gap-1 font-bold"
                  >
                    <PenSquare className="w-3.5 h-3.5" />
                    <span>Post Now</span>
                  </button>
                </div>
              </div>

              {/* Feed List */}
              <div className="space-y-4">
                {filteredPosts.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-black/30 p-6 bg-gray-50 space-y-3">
                    <PenSquare className="w-8 h-8 mx-auto text-gray-400" />
                    <p className="text-sm font-bold text-gray-600">No posts found in this filter.</p>
                    <button
                      onClick={() => setActiveTab("write")}
                      className="btn-yellow text-xs py-2 px-4 font-bold"
                    >
                      Write the first post!
                    </button>
                  </div>
                ) : (
                  filteredPosts.map((post) => {
                    const isLiked = !!likedPosts[post.id];
                    return (
                      <div
                        key={post.id}
                        className="bg-white border-2 border-black p-5 shadow-brutal-sm space-y-3 hover:shadow-brutal transition-shadow"
                      >
                        {/* Post Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-full border-2 border-black overflow-hidden bg-calmie-yellow flex-shrink-0">
                              {post.author.avatar ? (
                                <Image
                                  src={post.author.avatar}
                                  alt={post.author.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center font-bold text-sm">
                                  {post.author.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-heading font-black text-sm text-calmie-dark">
                                  {post.author.name}
                                </span>
                                <span className="text-[10px] text-gray-500 font-medium">
                                  • {post.author.role}
                                </span>
                              </div>
                              <span className="text-[10px] font-mono text-gray-400">
                                {new Date(post.created_at).toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5">
                            {post.senior_code && (
                              <span className="badge-brutal bg-calmie-cream text-[10px] text-black">
                                {post.senior_code}
                              </span>
                            )}
                            <span
                              className={`badge-brutal text-[10px] text-white ${
                                post.category === "confirmation"
                                  ? "bg-emerald-600"
                                  : post.category === "care_update"
                                  ? "bg-calmie-coral"
                                  : post.category === "announcement"
                                  ? "bg-black"
                                  : "bg-calmie-pink"
                              }`}
                            >
                              {post.category.replace("_", " ").toUpperCase()}
                            </span>
                          </div>
                        </div>

                        {/* Title & Body */}
                        <div className="space-y-2">
                          <h4 className="font-heading font-bold text-base text-calmie-dark">
                            {post.title}
                          </h4>
                          <div className="text-xs sm:text-sm text-gray-800 whitespace-pre-line leading-relaxed font-sans bg-[#fbf9f4] p-3.5 border border-black/10">
                            {post.content}
                          </div>
                        </div>

                        {/* Post Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-black/10">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => toggleHeart(post.id)}
                              className={`text-xs font-bold px-2.5 py-1 border border-black flex items-center gap-1.5 transition-colors ${
                                isLiked
                                  ? "bg-red-500 text-white"
                                  : "bg-white hover:bg-red-50 text-gray-700"
                              }`}
                            >
                              <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-white" : ""}`} />
                              <span>{post.heart_count}</span>
                            </button>

                            {post.senior_code && (
                              <button
                                type="button"
                                onClick={() => handleQuickBookForSenior(post.senior_code!)}
                                className="text-xs font-bold px-2.5 py-1 bg-calmie-yellow hover:bg-yellow-400 border border-black flex items-center gap-1"
                              >
                                <PhoneCall className="w-3.5 h-3.5" />
                                <span>Book Call for {post.senior_code}</span>
                              </button>
                            )}
                          </div>

                          <a
                            href={VAKH_CALMIE_FORM_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-bold text-calmie-pink hover:underline flex items-center gap-1"
                          >
                            <span>View on Vakh Form</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: WRITE A POST */}
          {/* ========================================================================= */}
          {activeTab === "write" && (
            <form onSubmit={handleCreatePost} className="space-y-5">
              <div className="bg-calmie-cream border-2 border-black p-4 space-y-1">
                <h3 className="font-heading font-black text-base text-calmie-dark flex items-center gap-2">
                  <PenSquare className="w-4 h-4 text-calmie-pink" />
                  <span>Write a Post to Calmie Feed</span>
                </h3>
                <p className="text-xs text-gray-700">
                  Share a care memory, an update on how a senior is feeling, or a message for the Shanti Niwas community.
                  Your post will be published to the Calmie feed on Vercel and Vakh.
                </p>
              </div>

              {postingStatus && (
                <div className="bg-emerald-50 border-2 border-emerald-600 p-3 text-xs text-emerald-800 font-bold">
                  {postingStatus}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Your Name / Title:</label>
                  <input
                    type="text"
                    value={postAuthor}
                    onChange={(e) => setPostAuthor(e.target.value)}
                    required
                    placeholder="e.g. Vikram Tiwari (Family Member)"
                    className="input-brutal py-2 px-3 text-xs w-full"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category:</label>
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value)}
                    className="input-brutal py-2 px-3 text-xs w-full bg-white"
                  >
                    <option value="care_update">Care Update 🌿</option>
                    <option value="memory">Warm Memory / Story 💭</option>
                    <option value="family_note">Family Message 💌</option>
                    <option value="announcement">Announcement 📢</option>
                    <option value="check_in">Daily Check-in 📋</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Tag a Senior:</label>
                  <select
                    value={postSeniorCode}
                    onChange={(e) => setPostSeniorCode(e.target.value)}
                    className="input-brutal py-2 px-3 text-xs w-full bg-white font-mono"
                  >
                    <option value="CLM-RAMESH">Ramesh Tiwari (CLM-RAMESH)</option>
                    <option value="CLM-KAMLA">Kamla Devi (CLM-KAMLA)</option>
                    <option value="CLM-HARBHAJAN">Col. Harbhajan Singh (CLM-HARBHAJAN)</option>
                    <option value="general">General Community (No specific senior)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Headline / Title (Optional):</label>
                  <input
                    type="text"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="e.g. Dadaji was talking about Mohammed Rafi today..."
                    className="input-brutal py-2 px-3 text-xs w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Post Content (Required):</label>
                <textarea
                  rows={4}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  required
                  placeholder="Write your note, update, or care observation here. E.g., 'Spoke with Ramesh Dadaji this morning, he was looking forward to the cricket match...'"
                  className="input-brutal py-2 px-3 text-xs w-full leading-relaxed"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-pink py-3 px-6 text-sm font-bold flex-1 flex items-center justify-center gap-2 shadow-brutal"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? "Publishing Post..." : "Publish Post to Calmie Feed"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("feed")}
                  className="btn-white py-3 px-5 text-sm font-bold shadow-brutal"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: BOOK VIA REPLY */}
          {/* ========================================================================= */}
          {activeTab === "reply" && (
            <div className="space-y-5">
              <div className="bg-calmie-cream border-2 border-black p-4 text-xs text-calmie-dark space-y-2">
                <p className="font-heading font-bold text-sm">How to book by replying on Vakh:</p>
                <p className="text-gray-700 font-medium">
                  We published an official booking guide post on Vakh (ID: <strong className="font-mono">{VAKH_POST_ID}</strong>).
                  Users can reply to that post or submit below. Our automated backend parses the reply, schedules the slot,
                  and issues an instant confirmation response!
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
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleBookViaReply}
                  className="btn-pink py-3 px-6 text-sm font-bold flex-1 flex items-center justify-center gap-2 shadow-brutal"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? "Processing Automation..." : "Submit Reply to Calmie Automation"}</span>
                </button>
                <a
                  href={VAKH_POST_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-white py-3 px-5 text-sm font-bold flex items-center justify-center gap-2 shadow-brutal"
                >
                  <span>Open Post on Vakh</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: DIRECT BOOKING FORM */}
          {/* ========================================================================= */}
          {activeTab === "form" && (
            <div className="space-y-5">
              <div className="bg-emerald-50 border-2 border-black p-4 text-xs text-gray-800 space-y-1">
                <p className="font-heading font-bold text-sm text-emerald-900">
                  Calmie Senior Call Slot Bookings Form
                </p>
                <p className="font-medium text-emerald-950">
                  Form Name on Vakh: <strong>Calmie Senior Call Slot Bookings</strong> (ID: <strong className="font-mono">{VAKH_BOOKING_FORM_ID}</strong>).
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
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleBookViaForm}
                  className="btn-pink py-3 px-6 text-sm font-bold flex-1 flex items-center justify-center gap-2 shadow-brutal"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{submitting ? "Booking..." : "Submit Slot via Vakh Form"}</span>
                </button>
                <a
                  href={VAKH_BOOKING_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-white py-3 px-5 text-sm font-bold flex items-center justify-center gap-2 shadow-brutal"
                >
                  <span>Open Official Vakh Form</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: AUTOMATED RESPONSES & FEEDBACK */}
          {/* ========================================================================= */}
          {activeTab === "responses" && (
            <div className="space-y-5">
              <div className="bg-yellow-50 border-2 border-black p-4 space-y-1">
                <h4 className="font-heading font-black text-sm text-calmie-dark flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Calmie Automated Responses & Call Confirmations</span>
                </h4>
                <p className="text-xs text-gray-700">
                  Every time a community member replies on Vakh or submits a form, Calmie schedules the slot,
                  registers the dial time in the database, and issues an automated confirmation response.
                </p>
              </div>

              <div className="space-y-3">
                {responses.length === 0 ? (
                  <div className="p-6 text-center text-xs text-gray-500 border border-dashed border-black/30">
                    No automated responses logged yet.
                  </div>
                ) : (
                  responses.map((resp) => (
                    <div
                      key={resp.id}
                      className="bg-white border-2 border-black p-4 shadow-brutal-sm space-y-2.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="badge-brutal bg-emerald-600 text-white text-[10px]">
                            CONFIRMED SLOT
                          </span>
                          <span className="badge-brutal bg-black text-white text-[10px]">
                            {resp.senior_code}
                          </span>
                          <span className="text-xs font-heading font-bold text-calmie-dark">
                            {resp.senior_name}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-gray-500">
                          {new Date(resp.timestamp).toLocaleString()}
                        </span>
                      </div>

                      <div className="text-xs font-mono bg-[#fbf9f4] p-3 border border-black/20 text-gray-800 whitespace-pre-line leading-relaxed">
                        {resp.confirmation_text}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-600 font-medium">
                        <span>Booker: <strong>{resp.booker_name}</strong></span>
                        <span>•</span>
                        <span>Dial To: <strong>{resp.phone}</strong></span>
                        <span>•</span>
                        <span>Voice: <strong>{resp.voice}</strong></span>
                        <span>•</span>
                        <span>Scheduled: <strong>{resp.scheduled_at}</strong></span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
