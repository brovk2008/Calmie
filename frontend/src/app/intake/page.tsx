import Link from "next/link";
import { Download, FileUp, PenLine, ArrowRight, ClipboardList, Sparkles } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://calmie-lol.vercel.app";

export const metadata = {
  title: "Add Residents — Calmie",
  description: "Add senior residents to Calmie via manual form or bulk PDF upload with AI-powered data extraction.",
};

export default function IntakeLandingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-calmie-yellow border-2 border-black px-4 py-1.5 shadow-brutal-sm">
          <Sparkles className="w-4 h-4 text-calmie-dark" />
          <span className="font-heading font-black text-xs uppercase tracking-wider text-calmie-dark">
            Care Home Portal
          </span>
        </div>
        <h1 className="font-heading font-black text-4xl sm:text-5xl text-calmie-dark leading-tight">
          Add Residents to Calmie
        </h1>
        <p className="text-gray-600 text-lg max-w-xl mx-auto">
          Onboard senior residents so Calmie can schedule warm, personalised AI calls for them.
          Choose how you&apos;d like to add their information.
        </p>
      </div>

      {/* Two mode cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Manual form */}
        <div className="card-brutal border-3 border-black bg-white shadow-brutal-lg p-8 space-y-5 flex flex-col">
          <div className="w-14 h-14 bg-calmie-yellow border-2 border-black flex items-center justify-center shadow-brutal-sm">
            <PenLine className="w-7 h-7 text-calmie-dark" />
          </div>
          <div className="space-y-2 flex-1">
            <h2 className="font-heading font-black text-xl text-calmie-dark">Manual Entry</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Fill in a guided step-by-step form for one resident at a time. Best when you have all
              their details ready or want to add a few people quickly.
            </p>
            <ul className="text-xs text-gray-500 space-y-1 pt-2">
              <li className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span> 4 simple steps</li>
              <li className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span> Instant confirmation</li>
              <li className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span> No file needed</li>
            </ul>
          </div>
          <Link
            href="/intake/manual"
            className="btn-pink py-3 px-6 flex items-center justify-center gap-2 font-bold shadow-brutal"
          >
            <PenLine className="w-4 h-4" />
            Fill Form Manually
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
        </div>

        {/* PDF Upload */}
        <div className="card-brutal border-3 border-black bg-[#0f0f1a] shadow-brutal-lg p-8 space-y-5 flex flex-col">
          <div className="w-14 h-14 bg-calmie-yellow border-2 border-black flex items-center justify-center shadow-brutal-sm">
            <FileUp className="w-7 h-7 text-calmie-dark" />
          </div>
          <div className="space-y-2 flex-1">
            <h2 className="font-heading font-black text-xl text-white">Bulk PDF Upload</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Download our intake template, fill it in (by hand or digitally), then upload it.
              Our AI reads the form and creates all resident profiles automatically.
            </p>
            <ul className="text-xs text-gray-500 space-y-1 pt-2">
              <li className="flex items-center gap-2"><span className="text-calmie-yellow font-bold">✓</span> Upload handwritten or typed PDFs</li>
              <li className="flex items-center gap-2"><span className="text-calmie-yellow font-bold">✓</span> AI extracts all fields</li>
              <li className="flex items-center gap-2"><span className="text-calmie-yellow font-bold">✓</span> Review before saving</li>
              <li className="flex items-center gap-2"><span className="text-calmie-yellow font-bold">✓</span> Multiple residents per upload</li>
            </ul>
          </div>
          <div className="space-y-3">
            <a
              href={`${API_BASE}/api/intake/template`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 border-2 border-calmie-yellow text-calmie-yellow py-2.5 px-4 text-sm font-bold hover:bg-calmie-yellow hover:text-black transition"
            >
              <Download className="w-4 h-4" />
              Download Blank Template PDF
            </a>
            <Link
              href="/intake/upload"
              className="w-full flex items-center justify-center gap-2 bg-calmie-yellow border-2 border-black text-black py-3 px-6 font-bold hover:bg-yellow-300 transition shadow-brutal"
            >
              <FileUp className="w-4 h-4" />
              Upload Filled Form
              <ArrowRight className="w-4 h-4 ml-auto" />
            </Link>
          </div>
        </div>
      </div>

      {/* Instructions box */}
      <div className="bg-calmie-cream border-2 border-black p-6 shadow-brutal-sm space-y-4">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-calmie-dark" />
          <h3 className="font-heading font-black text-base text-calmie-dark uppercase tracking-wide">
            How PDF Upload Works
          </h3>
        </div>
        <ol className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-3">
            <span className="w-6 h-6 bg-calmie-yellow border border-black flex items-center justify-center font-black text-xs flex-shrink-0">1</span>
            <span>Download the blank Calmie Resident Intake Form (PDF)</span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 bg-calmie-yellow border border-black flex items-center justify-center font-black text-xs flex-shrink-0">2</span>
            <span>Print and fill by hand, or fill digitally using a PDF editor</span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 bg-calmie-yellow border border-black flex items-center justify-center font-black text-xs flex-shrink-0">3</span>
            <span>Scan the filled form (or keep as digital PDF) and upload here</span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 bg-calmie-yellow border border-black flex items-center justify-center font-black text-xs flex-shrink-0">4</span>
            <span>Review the AI-extracted data and confirm — residents appear immediately in the directory</span>
          </li>
        </ol>
      </div>
    </div>
  );
}
