"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, MicOff, Play, Pause, Trash2, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://calmie-lol.vercel.app";

interface VoiceRecorderProps {
  onCloneReady: (voiceId: string) => void;
  onCancel: () => void;
}

type RecordState = "idle" | "recording" | "recorded" | "uploading" | "done" | "error";

export default function VoiceRecorder({ onCloneReady, onCancel }: VoiceRecorderProps) {
  const [state, setState] = useState<RecordState>("idle");
  const [seconds, setSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [consent, setConsent] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [voiceId, setVoiceId] = useState("");
  const [bars, setBars] = useState<number[]>(Array(20).fill(4));

  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const animateBars = useCallback(() => {
    if (!analyserRef.current) return;
    const data = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(data);
    const step = Math.floor(data.length / 20);
    const newBars = Array.from({ length: 20 }, (_, i) => {
      const val = data[i * step] || 0;
      return Math.max(4, Math.round((val / 255) * 48));
    });
    setBars(newBars);
    animFrameRef.current = requestAnimationFrame(animateBars);
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Waveform analyser
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setState("recorded");
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        setBars(Array(20).fill(4));
      };
      recorder.start(100);
      mediaRef.current = recorder;
      setState("recording");
      setSeconds(0);

      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s >= 59) {
            recorder.stop();
            clearInterval(timerRef.current!);
          }
          return s + 1;
        });
      }, 1000);

      animateBars();
    } catch (e) {
      setErrorMsg("Microphone access denied. Please allow mic access in your browser settings.");
      setState("error");
    }
  };

  const stopRecording = () => {
    if (mediaRef.current && mediaRef.current.state !== "inactive") {
      mediaRef.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const reset = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setAudioBlob(null);
    setSeconds(0);
    setIsPlaying(false);
    setState("idle");
    setBars(Array(20).fill(4));
  };

  const uploadAndClone = async () => {
    if (!audioBlob) return;
    if (!consent) {
      setErrorMsg("Please check the consent box before cloning your voice.");
      return;
    }
    setState("uploading");
    setErrorMsg("");

    const form = new FormData();
    form.append("audio", audioBlob, "recording.webm");
    form.append("name", "My Calmie Voice");
    form.append("consent", "true");

    try {
      const res = await fetch(`${API_BASE}/api/voice/clone`, { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok || !data.voice_id) {
        setErrorMsg(data.detail || "Voice cloning failed. Please try a longer, clearer recording.");
        setState("error");
        return;
      }
      setVoiceId(data.voice_id);
      setState("done");
      onCloneReady(data.voice_id);
    } catch (e) {
      setErrorMsg("Network error — please check your connection and try again.");
      setState("error");
    }
  };

  const fmtTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="space-y-5">
      {/* Waveform / Status display */}
      <div className="bg-[#0f0f1a] rounded-2xl p-6 flex flex-col items-center gap-4 min-h-[140px] justify-center border border-white/10">
        {state === "recording" && (
          <>
            {/* Live waveform bars */}
            <div className="flex items-end gap-1 h-14">
              {bars.map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-full bg-calmie-yellow transition-all duration-75"
                  style={{ height: `${h}px`, opacity: 0.7 + (i % 3) * 0.1 }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
              <span className="text-white font-mono text-lg font-bold">{fmtTime(seconds)}</span>
              <span className="text-gray-400 text-sm">Recording… (max 60s)</span>
            </div>
          </>
        )}

        {state === "idle" && (
          <div className="text-center space-y-1">
            <Mic className="w-10 h-10 text-gray-500 mx-auto" />
            <p className="text-gray-400 text-sm">Press record and speak naturally for 30–60 seconds</p>
            <p className="text-gray-500 text-xs">Tips: speak clearly, say a short story or poem, avoid background noise</p>
          </div>
        )}

        {(state === "recorded" || state === "uploading" || state === "done") && (
          <div className="text-center space-y-2 w-full">
            <div className="flex items-center justify-center gap-3">
              {state === "done"
                ? <CheckCircle className="w-8 h-8 text-green-400" />
                : <CheckCircle className="w-8 h-8 text-calmie-yellow" />
              }
              <span className="text-white font-semibold">
                {state === "done" ? "Voice cloned! ✨" : `Recording ready (${fmtTime(seconds)})`}
              </span>
            </div>
            {audioUrl && state !== "done" && (
              <div className="flex items-center justify-center gap-3 mt-2">
                <button
                  onClick={togglePlay}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm transition"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? "Pause" : "Play back"}
                </button>
                <button onClick={reset} className="text-gray-400 hover:text-red-400 transition p-2 rounded-lg hover:bg-white/10">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
            {state === "uploading" && (
              <div className="flex items-center justify-center gap-2 text-calmie-yellow text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Cloning your voice with ElevenLabs AI…
              </div>
            )}
          </div>
        )}

        {state === "error" && (
          <div className="text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
            <p className="text-red-400 text-sm">{errorMsg}</p>
          </div>
        )}

        {/* Hidden audio element for playback */}
        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
        )}
      </div>

      {/* Consent checkbox */}
      {(state === "recorded" || state === "error") && (
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-yellow-400 flex-shrink-0"
          />
          <span className="text-xs text-gray-600 group-hover:text-gray-800 transition">
            I confirm this is <strong>my own voice</strong> and I consent to it being cloned by ElevenLabs
            for use in Calmie calls with seniors.
          </span>
        </label>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        {state === "idle" && (
          <>
            <button
              onClick={startRecording}
              className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition shadow-md"
            >
              <Mic className="w-5 h-5" /> Start Recording
            </button>
            <button onClick={onCancel} className="px-5 py-3 border-2 border-gray-200 rounded-xl text-gray-600 hover:border-gray-400 transition">
              Cancel
            </button>
          </>
        )}

        {state === "recording" && (
          <button
            onClick={stopRecording}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl transition shadow-md animate-pulse"
          >
            <MicOff className="w-5 h-5" /> Stop Recording
          </button>
        )}

        {state === "recorded" && (
          <>
            <button
              onClick={uploadAndClone}
              disabled={!consent}
              className="flex-1 flex items-center justify-center gap-2 bg-calmie-yellow border-2 border-black hover:bg-yellow-300 text-black font-bold py-3 rounded-xl transition shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ✨ Use My Voice
            </button>
            <button onClick={reset} className="px-5 py-3 border-2 border-gray-200 rounded-xl text-gray-600 hover:border-gray-400 transition text-sm">
              Re-record
            </button>
          </>
        )}

        {state === "error" && (
          <>
            <button
              onClick={reset}
              className="flex-1 flex items-center justify-center gap-2 bg-calmie-yellow border-2 border-black text-black font-bold py-3 rounded-xl transition"
            >
              Try Again
            </button>
            <button onClick={onCancel} className="px-5 py-3 border-2 border-gray-200 rounded-xl text-gray-600 transition text-sm">
              Cancel
            </button>
          </>
        )}

        {state === "done" && (
          <div className="flex-1 flex items-center justify-center gap-2 bg-green-50 border-2 border-green-400 text-green-700 font-bold py-3 rounded-xl">
            <CheckCircle className="w-5 h-5" /> Voice Ready for Call
          </div>
        )}
      </div>
    </div>
  );
}
