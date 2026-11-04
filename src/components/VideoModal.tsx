import React from 'react';
import { Exercise } from '../types/rehab';
import { X, ExternalLink, Play, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface VideoModalProps {
  exercise: Exercise | null;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ exercise, onClose }) => {
  if (!exercise) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        role="dialog"
        aria-labelledby="video-modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Play className="w-5 h-5" />
            </span>
            <div>
              <h3 id="video-modal-title" className="text-lg font-bold text-white">
                {exercise.name}
              </h3>
              <p className="text-xs text-slate-400">
                Source: <span className="text-slate-300 font-medium">{exercise.videoChannel}</span> •{' '}
                <span className="text-emerald-400">{exercise.category}</span>
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
          {/* Video Preview Container */}
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner group">
            {exercise.videoEmbedId ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${exercise.videoEmbedId}?rel=0&modestbranding=1`}
                title={`${exercise.name} Demonstration`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : null}

            {/* Always accessible Overlay Banner for direct YouTube playback */}
            <div className="absolute bottom-3 right-3 z-10">
              <a
                href={exercise.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold shadow-xl transition hover:scale-105 active:scale-95"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Watch on YouTube</span>
              </a>
            </div>
          </div>

          {/* Quick Action Button to Open Video in New Tab */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 gap-3">
            <div className="text-xs text-slate-300">
              <span className="font-semibold text-white">Verified Demonstration Link: </span>
              <a
                href={exercise.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline break-all block sm:inline mt-0.5 sm:mt-0"
              >
                {exercise.videoUrl}
              </a>
            </div>
            <a
              href={exercise.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold rounded-lg shadow transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Launch Video</span>
            </a>
          </div>

          {/* Biomechanical Rationale */}
          <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/40">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Clinical & Biomechanical Rationale
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed">{exercise.rationale}</p>
          </div>

          {/* Execution Cues */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Key Form Cues
            </h4>
            <ul className="space-y-2">
              {exercise.techniqueCues.map((cue, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300">
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
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Prescription: <span className="text-slate-200 font-semibold">{exercise.defaultSets} sets</span> of{' '}
            <span className="text-slate-200 font-semibold">{exercise.defaultReps}</span> ({exercise.frequency})
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
