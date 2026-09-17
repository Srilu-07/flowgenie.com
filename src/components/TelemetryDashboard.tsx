import React from 'react';
import { 
  CheckCircle2, 
  Zap, 
  Cpu, 
  ShieldCheck, 
  ArrowRight, 
  Activity, 
  Terminal, 
  Network, 
  FileCheck, 
  Lock, 
  Sparkles, 
  TrendingUp, 
  Server, 
  Clock, 
  MessageSquareQuote, 
  Flame, 
  BellRing, 
  AlertTriangle,
  PlayCircle
} from 'lucide-react';
import { TelemetryMetrics, UserRole, ROLE_PERMISSIONS } from '../types/agent';

interface TelemetryDashboardProps {
  onNavigate: (route: string) => void;
  metrics: TelemetryMetrics;
  userRole?: UserRole;
  activeAlertsCount?: number;
  overdueTasksCount?: number;
}

export const TelemetryDashboard: React.FC<TelemetryDashboardProps> = ({
  onNavigate,
  metrics,
  userRole = 'HR Admin',
  activeAlertsCount = 2,
  overdueTasksCount = 2
}) => {
  const currentPerms = ROLE_PERMISSIONS[userRole] || ROLE_PERMISSIONS['Employee'];
  const canRunPipeline = currentPerms.canExecuteOnboarding;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#141619] border border-[#22272F] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              AUTONOMOUS DISPATCH ENGINE ACTIVE
            </span>
            <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${currentPerms.badgeClass}`}>
              Identity: {userRole} ({currentPerms.clearanceLevel.split('·')[0].trim()})
            </span>
            <span className="text-xs text-slate-400 font-mono">SOC-2 Sealed</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Workplace Orchestration Telemetry
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Real-time multi-agent telemetry stream. 6 specialized AI models autonomously processing Workday HRIS ingestion, role SLA validation, and SaaS toolchain provisioning.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 relative z-10">
          {canRunPipeline ? (
            <button
              id="run-pipeline-banner-btn"
              onClick={() => onNavigate('/dashboard/onboarding')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all cursor-pointer group"
            >
              <span>Run Onboarding Pipeline</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button
              id="run-pipeline-banner-btn"
              onClick={() => onNavigate('/dashboard/onboarding')}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#1c2026] text-slate-400 hover:text-slate-200 border border-[#2A303C] font-semibold text-xs transition-all cursor-pointer group"
              title="Pipeline execution requires HR Manager or Admin clearance"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Pipeline Locked (Requires Ops Clearance)</span>
            </button>
          )}
        </div>
      </div>

      {/* URGENT HR INACTIVITY ALERT BANNER */}
      {activeAlertsCount > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-950/40 via-[#141619] to-red-950/20 border border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.15)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 shrink-0">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/30 text-red-200 border border-red-500/40">
                  {activeAlertsCount} ACTIVE HR ESCALATIONS
                </span>
                <span className="text-xs font-mono text-slate-400">Employee Inactivity Detected</span>
              </div>
              <p className="text-sm font-bold text-white mt-1">
                Employee(s) are overdue or not completing compliance tasks (48h inactivity breach).
              </p>
              <p className="text-xs text-red-300/80 font-mono mt-0.5">
                Autonomous SLA Watchdog has triggered notifications to People Ops and queued self-correcting interventions.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('/dashboard/tasks-sla')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-400 font-mono text-xs font-bold transition-all cursor-pointer shadow-lg shrink-0"
          >
            <BellRing className="w-4 h-4" />
            <span>Review Alerts & Self-Correct →</span>
          </button>
        </div>
      )}

      {/* Metric Cards Grid - Core Telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Total Tasks Completed */}
        <div className="p-5 rounded-2xl bg-[#141619] border border-[#22272F] hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-all group relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-mono tracking-wider uppercase">Total Tasks Completed</span>
            <div className="p-2 rounded-lg bg-[#1c2026] text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
            {metrics.totalTasksCompleted.toLocaleString()}
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs font-mono text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>↑ 100% Autonomy</span>
            <span className="text-slate-400 text-[11px] ml-1">(Zero human bottleneck)</span>
          </div>
        </div>

        {/* Card 2: Speedup Factor */}
        <div className="p-5 rounded-2xl bg-[#141619] border border-[#22272F] hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-all group relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-mono tracking-wider uppercase">Speedup Factor</span>
            <div className="p-2 rounded-lg bg-[#1c2026] text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
              <Zap className="w-4 h-4 fill-cyan-400/20" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-cyan-400 font-mono tracking-tight glow-cyan-sm">
            {metrics.speedupFactor}
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs font-mono text-slate-300">
            <span className="text-emerald-400 font-bold">4.2s avg</span>
            <span className="text-slate-400">vs 14.5 hrs manual HR</span>
          </div>
        </div>

        {/* Card 3: Active Agents */}
        <div className="p-5 rounded-2xl bg-[#141619] border border-[#22272F] hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all group relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-mono tracking-wider uppercase">Active Agents</span>
            <div className="p-2 rounded-lg bg-[#1c2026] text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
            {metrics.activeAgentsCount} Active
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>100% Healthy</span>
            <span className="text-slate-400 text-[11px] ml-1">Sonnet 4 & Haiku 3.5</span>
          </div>
        </div>

        {/* Card 4: Security Verification */}
        <div className="p-5 rounded-2xl bg-[#141619] border border-[#22272F] hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all group relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-mono tracking-wider uppercase">Security Verification</span>
            <div className="p-2 rounded-lg bg-[#1c2026] text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono tracking-tight glow-emerald-sm">
            {metrics.securityVerificationRate}
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs font-mono text-slate-300">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>SOC-2 / HMAC Signed</span>
          </div>
        </div>
      </div>

      {/* CORE CAPABILITY HUB ("WHERE ARE ALL THESE" SECTION) */}
      <div className="p-6 rounded-2xl bg-[#141619] border border-[#22272F] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#22272F] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h2 className="text-base font-bold text-white">Autonomous Enterprise Workflow Modules</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Complete multi-agent workplace suite across onboarding, meeting actions, SLA monitoring & tamper-proof audit trails.
            </p>
          </div>
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-2.5 py-1 rounded-full">
            All 4 Pillars Live
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pillar 1: Onboarding Pipeline */}
          <div 
            onClick={() => onNavigate('/dashboard/onboarding')}
            className="p-4 rounded-xl bg-[#0B0C0E] border border-[#22272F] hover:border-cyan-500/50 hover:bg-[#121418] transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
                <PlayCircle className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                1. Onboarding Pipeline
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Autonomous 5-step DAG provisioning Workday HRIS, role SLA matrices, GitHub teams & Slack channels.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-[11px] font-mono text-cyan-400 font-semibold">
              <span>Launch Pipeline</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Pillar 2: Meeting Actions */}
          <div 
            onClick={() => onNavigate('/dashboard/meetings')}
            className="p-4 rounded-xl bg-[#0B0C0E] border border-[#22272F] hover:border-cyan-500/50 hover:bg-[#121418] transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-3 group-hover:scale-110 transition-transform">
                <MessageSquareQuote className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                2. Meeting Actions Intelligence
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Autonomous transcript ingestion, commitment detection, deliverable owner mapping & deadline scheduling.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-[11px] font-mono text-sky-400 font-semibold">
              <span>View Meeting Actions</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Pillar 3: Tasks & SLA Watchdog */}
          <div 
            onClick={() => onNavigate('/dashboard/tasks-sla')}
            className="p-4 rounded-xl bg-[#0B0C0E] border border-red-500/30 hover:border-red-500/60 hover:bg-[#121418] transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-3 group-hover:scale-110 transition-transform">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-red-300 transition-colors">
                3. Tasks, Deadlines & HR Alerts
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Monitors employee task progress & inactivity. Automatically alerts HR and triggers self-correcting nudges.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-[11px] font-mono text-red-400 font-semibold">
              <span>View Watchdog & Alerts</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Pillar 4: Cryptographic Audit Trail */}
          <div 
            onClick={() => onNavigate('/dashboard/audit-trail')}
            className="p-4 rounded-xl bg-[#0B0C0E] border border-[#22272F] hover:border-emerald-500/50 hover:bg-[#121418] transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                4. Cryptographic Audit Vault
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Immutable SHA-256 HMAC digital signatures, tamper detection simulation & SOC-2 compliance ledger.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-semibold">
              <span>Inspect Audit Vault</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Lower Dual Section: Quick Launch & Real-time Autonomous Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Pipeline Quick Launch Card */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#141619] border border-[#22272F] space-y-5">
          <div className="flex items-center justify-between border-b border-[#22272F] pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Immediate Workflow Execution</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Targeted employee ready for autonomous DAG onboarding pipeline.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-[#1c2026] text-[11px] font-mono text-cyan-400 border border-[#2A303C]">
              Queue: Ready
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#0B0C0E] border border-[#22272F] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold font-mono text-lg shrink-0">
                AM
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">Arjun Mehta</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    SWE-II
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Core Infrastructure & Developer Velocity · Platform Team
                </p>
                <div className="flex items-center gap-2 mt-1.5 text-[11px] font-mono text-slate-400">
                  <span className="text-slate-300">Target Start: Oct 1, 2026</span>
                  <span>·</span>
                  <span className="text-emerald-400">Workday Status: Pre-Hire Cleared</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('/dashboard/onboarding')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all cursor-pointer shrink-0"
            >
              <span>Run Onboarding Pipeline →</span>
            </button>
          </div>

          {/* Mini Agent Mesh Preview Banner */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2">
            {[
              { name: 'Orchestrator', role: 'Routing', color: 'text-cyan-400' },
              { name: 'Retrieval', role: 'Workday HRIS', color: 'text-sky-400' },
              { name: 'Decision', role: 'SLA Matrix', color: 'text-indigo-400' },
              { name: 'Execution', role: 'Slack/GitHub', color: 'text-amber-400' },
              { name: 'Compliance', role: 'HMAC-SHA256', color: 'text-emerald-400' },
              { name: 'Audit', role: 'Ledger Seal', color: 'text-purple-400' }
            ].map((agent, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-[#0B0C0E] border border-[#22272F] text-center">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mx-auto mb-1 animate-pulse" />
                <p className="text-[11px] font-semibold text-slate-200 truncate">{agent.name}</p>
                <p className={`text-[10px] font-mono ${agent.color} truncate`}>{agent.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Live SOC-2 Cryptographic Ledger Status */}
        <div className="p-6 rounded-2xl bg-[#141619] border border-[#22272F] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>HMAC Audit Seal</span>
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-xs text-slate-400">
              Continuous cryptographic ledger verification. 100% of pipeline mutations are signed with SHA-256 HMAC keys.
            </p>

            <div className="mt-4 p-3 rounded-lg bg-[#0B0C0E] border border-[#22272F] space-y-2 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Algorithm</span>
                <span className="text-cyan-400 font-semibold">HMAC-SHA256</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Secret Key Vault</span>
                <span className="text-emerald-400 font-semibold">AWS KMS / HSM v2026</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Signed Records</span>
                <span className="text-slate-200">12,840 / 12,840</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tamper Detections</span>
                <span className="text-emerald-400 font-bold">0 Violations</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('/dashboard/audit-trail')}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0B0C0E] hover:bg-[#181B1F] border border-[#22272F] text-slate-300 hover:text-emerald-300 font-mono text-xs font-semibold transition-colors cursor-pointer"
          >
            <span>Verify Cryptographic Audit Trail →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
