import React, { useState } from 'react';
import { Exercise } from '../types/rehab';
import {
  X,
  ExternalLink,
  Play,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Search,
  Youtube,
} from 'lucide-react';

interface VideoModalProps {
  exercise: Exercise | null;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ exercise, onClose }) => {
  const [iframeError, setIframeError] = useState(false);

  if (!exercise) return null;

  const searchQuery = encodeURIComponent(`${exercise.name} ${exercise.videoChannel} exercise demonstration physical therapy`);
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        role="dialog"
        aria-labelledby="video-modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-red-600/15 text-red-500 border border-red-500/20">
              <Youtube className="w-5 h-5" />
            </span>
            <div>
              <h3 id="video-modal-title" className="text-lg font-bold text-white">
                {exercise.name}
              </h3>
              <p className="text-xs text-slate-400">
                Channel: <span className="text-slate-200 font-semibold">{exercise.videoChannel}</span> •{' '}
                <span className="text-cyan-400">{exercise.category}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close video demonstration modal"
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Guaranteed Direct YouTube Play Banner */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 p-5 shadow-inner">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-[11px] font-bold uppercase tracking-wider">
                    <Youtube className="w-3.5 h-3.5 fill-current" /> YouTube Video Demo
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Verified Physical Therapy</span>
                </div>
                <h4 className="text-base font-bold text-white">{exercise.name}</h4>
                <p className="text-xs text-slate-400">
                  Equipment: <span className="text-slate-200">{exercise.equipment}</span> • Target: {exercise.defaultSets} sets of {exercise.defaultReps}
                </p>
              </div>

              {/* Direct Watch Actions */}
              <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
                <a
                  href={exercise.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-950/40 transition hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Watch on YouTube ↗</span>
                </a>

                <a
                  href={youtubeSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-[11px] font-medium border border-slate-700 transition"
                >
                  <Search className="w-3 h-3 text-slate-400" />
                  <span>Search More Angles</span>
                </a>
              </div>
            </div>

            {/* Embedded Iframe Player with video poster preview & clear launch button */}
            <div className="mt-4 relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-800 group">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${exercise.videoEmbedId}?rel=0&modestbranding=1&autoplay=0`}
                title={`${exercise.name} Demonstration`}
                className="w-full h-full border-0 relative z-10"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onError={() => setIframeError(true)}
              />
            </div>
            
            <div className="mt-3 flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Youtube className="w-4 h-4 text-red-500 shrink-0" />
                <span>
                  Video: <span className="font-semibold text-white">{exercise.name}</span> by <span className="text-cyan-400 font-semibold">{exercise.videoChannel}</span>
                </span>
              </div>
              <a
                href={exercise.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-lg font-semibold transition"
              >
                <span>Watch on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Biomechanical Rationale */}
          <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-800/40">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Clinical &amp; Biomechanical Rationale
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{exercise.rationale}</p>
          </div>

          {/* Execution Cues */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Key Form Cues
            </h4>
            <ul className="space-y-2">
              {exercise.techniqueCues.map((cue, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-bold mt-0.5 border border-emerald-500/20">
                    {idx + 1}
                  </span>
                  <span>{cue}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mistakes & Joint-friendly Modification */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Common Mistakes
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {exercise.commonMistakes.map((mistake, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-400">•</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Joint-Friendly Modification
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">{exercise.jointFriendlyModification}</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <a
            href={exercise.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open exact URL: {exercise.videoUrl}</span>
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
