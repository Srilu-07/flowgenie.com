import React from 'react';
import { 
  ShieldAlert, 
  Lock, 
  ArrowLeft, 
  UserCheck, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { UserRole, ROLE_PERMISSIONS } from '../types/agent';

interface AccessDeniedProps {
  sectionName: string;
  requiredRoles: UserRole[];
  currentRole: UserRole;
  onSwitchRole: (newRole: UserRole) => void;
  onNavigate: (route: string) => void;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  sectionName,
  requiredRoles,
  currentRole,
  onSwitchRole,
  onNavigate
}) => {
  const currentPerms = ROLE_PERMISSIONS[currentRole] || ROLE_PERMISSIONS['Employee'];

  return (
    <div className="max-w-3xl mx-auto my-8 p-8 rounded-2xl bg-[#141619] border border-red-900/40 shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/5 blur-3xl pointer-events-none" />

      {/* Header Badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5" />
          403 FORBIDDEN · ROLE-BASED ACCESS CONTROL (RBAC)
        </span>
        <span className="text-xs font-mono text-slate-400">Zero-Trust Enforcement</span>
      </div>

      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 rounded-2xl bg-[#0B0C0E] border border-red-500/40 text-red-400 shrink-0 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Restricted Access: {sectionName}
          </h1>
          <p className="text-sm text-slate-400 mt-1 leading-relaxed">
            Your current enterprise clearance level does not authorize access to this multi-agent governance boundary. Access has been logged in the SOC-2 immutable audit ledger.
          </p>
        </div>
      </div>

      {/* Role Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 font-mono text-xs">
        <div className="p-4 rounded-xl bg-[#0B0C0E] border border-[#22272F] space-y-2">
          <span className="text-slate-400 text-[11px] uppercase tracking-wider block">Your Current Identity</span>
          <div className="flex items-center justify-between">
            <span className="text-white font-bold text-sm">{currentRole}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${currentPerms.badgeClass}`}>
              {currentPerms.clearanceLevel.split('·')[0]}
            </span>
          </div>
          <p className="text-slate-400 text-[11px] font-sans leading-relaxed">
            {currentPerms.description}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0B0C0E] border border-cyan-500/30 space-y-2">
          <span className="text-cyan-400 text-[11px] uppercase tracking-wider block">Required Role Clearance</span>
          <div className="flex flex-wrap gap-1.5">
            {requiredRoles.map((role) => (
              <span
                key={role}
                className="px-2.5 py-1 rounded bg-cyan-950/40 text-cyan-300 font-bold border border-cyan-500/40 text-xs"
              >
                {role}
              </span>
            ))}
          </div>
          <p className="text-slate-400 text-[11px] font-sans leading-relaxed">
            Requires elevated operational or platform administration clearance to inspect or manipulate this subsystem.
          </p>
        </div>
      </div>

      {/* Quick Role Switcher for Hackathon Judges & Testing */}
      <div className="p-5 rounded-xl bg-[#0B0C0E] border border-[#22272F] mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white font-mono">Simulate Role Elevation (Interactive Demo):</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Instant RBAC Toggle</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {(['HR Admin', 'HR Manager', 'Employee'] as UserRole[]).map((role) => {
            const isSelected = currentRole === role;
            return (
              <button
                key={role}
                onClick={() => onSwitchRole(role)}
                className={`px-3 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                    : 'bg-[#141619] hover:bg-[#1c2026] text-slate-300 border border-[#22272F]'
                }`}
              >
                <span>{role}</span>
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => onNavigate('/dashboard')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1c2026] hover:bg-[#22272F] text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard Overview</span>
        </button>

        <button
          onClick={() => onNavigate('/dashboard/settings')}
          className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
        >
          View Role Permission Matrix in Settings →
        </button>
      </div>
    </div>
  );
};
