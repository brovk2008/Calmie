"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, FileText, Check, Loader2, CheckCircle, AlertCircle, Pencil, Trash2, Download } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://calmie-lol.vercel.app";

interface ExtractedResident {
  name: string;
  age?: number;
  room_number?: string;
  phone?: string;
  hometown?: string;
  preferred_lang?: string;
  hobbies?: string;
  favorite_topics?: string;
  avoid_topics?: string;
  health_notes?: string;
  family_notes?: string;
  personality?: string;
  emergency_contact?: string;
}

type UploadState = "idle" | "uploading" | "preview" | "confirming" | "done" | "error";

export default function UploadIntakePage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>("idle");
  const [isDragging, setIsDragging] = useState(false);
  const [filename, setFilename] = useState("");
  const [residents, setResidents] = useState<ExtractedResident[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<ExtractedResident>>({});
  const [error, setError] = useState("");
  const [createdCount, setCreatedCount] = useState(0);
  const [homeId, setHomeId] = useState("");

  const handleFile = useCallback(async (file: File) => {
    if (!file) return;
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type) && !file.name.endsWith(".pdf")) {
      setError("Please upload a PDF or image file (JPG, PNG, PDF).");
      setState("error");
      return;
    }
    setFilename(file.name);
    setState("uploading");
    setError("");

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/api/intake/upload`, { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Upload failed. Please try again.");
        setState("error");
        return;
      }
      if (!data.residents || data.residents.length === 0) {
        setError("No resident data could be extracted. Ensure the form is filled and text is legible.");
        setState("error");
        return;
      }
      setResidents(data.residents);
      setState("preview");
    } catch (e) {
      setError("Network error — please check your connection and try again.");
      setState("error");
    }
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const startEdit = (i: number) => {
    setEditing(i);
    setEditData({ ...residents[i] });
  };

  const saveEdit = (i: number) => {
    setResidents((list) => list.map((r, idx) => idx === i ? { ...r, ...editData } as ExtractedResident : r));
    setEditing(null);
  };

  const removeResident = (i: number) => {
    setResidents((list) => list.filter((_, idx) => idx !== i));
  };

  const confirmAll = async () => {
    setState("confirming");
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/intake/bulk-confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ home_id: homeId || null, residents }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Confirmation failed. Please try again.");
        setState("preview");
        return;
      }
      setCreatedCount(data.created_count || residents.length);
      setState("done");
    } catch (e) {
      setError("Network error during confirmation.");
      setState("preview");
    }
  };

  if (state === "done") {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-calmie-yellow border-3 border-black flex items-center justify-center mx-auto shadow-brutal">
          <CheckCircle className="w-10 h-10 text-calmie-dark" />
        </div>
        <h1 className="font-heading font-black text-3xl text-calmie-dark">All Done!</h1>
        <p className="text-gray-600">
          <strong>{createdCount} resident{createdCount !== 1 ? "s" : ""}</strong> have been added to Calmie from <em>{filename}</em>.
          They&apos;ll appear in the residents directory shortly.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => { setState("idle"); setResidents([]); setFilename(""); }} className="btn-white py-3 px-6 border-2 border-black font-bold">
            Upload Another File
          </button>
          <button onClick={() => router.push("/residents")} className="btn-pink py-3 px-6 font-bold shadow-brutal">
            View Directory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => state === "preview" ? setState("idle") : router.push("/intake")} className="p-2 border-2 border-black hover:bg-calmie-yellow transition">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="font-heading font-black text-2xl text-calmie-dark">Bulk PDF Upload</h1>
          <p className="text-xs text-gray-500">Upload filled intake forms — AI extracts the data</p>
        </div>
        <a
          href={`${API_BASE}/api/intake/template`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto flex items-center gap-1.5 text-xs font-bold text-calmie-pink border-2 border-calmie-pink px-3 py-1.5 hover:bg-calmie-pink hover:text-white transition"
        >
          <Download className="w-3.5 h-3.5" /> Template PDF
        </a>
      </div>

      {/* Upload zone */}
      {(state === "idle" || state === "error") && (
        <div className="space-y-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-3 border-dashed cursor-pointer transition-all p-12 text-center space-y-4
              ${isDragging ? "border-calmie-pink bg-pink-50" : "border-black bg-white hover:bg-calmie-cream"}`}
          >
            <Upload className={`w-12 h-12 mx-auto ${isDragging ? "text-calmie-pink" : "text-gray-400"}`} />
            <div>
              <p className="font-heading font-black text-lg text-calmie-dark">
                Drop your filled intake form here
              </p>
              <p className="text-sm text-gray-500 mt-1">PDF, JPG, or PNG — max 20MB</p>
            </div>
            <button type="button" className="btn-pink py-2.5 px-6 font-bold shadow-brutal text-sm">
              Choose File
            </button>
            <input ref={fileRef} type="file" accept=".pdf,image/jpeg,image/png,image/webp" onChange={onFileSelect} className="hidden" />
          </div>
          {state === "error" && (
            <div className="flex items-start gap-3 bg-red-50 border-2 border-red-300 p-4">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>
      )}

      {/* Uploading / Processing */}
      {state === "uploading" && (
        <div className="card-brutal border-3 border-black bg-white shadow-brutal-lg p-12 text-center space-y-5">
          <div className="relative w-20 h-20 mx-auto">
            <div className="w-20 h-20 border-4 border-calmie-yellow border-t-calmie-pink rounded-full animate-spin" />
            <FileText className="w-8 h-8 text-calmie-dark absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div>
            <p className="font-heading font-black text-xl text-calmie-dark">Reading your form…</p>
            <p className="text-sm text-gray-500 mt-1">Claude AI is extracting resident data from <strong>{filename}</strong></p>
          </div>
        </div>
      )}

      {/* Preview extracted residents */}
      {(state === "preview" || state === "confirming") && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-black text-lg text-calmie-dark">
                {residents.length} Resident{residents.length !== 1 ? "s" : ""} Extracted
              </h2>
              <p className="text-xs text-gray-500">Review and edit before saving. Remove any incorrect entries.</p>
            </div>
          </div>

          {/* Optional Home ID */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide whitespace-nowrap">Home ID (optional)</label>
            <input
              type="text"
              value={homeId}
              onChange={(e) => setHomeId(e.target.value)}
              placeholder="Leave blank if unknown"
              className="flex-1 border-2 border-black px-3 py-1.5 text-sm focus:outline-none focus:border-calmie-pink"
            />
          </div>

          <div className="space-y-3">
            {residents.map((r, i) => (
              <div key={i} className="card-brutal border-2 border-black bg-white shadow-brutal-sm p-4 space-y-3">
                {editing === i ? (
                  /* Edit mode */
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      {([
                        ["Name", "name"], ["Age", "age"], ["Phone", "phone"], ["Room", "room_number"],
                        ["Hometown", "hometown"], ["Languages", "preferred_lang"],
                      ] as [string, keyof ExtractedResident][]).map(([label, field]) => (
                        <div key={field} className="space-y-0.5">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{label}</label>
                          <input
                            type="text"
                            value={(editData[field] as string) ?? ""}
                            onChange={(e) => setEditData((d) => ({ ...d, [field]: e.target.value }))}
                            className="w-full border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:border-calmie-pink"
                          />
                        </div>
                      ))}
                    </div>
                    {(["hobbies", "favorite_topics", "health_notes", "family_notes", "personality"] as (keyof ExtractedResident)[]).map((field) => (
                      <div key={field} className="space-y-0.5">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{field.replace("_", " ")}</label>
                        <textarea
                          rows={2}
                          value={(editData[field] as string) ?? ""}
                          onChange={(e) => setEditData((d) => ({ ...d, [field]: e.target.value }))}
                          className="w-full border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:border-calmie-pink resize-none"
                        />
                      </div>
                    ))}
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setEditing(null)} className="px-4 py-1.5 border border-gray-300 text-sm text-gray-600 hover:border-gray-500">Cancel</button>
                      <button onClick={() => saveEdit(i)} className="px-4 py-1.5 bg-calmie-yellow border-2 border-black text-sm font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Save
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View mode */
                  <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-heading font-black text-base text-calmie-dark">{r.name || "Unknown"}</h3>
                        {r.age && <span className="text-xs bg-calmie-yellow px-1.5 py-0.5 border border-black font-bold">{r.age}y</span>}
                        {r.room_number && <span className="text-xs text-gray-500 font-mono">Room {r.room_number}</span>}
                      </div>
                      <div className="text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-0.5">
                        {r.phone && <span>📞 {r.phone}</span>}
                        {r.hometown && <span>📍 {r.hometown}</span>}
                        {r.preferred_lang && <span>🗣️ {r.preferred_lang}</span>}
                      </div>
                      {r.hobbies && <p className="text-xs text-gray-600 mt-1 line-clamp-2">🎯 {r.hobbies}</p>}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => startEdit(i)} className="p-1.5 border border-gray-200 hover:border-calmie-pink hover:text-calmie-pink transition rounded">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => removeResident(i)} className="p-1.5 border border-gray-200 hover:border-red-400 hover:text-red-500 transition rounded">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-red-50 border-2 border-red-300 p-4">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setState("idle")} className="btn-white py-3 px-6 border-2 border-black font-bold">
              Start Over
            </button>
            <button
              onClick={confirmAll}
              disabled={state === "confirming" || residents.length === 0}
              className="btn-pink flex-1 py-3 px-6 font-bold shadow-brutal flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {state === "confirming"
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                : <><Check className="w-4 h-4" /> Save All {residents.length} Resident{residents.length !== 1 ? "s" : ""}</>
              }
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
