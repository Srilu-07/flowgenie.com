import React, { useState } from 'react';
import { 
  Zap, 
  LayoutDashboard, 
  PlayCircle, 
  Cpu, 
  Network, 
  ShieldCheck, 
  Settings, 
  LogOut, 
  User, 
  ChevronDown, 
  Building2,
  CheckCircle2,
  Lock,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { UserProfile, UserRole, ROLE_PERMISSIONS } from '../types/agent';

interface NavigationProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  user: UserProfile;
  onLogout: () => void;
  onSwitchRole: (role: UserRole) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentRoute,
  onNavigate,
  user,
  onLogout,
  onSwitchRole
}) => {
  const [profileOpen, setProfileOpen] = useState(false);

  const roleConfig = ROLE_PERMISSIONS[user.role] || ROLE_PERMISSIONS['Employee'];

  const navItems: Array<{
    label: string;
    route: string;
    icon: React.ComponentType<{ className?: string }>;
    allowedRoles: UserRole[];
    badge?: string;
  }> = [
    { 
      label: 'Overview', 
      route: '/dashboard', 
      icon: LayoutDashboard,
      allowedRoles: ['HR Admin', 'Admin', 'HR Manager', 'Employee']
    },
    { 
      label: 'Onboarding Pipeline', 
      route: '/dashboard/onboarding', 
      icon: PlayCircle,
      allowedRoles: ['HR Admin', 'Admin', 'HR Manager'],
      badge: 'Ops'
    },
    { 
      label: 'System Architecture', 
      route: '/dashboard/architecture', 
      icon: Cpu,
      allowedRoles: ['HR Admin', 'Admin'],
      badge: 'Admin'
    },
    { 
      label: 'Agent Communication Mesh', 
      route: '/dashboard/agent-map', 
      icon: Network,
      allowedRoles: ['HR Admin', 'Admin'],
      badge: 'Admin'
    },
    { 
      label: 'Cryptographic Audit Trail', 
      route: '/dashboard/audit-trail', 
      icon: ShieldCheck,
      allowedRoles: ['HR Admin', 'Admin', 'HR Manager'],
      badge: 'Audit'
    },
    { 
      label: 'Settings & Security', 
      route: '/dashboard/settings', 
      icon: Settings,
      allowedRoles: ['HR Admin', 'Admin', 'HR Manager', 'Employee']
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0B0C0E]/95 backdrop-blur-md border-b border-[#22272F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tenant Badge */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('/dashboard')}
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
              title="FlowGenie HR Home"
            >
              <div className="w-9 h-9 rounded-lg bg-[#141619] border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 group-hover:shadow-[0_0_12px_rgba(0,240,255,0.35)] transition-all">
                <Zap className="w-5 h-5 fill-cyan-400/20 text-cyan-400" />
              </div>
              <div className="text-left">
                <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                  FlowGenie <span className="text-cyan-400 font-extrabold">HR</span>
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block -mt-0.5">
                  Autonomous Orchestrator
                </span>
              </div>
            </button>

            {/* Active Tenant Badge */}
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#141619] border border-[#22272F] text-xs font-mono text-slate-300">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">ORG:</span>
              <span className="font-semibold text-emerald-400">HELPxGROW AI</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
            </div>
          </div>

          {/* Desktop Navigation Links with RBAC indicators */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.route;
              const isAllowed = item.allowedRoles.includes(user.role);

              return (
                <button
                  key={item.route}
                  onClick={() => onNavigate(item.route)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer relative ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.15)] font-semibold'
                      : isAllowed
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-[#141619] border border-transparent'
                      : 'text-slate-500 hover:text-slate-400 hover:bg-[#141619]/60 border border-transparent opacity-75'
                  }`}
                  title={!isAllowed ? `Requires ${item.badge} clearance` : undefined}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : isAllowed ? 'text-slate-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {!isAllowed && (
                    <Lock className="w-2.5 h-2.5 text-amber-400/80 ml-0.5" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Profile Menu & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl bg-[#141619] hover:bg-[#1c2026] border border-[#22272F] text-xs transition-all cursor-pointer"
            >
              {/* User Avatar with fallback */}
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-lg object-cover border border-cyan-500/40 shrink-0"
                />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center text-white font-bold text-[11px] shrink-0">
                  {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
              )}

              <div className="text-left hidden sm:block max-w-[130px]">
                <p className="text-slate-200 font-medium leading-none truncate">{user.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded border ${roleConfig.badgeClass}`}>
                    {user.role}
                  </span>
                </div>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#141619] border border-[#22272F] shadow-2xl py-3 z-50 text-xs">
                {/* Profile Header */}
                <div className="px-4 pb-3 border-b border-[#22272F]">
                  <div className="flex items-center gap-3">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-xl object-cover border border-cyan-500/50"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                        {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <p className="text-slate-200 font-bold truncate">{user.name}</p>
                      <p className="text-slate-400 text-[11px] truncate font-mono">{user.email}</p>
                      <span className={`inline-block mt-1 text-[9px] font-mono px-1.5 py-0.5 rounded border ${roleConfig.badgeClass}`}>
                        {roleConfig.clearanceLevel.split('·')[0].trim()}
                      </span>
                    </div>
                  </div>

                  {user.bio && (
                    <p className="mt-2.5 text-[11px] text-slate-400 italic line-clamp-2 bg-[#0B0C0E] p-2 rounded-lg border border-[#22272F]">
                      "{user.bio}"
                    </p>
                  )}
                </div>

                {/* Interactive Role Switcher Section for Demo */}
                <div className="px-4 py-2.5 border-b border-[#22272F] bg-[#0B0C0E]/50">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 text-cyan-400" />
                      Role Switcher (RBAC Demo):
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {(['HR Admin', 'HR Manager', 'Employee'] as UserRole[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          onSwitchRole(r);
                        }}
                        className={`px-1.5 py-1 rounded text-[10px] font-mono font-semibold transition-all cursor-pointer ${
                          user.role === r
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                            : 'bg-[#141619] hover:bg-[#1c2026] text-slate-400 border border-[#22272F]'
                        }`}
                      >
                        {r === 'HR Admin' ? 'Admin' : r === 'HR Manager' ? 'Manager' : 'Employee'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nav Links */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      onNavigate('/dashboard/settings');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:bg-[#22272F] hover:text-cyan-400 transition-colors text-left"
                  >
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Edit Profile, Avatar & Bio</span>
                  </button>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      onNavigate('/dashboard/audit-trail');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:bg-[#22272F] hover:text-emerald-400 transition-colors text-left"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Cryptographic Audit Vault</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-[#22272F]">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-red-400 hover:bg-red-950/30 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out & Terminate Session</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="lg:hidden flex items-center gap-1 py-2 overflow-x-auto border-t border-[#22272F]/50 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.route;
            const isAllowed = item.allowedRoles.includes(user.role);

            return (
              <button
                key={item.route}
                onClick={() => onNavigate(item.route)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/40 font-semibold'
                    : isAllowed
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-500 opacity-60'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
                {!isAllowed && <Lock className="w-2.5 h-2.5 text-amber-500/80 ml-0.5" />}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
