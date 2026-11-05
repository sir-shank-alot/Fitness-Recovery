import React, { useState, useMemo } from 'react';
import { PlanWeek, Exercise, AthleteId } from '../types/rehab';
import { exportPlanToCsv } from '../utils/rehab-logic';
import {
  Download,
  Search,
  Filter,
  Play,
  ExternalLink,
  Table as TableIcon,
  CheckCircle,
  FileSpreadsheet,
  Youtube,
} from 'lucide-react';

interface SpreadsheetViewProps {
  weeks: PlanWeek[];
  exercises: Exercise[];
  currentAthleteId: AthleteId;
  onOpenVideo: (exercise: Exercise) => void;
}

export const SpreadsheetView: React.FC<SpreadsheetViewProps> = ({
  weeks,
  exercises,
  currentAthleteId,
  onOpenVideo,
}) => {
  const [selectedAthleteFilter, setSelectedAthleteFilter] = useState<'all' | 'arwel' | 'helen'>(
    currentAthleteId
  );
  const [selectedPhase, setSelectedPhase] = useState<number | 'all'>('all');
  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const exerciseMap = useMemo(() => new Map(exercises.map((e) => [e.id, e])), [exercises]);

  // Flatten the full 12-week schedule into spreadsheet row objects
  const tableRows = useMemo(() => {
    const rows: {
      id: string;
      weekNumber: number;
      phase: number;
      phaseName: string;
      dayNumber: number;
      dayName: string;
      workoutTitle: string;
      focus: string;
      exercise: Exercise | null;
      customSets?: number;
      customReps?: string;
      isRest: boolean;
    }[] = [];

    weeks.forEach((week) => {
      // Phase filter
      if (selectedPhase !== 'all' && week.phase !== selectedPhase) return;
      // Week filter
      if (selectedWeek !== 'all' && week.weekNumber !== selectedWeek) return;

      week.days.forEach((day) => {
        if (day.exercises.length === 0) {
          // If filtering by category or searching, rest days might be filtered out unless searching for rest
          if (
            selectedCategory === 'all' &&
            (!searchQuery || 'rest recovery'.includes(searchQuery.toLowerCase()))
          ) {
            rows.push({
              id: `w${week.weekNumber}-d${day.dayNumber}-rest`,
              weekNumber: week.weekNumber,
              phase: week.phase,
              phaseName: week.phaseName,
              dayNumber: day.dayNumber,
              dayName: day.dayName,
              workoutTitle: day.title,
              focus: day.focus,
              exercise: null,
              isRest: true,
            });
          }
          return;
        }

        day.exercises.forEach((item, exIdx) => {
          const ex = exerciseMap.get(item.exerciseId);
          if (!ex) return;

          // Athlete filter
          if (
            selectedAthleteFilter !== 'all' &&
            !ex.targetAthletes.includes(selectedAthleteFilter as AthleteId)
          ) {
            return;
          }

          // Category filter
          if (selectedCategory !== 'all' && ex.category !== selectedCategory) {
            return;
          }

          // Search query
          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const matchName = ex.name.toLowerCase().includes(q);
            const matchCat = ex.category.toLowerCase().includes(q);
            const matchCues = ex.techniqueCues.some((c) => c.toLowerCase().includes(q));
            const matchTitle = day.title.toLowerCase().includes(q);
            const matchFocus = day.focus.toLowerCase().includes(q);
            if (!matchName && !matchCat && !matchCues && !matchTitle && !matchFocus) {
              return;
            }
          }

          rows.push({
            id: `w${week.weekNumber}-d${day.dayNumber}-ex${exIdx}`,
            weekNumber: week.weekNumber,
            phase: week.phase,
            phaseName: week.phaseName,
            dayNumber: day.dayNumber,
            dayName: day.dayName,
            workoutTitle: day.title,
            focus: day.focus,
            exercise: ex,
            customSets: item.customSets,
            customReps: item.customReps,
            isRest: false,
          });
        });
      });
    });

    return rows;
  }, [
    weeks,
    exerciseMap,
    selectedAthleteFilter,
    selectedPhase,
    selectedWeek,
    selectedCategory,
    searchQuery,
  ]);

  const handleExportCsv = () => {
    const target = selectedAthleteFilter === 'all' ? undefined : (selectedAthleteFilter as AthleteId);
    const csvContent = exportPlanToCsv(weeks, exercises, target);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `12_Week_Rehab_Plan_${selectedAthleteFilter.toUpperCase()}_${timestamp}.csv`;

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const categories = [
    'all',
    'Spine & Core',
    'Adductor & Pelvis',
    'Hip & Glute (GTPS)',
    'Foot & Calf',
    'Knee & Quad',
    'Mobility & Decompression',
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <FileSpreadsheet className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                12-Week Master Spreadsheet & Video Matrix
              </h2>
            </div>
            <p className="text-sm text-slate-400 max-w-3xl">
              Complete tabular breakdown outlining every prescribed movement, progression phase,
              frequency, clinical cues, and verified demonstration video links for Arwel Thomas and
              Helen Shanley.
            </p>
          </div>

          {/* Export Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-950/40 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              {downloadSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-200" />
                  <span>Downloaded CSV!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Export to Spreadsheet (.CSV)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Athlete Filter */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Athlete Focus
            </label>
            <select
              value={selectedAthleteFilter}
              onChange={(e) => setSelectedAthleteFilter(e.target.value as any)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Athletes (Arwel & Helen)</option>
              <option value="arwel">Arwel Thomas (Adductor/Back/Knee)</option>
              <option value="helen">Helen Shanley (Plantar/GTPS/Hands)</option>
            </select>
          </div>

          {/* Phase Filter */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Rehab Phase
            </label>
            <select
              value={selectedPhase}
              onChange={(e) =>
                setSelectedPhase(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Phases (Weeks 1-12)</option>
              <option value={1}>Phase 1: Weeks 1-4 (De-load & Pain)</option>
              <option value={2}>Phase 2: Weeks 5-8 (Tissue Remodeling)</option>
              <option value={3}>Phase 3: Weeks 9-12 (Dynamic Return)</option>
            </select>
          </div>

          {/* Week Filter */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Specific Week
            </label>
            <select
              value={selectedWeek}
              onChange={(e) =>
                setSelectedWeek(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All 12 Weeks</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((w) => (
                <option key={w} value={w}>
                  Week {w}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All Movement Categories' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Search Exercises
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. McGill, Rathleff, TKE..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-cyan-500 placeholder-slate-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>

        {/* Active Summary Pill Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Showing:</span>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-cyan-400 border border-slate-700">
              {tableRows.length} scheduled items
            </span>
            {selectedAthleteFilter !== 'all' && (
              <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Filtered: {selectedAthleteFilter === 'arwel' ? 'Arwel Thomas' : 'Helen Shanley'}
              </span>
            )}
            {selectedPhase !== 'all' && (
              <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Phase {selectedPhase}
              </span>
            )}
          </div>
          <p className="italic text-slate-500">
            Click &quot;Watch Demo&quot; or external video links to view physical therapy technique cues.
          </p>
        </div>
      </div>

      {/* Spreadsheet Table Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto max-h-[750px]">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 z-20 bg-slate-950 text-slate-300 font-semibold uppercase tracking-wider border-b border-slate-800 shadow-sm">
              <tr>
                <th className="px-4 py-3.5 whitespace-nowrap">Week / Phase</th>
                <th className="px-3 py-3.5 whitespace-nowrap">Day</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Workout Session</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Exercise Name</th>
                <th className="px-3 py-3.5 whitespace-nowrap">Category</th>
                <th className="px-3 py-3.5 whitespace-nowrap">Volume &amp; Hold</th>
                <th className="px-3 py-3.5 whitespace-nowrap">Frequency</th>
                <th className="px-3 py-3.5 whitespace-nowrap">Target Runner</th>
                <th className="px-4 py-3.5 min-w-[280px]">Key Biomechanical Form Cues</th>
                <th className="px-4 py-3.5 min-w-[200px]">Joint-Friendly Modification</th>
                <th className="px-4 py-3.5 whitespace-nowrap text-center">Video Demo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-normal text-slate-300">
              {tableRows.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-500">
                    <TableIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    No exercises match the selected filters. Try broadening your criteria.
                  </td>
                </tr>
              ) : (
                tableRows.map((row) => {
                  if (row.isRest) {
                    return (
                      <tr key={row.id} className="bg-slate-950/40 hover:bg-slate-800/20 transition">
                        <td className="px-4 py-3 whitespace-nowrap font-semibold text-slate-400">
                          Week {row.weekNumber}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap font-medium text-slate-400">
                          {row.dayName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-slate-400 font-medium">
                          {row.workoutTitle}
                        </td>
                        <td colSpan={7} className="px-4 py-3 text-slate-500 italic">
                          Rest &amp; Nervous System Restoration — Light walking &amp; hydration.
                        </td>
                        <td className="px-4 py-3 text-center text-slate-600">—</td>
                      </tr>
                    );
                  }

                  const ex = row.exercise!;
                  const isBoth = ex.targetAthletes.length === 2;
                  const targetLabel = isBoth
                    ? 'Arwel & Helen'
                    : ex.targetAthletes[0] === 'arwel'
                    ? 'Arwel Thomas'
                    : 'Helen Shanley';

                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-800/40 transition border-b border-slate-800/50"
                    >
                      {/* Week / Phase */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white">W{row.weekNumber}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                              row.phase === 1
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : row.phase === 2
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}
                          >
                            P{row.phase}
                          </span>
                        </div>
                      </td>

                      {/* Day */}
                      <td className="px-3 py-3 whitespace-nowrap font-medium text-slate-300">
                        {row.dayName.slice(0, 3)}
                      </td>

                      {/* Workout Session */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-slate-200 font-medium block">{row.workoutTitle}</span>
                        <span className="text-[10px] text-slate-500 block truncate max-w-[150px]">
                          {row.focus}
                        </span>
                      </td>

                      {/* Exercise Name */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-bold text-white text-[13px]">{ex.name}</span>
                        <span className="block text-[10px] text-slate-500">{ex.equipment}</span>
                      </td>

                      {/* Category */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-[10px]">
                          {ex.category}
                        </span>
                      </td>

                      {/* Sets & Reps */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className="font-semibold text-emerald-400">
                          {row.customSets || ex.defaultSets} sets
                        </span>
                        <span className="block text-slate-400 text-[11px]">
                          {row.customReps || ex.defaultReps}
                        </span>
                      </td>

                      {/* Frequency */}
                      <td className="px-3 py-3 whitespace-nowrap text-slate-400 font-medium">
                        {ex.frequency}
                      </td>

                      {/* Target Runner */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            isBoth
                              ? 'bg-purple-500/10 text-purple-300 border-purple-500/20'
                              : ex.targetAthletes[0] === 'arwel'
                              ? 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                              : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                          }`}
                        >
                          {targetLabel}
                        </span>
                      </td>

                      {/* Form Cues */}
                      <td className="px-4 py-3 text-slate-300 text-[11px] leading-relaxed">
                        <p className="line-clamp-2 hover:line-clamp-none transition-all cursor-pointer text-slate-300 hover:text-white">
                          {ex.techniqueCues[0]} {ex.techniqueCues[1] ? `• ${ex.techniqueCues[1]}` : ''}
                        </p>
                      </td>

                      {/* Modification */}
                      <td className="px-4 py-3 text-slate-400 text-[11px] leading-relaxed">
                        <p className="line-clamp-2 hover:line-clamp-none transition-all">
                          {ex.jointFriendlyModification}
                        </p>
                      </td>

                      {/* Video Link & Watch Modal Button */}
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <a
                            href={ex.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Watch ${ex.name} video on YouTube`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-600/90 hover:bg-red-600 text-white rounded-lg text-[11px] font-bold shadow transition hover:scale-105 active:scale-95"
                            title={`Open ${ex.name} demo on YouTube`}
                          >
                            <Youtube className="w-3.5 h-3.5 fill-current" />
                            <span>YouTube ↗</span>
                          </a>
                          <button
                            onClick={() => onOpenVideo(ex)}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-[11px] font-medium transition"
                            title="View biomechanical form cues"
                          >
                            <span>Cues</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
