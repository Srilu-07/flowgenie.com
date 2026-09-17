import React, { useState, useRef } from 'react';
import { 
  Settings, 
  User, 
  Save, 
  RotateCcw, 
  ShieldAlert, 
  Database, 
  Key, 
  CheckCircle2, 
  Lock, 
  Building2, 
  Copy, 
  Check, 
  Upload, 
  X, 
  ShieldCheck, 
  Sparkles, 
  RefreshCw,
  Image as ImageIcon,
  UserCheck,
  FileText
} from 'lucide-react';
import { UserProfile, UserRole, ROLE_PERMISSIONS } from '../types/agent';
import { resizeImageToBase64, PRESET_AVATARS } from '../utils/imageUtils';

interface SettingsPanelProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onResetPlatformData: () => void;
  onSwitchRole: (role: UserRole) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  user,
  onUpdateUser,
  onResetPlatformData,
  onSwitchRole
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'rbac' | 'database'>('profile');
  
  // Profile form state
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio || 'Autonomous workplace systems architect & Tier-1 SOC-2 security controller.');
  const [avatarUrl, setAvatarUrl] = useState<string>(user.avatarUrl || '');
  const [title, setTitle] = useState(user.title || 'Lead Workplace Operations & Security Controller');
  const [isDragging, setIsDragging] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentRolePerms = ROLE_PERMISSIONS[user.role] || ROLE_PERMISSIONS['Employee'];

  // Handle image file selection
  const processImageFile = async (file: File) => {
    setUploadError(null);
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (.png, .jpg, .webp).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size exceeds 5MB limit. Please choose a smaller file.');
      return;
    }

    try {
      const resizedBase64 = await resizeImageToBase64(file, 256, 256);
      setAvatarUrl(resizedBase64);
    } catch (err) {
      setUploadError('Failed to process image file. Please try another image.');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      name: name.trim() || user.name,
      email: email.trim() || user.email,
      bio: bio.trim(),
      avatarUrl: avatarUrl,
      title: title.trim()
    };

    onUpdateUser(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSelectPreset = (url: string) => {
    setAvatarUrl(url);
  };

  const sampleSqlSchema = `-- PostgreSQL Schema for FlowGenie HR Multi-Tenant System
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    tier VARCHAR(32) DEFAULT 'ENTERPRISE_SOC2',
    hmac_secret_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(64) DEFAULT 'HR_ADMIN',
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    workflow_id UUID,
    agent_name VARCHAR(128) NOT NULL,
    action_type VARCHAR(128) NOT NULL,
    raw_payload JSONB NOT NULL,
    hmac_sha256_signature VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sampleSqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const allRoles: UserRole[] = ['HR Admin', 'HR Manager', 'Employee'];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#141619] border border-[#22272F] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5" />
              SETTINGS & IDENTITY CONTROL PANEL
            </span>
            <span className={`text-xs font-mono px-2 py-0.5 rounded border ${currentRolePerms.badgeClass}`}>
              Role: {user.role}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            User Profile & Role-Based Access Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Manage your user avatar, display identity, and short bio with local storage persistence. Inspect the active Role-Based Access Control (RBAC) security matrix.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-[#0B0C0E] p-1 rounded-xl border border-[#22272F] shrink-0">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>User Profile</span>
          </button>
          <button
            onClick={() => setActiveTab('rbac')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'rbac'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>RBAC Matrix</span>
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'database'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Schema</span>
          </button>
        </div>
      </div>

      {/* TAB 1: User Profile System */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Form (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-[#141619] border border-[#22272F] shadow-xl">
              <div className="flex items-center justify-between border-b border-[#22272F] pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <User className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h2 className="text-base font-bold text-white">Operator Profile System</h2>
                    <p className="text-xs text-slate-400">
                      Avatar, display name, and bio are persisted to <code className="text-cyan-400 font-mono">localStorage</code>.
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Local Persistence Active
                </span>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                {/* Avatar Upload Section (Drag & Drop + Click) */}
                <div>
                  <label className="block text-slate-300 font-semibold text-xs mb-2">
                    Profile Avatar (Upload or Choose Preset)
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                    {/* Current Avatar Preview */}
                    <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#0B0C0E] border border-[#22272F]">
                      {avatarUrl ? (
                        <div className="relative group">
                          <img
                            src={avatarUrl}
                            alt="Avatar Preview"
                            referrerPolicy="no-referrer"
                            className="w-24 h-24 rounded-2xl object-cover border-2 border-cyan-500/60 shadow-[0_0_15px_rgba(0,240,255,0.25)]"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveAvatar}
                            className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-400 transition-colors shadow-md cursor-pointer"
                            title="Remove Avatar"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center text-white font-extrabold text-2xl border-2 border-[#22272F]">
                          {name ? name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'AM'}
                        </div>
                      )}
                      <span className="text-[11px] font-mono text-slate-400 mt-2 text-center">
                        {avatarUrl ? 'Custom Avatar Set' : 'Initials Fallback'}
                      </span>
                    </div>

                    {/* Drag and Drop Zone */}
                    <div className="sm:col-span-2">
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-4 sm:p-5 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                          isDragging
                            ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]'
                            : 'border-[#2A303C] hover:border-cyan-500/50 bg-[#0B0C0E]/70 hover:bg-[#0B0C0E]'
                        }`}
                      >
                        <Upload className="w-6 h-6 text-cyan-400 mb-2" />
                        <p className="text-xs font-medium text-slate-200">
                          <span className="text-cyan-400 font-bold underline">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1 font-mono">
                          PNG, JPG, or WEBP up to 5MB (Auto-compressed to 256x256)
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/png, image/jpeg, image/webp"
                          onChange={handleFileInputChange}
                          className="hidden"
                        />
                      </div>

                      {uploadError && (
                        <p className="text-xs text-red-400 mt-1.5 font-mono">
                          {uploadError}
                        </p>
                      )}

                      {/* Preset Avatars Bar */}
                      <div className="mt-3">
                        <span className="text-[10px] font-mono text-slate-400 block mb-1.5">
                          Or select an executive avatar preset:
                        </span>
                        <div className="flex items-center gap-2">
                          {PRESET_AVATARS.map((preset) => (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => handleSelectPreset(preset.url)}
                              className={`w-9 h-9 rounded-xl overflow-hidden border transition-all cursor-pointer ${
                                avatarUrl === preset.url
                                  ? 'border-cyan-400 ring-2 ring-cyan-500/40 scale-105'
                                  : 'border-[#22272F] hover:border-slate-500 opacity-80 hover:opacity-100'
                              }`}
                              title={preset.label}
                            >
                              <img
                                src={preset.url}
                                alt={preset.label}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                          {avatarUrl && (
                            <button
                              type="button"
                              onClick={handleRemoveAvatar}
                              className="text-[10px] font-mono text-red-400 hover:text-red-300 ml-2 cursor-pointer"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Display Name Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-slate-300 font-semibold text-xs">
                      Display Name
                    </label>
                    <span className="text-[10px] font-mono text-slate-400">Required</span>
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Mercer"
                    className="w-full bg-[#0B0C0E] border border-[#22272F] rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>

                {/* Corporate Email Address */}
                <div>
                  <label className="block text-slate-300 font-semibold text-xs mb-1.5">
                    Corporate Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. alex.mercer@helpxgrow.ai"
                    className="w-full bg-[#0B0C0E] border border-[#22272F] rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>

                {/* Short Bio Textarea */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-slate-300 font-semibold text-xs">
                      Short Bio (Operator Philosophy / Focus)
                    </label>
                    <span className={`text-[10px] font-mono ${bio.length > 200 ? 'text-red-400 font-bold' : 'text-slate-400'}`}>
                      {bio.length} / 200 chars
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={bio}
                    maxLength={200}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Describe your role, focus areas, and agent supervision responsibilities..."
                    className="w-full bg-[#0B0C0E] border border-[#22272F] rounded-xl p-3 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none leading-relaxed"
                  />
                </div>

                {/* Save Button & Feedback */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.25)]"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Profile to LocalStorage</span>
                  </button>

                  {savedSuccess && (
                    <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-lg animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Profile & Avatar Persisted!</span>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Right Sidebar: Live Profile Preview & Role Badge */}
          <div className="space-y-6">
            {/* Live Profile Card */}
            <div className="p-6 rounded-2xl bg-[#141619] border border-[#22272F] space-y-4">
              <div className="flex items-center justify-between border-b border-[#22272F] pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Live Profile Preview</span>
                <span className="text-[10px] font-mono text-cyan-400">Active Identity</span>
              </div>

              <div className="flex items-center gap-3.5">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-500/60 shadow-md shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center text-white font-extrabold text-lg shrink-0">
                    {name ? name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'AM'}
                  </div>
                )}
                <div className="overflow-hidden">
                  <h3 className="text-sm font-bold text-white truncate">{name}</h3>
                  <p className="text-xs text-slate-400 font-mono truncate">{email}</p>
                  <span className={`inline-block mt-1 text-[9px] font-mono px-2 py-0.5 rounded border ${currentRolePerms.badgeClass}`}>
                    {user.role}
                  </span>
                </div>
              </div>

              {bio && (
                <div className="p-3 rounded-xl bg-[#0B0C0E] border border-[#22272F] text-[11px] font-mono text-slate-300 leading-relaxed italic">
                  "{bio}"
                </div>
              )}

              <div className="pt-2 border-t border-[#22272F] text-[11px] font-mono text-slate-400 space-y-1.5">
                <div className="flex justify-between">
                  <span>Tenant:</span>
                  <span className="text-emerald-400 font-bold">{user.tenant}</span>
                </div>
                <div className="flex justify-between">
                  <span>Clearance:</span>
                  <span className="text-slate-200">{currentRolePerms.clearanceLevel.split('·')[0]}</span>
                </div>
              </div>
            </div>

            {/* Quick Role Switcher for Demo */}
            <div className="p-5 rounded-2xl bg-[#141619] border border-[#22272F] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white font-mono">RBAC Role Switcher:</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Demo Testing</span>
              </div>
              <p className="text-xs text-slate-400">
                Switch roles below to test section restrictions across the application:
              </p>

              <div className="space-y-1.5">
                {allRoles.map((role) => {
                  const isCurrent = user.role === role;
                  const cfg = ROLE_PERMISSIONS[role];
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => onSwitchRole(role)}
                      className={`w-full p-2.5 rounded-xl border text-xs font-mono text-left transition-all cursor-pointer flex items-center justify-between ${
                        isCurrent
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm font-bold'
                          : 'bg-[#0B0C0E] hover:bg-[#1c2026] text-slate-400 border-[#22272F]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span>{role}</span>
                          {role === 'HR Admin' && <span className="text-[9px] text-cyan-400">(Default)</span>}
                        </div>
                        <span className="text-[10px] text-slate-500 block">{cfg.clearanceLevel}</span>
                      </div>
                      {isCurrent && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RBAC Matrix & Clearance Tiers */}
      {activeTab === 'rbac' && (
        <div className="space-y-6">
          {/* Active Role Card */}
          <div className="p-6 rounded-2xl bg-[#141619] border border-cyan-500/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block mb-1">
                Active Session Role:
              </span>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>{user.name}</span>
                <span className={`text-xs px-2.5 py-0.5 rounded border ${currentRolePerms.badgeClass}`}>
                  {user.role}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                {currentRolePerms.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-mono text-slate-400">Switch Role:</span>
              <div className="flex gap-1">
                {allRoles.map((role) => (
                  <button
                    key={role}
                    onClick={() => onSwitchRole(role)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      user.role === role
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'bg-[#0B0C0E] text-slate-400 hover:text-white border border-[#22272F]'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RBAC Matrix Table */}
          <div className="rounded-2xl bg-[#141619] border border-[#22272F] overflow-hidden shadow-xl">
            <div className="p-5 border-b border-[#22272F] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Enterprise Role-Based Access Control (RBAC) Matrix</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Permissions enforced on both client routing and multi-agent execution boundaries.
                </p>
              </div>
              <span className="text-[11px] font-mono text-cyan-400">SOC-2 Type II Verified</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#22272F] bg-[#0B0C0E]/80 font-mono text-slate-400 text-[11px] uppercase tracking-wider">
                    <th className="py-3.5 px-4">Dashboard Section / Capability</th>
                    <th className="py-3.5 px-4 text-center">
                      <span className="text-cyan-300">HR Admin (Alex Mercer)</span>
                    </th>
                    <th className="py-3.5 px-4 text-center">
                      <span className="text-emerald-300">HR Manager</span>
                    </th>
                    <th className="py-3.5 px-4 text-center">
                      <span className="text-amber-300">Employee</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#22272F]/60 font-mono">
                  <tr>
                    <td className="py-3.5 px-4 text-white font-semibold">
                      Overview Telemetry Dashboard (/dashboard)
                      <span className="block text-[11px] font-normal text-slate-400">High-level autonomous metrics and speedup statistics</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">FULL</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">FULL</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">READ-ONLY</span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3.5 px-4 text-white font-semibold">
                      Onboarding Pipeline Runner (/dashboard/onboarding)
                      <span className="block text-[11px] font-normal text-slate-400">Launch 5-step autonomous multi-agent HRIS provisioning DAG</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">EXECUTE</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">EXECUTE</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-red-950/40 text-red-400 border border-red-500/30 text-[11px]">LOCKED</span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3.5 px-4 text-white font-semibold">
                      System Architecture & Model Matrix (/dashboard/architecture)
                      <span className="block text-[11px] font-normal text-slate-400">Inspect and dynamically route Claude Sonnet 4 / Haiku 3.5</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">MANAGE</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-red-950/40 text-red-400 border border-red-500/30 text-[11px]">LOCKED</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-red-950/40 text-red-400 border border-red-500/30 text-[11px]">LOCKED</span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3.5 px-4 text-white font-semibold">
                      Agent Communication Mesh (/dashboard/agent-map)
                      <span className="block text-[11px] font-normal text-slate-400">Direct topological visualization and live thought routing simulation</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">MANAGE</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-red-950/40 text-red-400 border border-red-500/30 text-[11px]">LOCKED</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-red-950/40 text-red-400 border border-red-500/30 text-[11px]">LOCKED</span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3.5 px-4 text-white font-semibold">
                      Cryptographic Audit Trail (/dashboard/audit-trail)
                      <span className="block text-[11px] font-normal text-slate-400">Verify SHA-256 HMAC signatures and tamper proofing</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">FULL</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">FULL</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-red-950/40 text-red-400 border border-red-500/30 text-[11px]">LOCKED</span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3.5 px-4 text-white font-semibold">
                      User Profile System & Local Storage
                      <span className="block text-[11px] font-normal text-slate-400">Upload avatar, update display name, and maintain short bio</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">ENABLED</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">ENABLED</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">ENABLED</span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3.5 px-4 text-white font-semibold">
                      Platform Reset & KMS Key Rotation
                      <span className="block text-[11px] font-normal text-slate-400">Purge session tokens and reset multi-agent simulation</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">AUTHORIZED</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-red-950/40 text-red-400 border border-red-500/30 text-[11px]">RESTRICTED</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-red-950/40 text-red-400 border border-red-500/30 text-[11px]">RESTRICTED</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Database Schema & Danger Zone */}
      {activeTab === 'database' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-[#141619] border border-[#22272F] shadow-xl">
              <div className="flex items-center justify-between border-b border-[#22272F] pb-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <Database className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h2 className="text-base font-bold text-white">PostgreSQL Data Architecture</h2>
                    <p className="text-xs text-slate-400">
                      Production schema for multi-tenant organizations and audit trails.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCopySql}
                  className="px-3 py-1.5 rounded-lg bg-[#1c2026] text-cyan-300 text-xs font-mono font-bold hover:bg-[#22272F] cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Copied' : 'Copy SQL'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-[#0B0C0E] border border-[#22272F] text-slate-300 overflow-x-auto max-h-80 font-mono text-xs">
                {sampleSqlSchema}
              </pre>
            </div>
          </div>

          <div className="space-y-6">
            {/* Tenant Card */}
            <div className="p-6 rounded-2xl bg-[#141619] border border-[#22272F] space-y-4">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Active Tenant</h3>
                  <p className="text-xs text-slate-400">Corporate Boundary</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0B0C0E] border border-[#22272F] font-mono text-xs space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Tenant Name:</span>
                  <span className="text-emerald-400 font-bold">{user.tenant}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Tier:</span>
                  <span className="text-white">ENTERPRISE_SOC2</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>KMS Key:</span>
                  <span className="text-cyan-400">arn:aws:kms:us-east-1:2026</span>
                </div>
              </div>
            </div>

            {/* Reset Platform Data Card (Restricted by RBAC) */}
            <div className={`p-6 rounded-2xl border space-y-4 ${
              currentRolePerms.canResetPlatform
                ? 'bg-gradient-to-b from-[#141619] to-red-950/20 border-red-900/40'
                : 'bg-[#141619] border-[#22272F] opacity-75'
            }`}>
              <div className="flex items-center gap-2.5 text-red-400">
                <ShieldAlert className="w-5 h-5" />
                <div>
                  <h3 className="text-sm font-bold text-white">Reset Platform Data</h3>
                  <p className="text-xs text-slate-400">Danger Zone (Admin Only)</p>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Clears session cookies (<code className="text-red-300">flowgenie_session</code>), clears local storage, resets the simulated multi-agent state, and logs you out to the OAuth gatekeeper.
              </p>

              {currentRolePerms.canResetPlatform ? (
                <button
                  id="reset-platform-data-btn"
                  onClick={onResetPlatformData}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-300 font-bold text-xs transition-all cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.15)]"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Platform Data & Cookies</span>
                </button>
              ) : (
                <div className="p-3 rounded-xl bg-[#0B0C0E] border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Requires 'HR Admin' role to execute platform reset.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
