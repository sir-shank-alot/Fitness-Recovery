import React, { useState } from 'react';
import { FitnessSyncService, AthleteProfile } from '../types/rehab';
import {
  Watch,
  Heart,
  RefreshCw,
  CheckCircle,
  Activity,
  Footprints,
  Radio,
  Download,
  AlertCircle,
  Zap,
} from 'lucide-react';

interface HealthSyncViewProps {
  athlete: AthleteProfile;
  syncServices: FitnessSyncService[];
  onToggleConnection: (serviceId: string) => void;
  onSyncServiceNow: (serviceId: string) => void;
}

export const HealthSyncView: React.FC<HealthSyncViewProps> = ({
  athlete,
  syncServices,
  onToggleConnection,
  onSyncServiceNow,
}) => {
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [exportNotice, setExportNotice] = useState(false);

  const handleManualSync = (id: string) => {
    setSyncingId(id);
    setTimeout(() => {
      onSyncServiceNow(id);
      setSyncingId(null);
    }, 1200);
  };

  const handleExportClinicalReport = () => {
    const reportData = {
      athleteName: athlete.name,
      age: athlete.age,
      weightKg: athlete.weightKg,
      injuries: athlete.injuries.map((i) => i.title),
      exportedAt: new Date().toISOString(),
      connectedServices: syncServices.filter((s) => s.connected).map((s) => s.name),
      averageCadenceSpM: 174,
      groundContactBalance: '49.8% L / 50.2% R',
      hrvStatus: 'Elevated & Recovering (62ms avg)',
      recoveryRecommendation:
        'Continue 12-week rehabilitation protocol. Monitor right adductor tension and plantar fascia morning VAS.',
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Clinical_Health_Report_${athlete.name.replace(/\s+/g, '_')}.json`;
    link.click();

    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Watch className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white">Fitness &amp; Wearables Health Sync Hub</h2>
          </div>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Stream live biometric recovery metrics (HRV, resting heart rate, running cadence, and
            ground contact balance) directly from Garmin Connect, Apple Health, and Strava for{' '}
            <strong className="text-white">{athlete.name}</strong>.
          </p>
        </div>

        <button
          onClick={handleExportClinicalReport}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition shadow-sm shrink-0"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export Clinical Summary</span>
        </button>
      </div>

      {exportNotice && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Clinical Health &amp; Biometrics Summary exported successfully for physician review!
          </span>
        </div>
      )}

      {/* Sync Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {syncServices.map((service) => {
          const isSyncing = syncingId === service.id;
          return (
            <div
              key={service.id}
              className={`p-6 rounded-2xl border transition shadow-xl flex flex-col justify-between space-y-4 ${
                service.connected
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-950/60 border-slate-800/50 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
                      service.connected
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {service.id === 'garmin' && <Watch className="w-6 h-6 text-blue-400" />}
                    {service.id === 'apple_health' && <Heart className="w-6 h-6 text-rose-400" />}
                    {service.id === 'strava' && <Activity className="w-6 h-6 text-amber-400" />}
                    {service.id === 'fitbit' && <Radio className="w-6 h-6 text-teal-400" />}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{service.name}</h3>
                    <p className="text-xs text-slate-400">
                      {service.connected
                        ? `Last synced: ${service.lastSyncedAt || 'Just now'}`
                        : 'Integration disconnected'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onToggleConnection(service.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    service.connected
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                  }`}
                >
                  {service.connected ? 'Disconnect' : 'Connect'}
                </button>
              </div>

              {/* Metrics Showcase */}
              {service.connected ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-800/80">
                  <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                      Daily Steps
                    </span>
                    <span className="text-base font-bold text-white">
                      {service.metrics.dailySteps.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                      Resting HR
                    </span>
                    <span className="text-base font-bold text-emerald-400">
                      {service.metrics.restingHeartRate} bpm
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                      HRV (Recovery)
                    </span>
                    <span className="text-base font-bold text-cyan-400">
                      {service.metrics.hrvMs} ms
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                      Cadence Avg
                    </span>
                    <span className="text-base font-bold text-white">
                      {service.metrics.cadenceAvgSpM} spm
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40 col-span-2">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                      Ground Contact Balance (L/R)
                    </span>
                    <span className="text-sm font-bold text-emerald-300">
                      {service.metrics.groundContactBalance}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/60 text-xs text-slate-400 flex items-center justify-between">
                  <span>Connect {service.name} to import automated GPS and biometrics.</span>
                </div>
              )}

              {/* Sync Trigger Action */}
              {service.connected && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleManualSync(service.id)}
                    disabled={isSyncing}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-400 transition"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Fetching Data...' : 'Sync Telemetry Now'}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Ground Contact Time Biomechanical Note for Arwel and Helen */}
      <div className="p-5 rounded-2xl bg-blue-950/20 border border-blue-900/40 space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
          <Footprints className="w-4 h-4" /> Why Ground Contact Time Balance Matters in This Protocol
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          For <strong className="text-white">Arwel Thomas</strong>, an adductor strain causes early swing-phase
          inhibition, which manifests as prolonged ground contact time on the right foot (&gt;52% right) and
          subsequent toe scuffing. For <strong className="text-white">Helen Shanley</strong>, asymmetry indicates
          antalgic guarding of the right plantar fascia or lateral hip drop from GTPS. Aiming for 49.5–50.5%
          balance confirms symmetrical neuromuscular restoration.
        </p>
      </div>
    </div>
  );
};
