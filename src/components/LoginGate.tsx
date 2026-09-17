import React, { useState } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  KeyRound, 
  Lock, 
  CheckCircle2, 
  Cpu, 
  Loader2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface LoginGateProps {
  onSuccessLogin: (provider: 'google_workspace' | 'github_enterprise') => void;
}

export const LoginGate: React.FC<LoginGateProps> = ({ onSuccessLogin }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [activeProvider, setActiveProvider] = useState<'google' | 'github' | null>(null);
  const [handshakeStep, setHandshakeStep] = useState<string>('');

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    if (isAuthenticating) return;

    setIsAuthenticating(true);
    setActiveProvider(provider);
    setHandshakeStep(`Initiating PKCE TLS 1.3 handshake with ${provider === 'google' ? 'Google Workspace' : 'GitHub Enterprise'} SSO...`);

    // Simulate real OAuth Handshake (1.2s delay as specified in requirements)
    await new Promise((resolve) => setTimeout(resolve, 400));
    setHandshakeStep('Exchanging authorization code for SOC-2 HMAC token...');
    await new Promise((resolve) => setTimeout(resolve, 400));
    setHandshakeStep('Verifying tenant HELPxGROW AI enterprise bounds...');
    await new Promise((resolve) => setTimeout(resolve, 400));

    // 3. Set session cookie: flowgenie_session=active; path=/
    document.cookie = 'flowgenie_session=active; path=/; max-age=86400; SameSite=Lax';

    // 4. Programmatically redirect
    onSuccessLogin(provider === 'google' ? 'google_workspace' : 'github_enterprise');
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient Cybernetic Glowing Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Grid Pattern Background */}
      <div 
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#00F0FF 1px, transparent 1px), linear-gradient(to right, #00F0FF 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Top Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#141619] border border-cyan-500/40 shadow-[0_0_25px_rgba(0,240,255,0.25)] mb-4">
            <Zap className="w-8 h-8 text-cyan-400 fill-cyan-400/20" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            FlowGenie <span className="text-cyan-400">HR</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono tracking-wide">
            Autonomous Multi-Agent Workplace Orchestrator
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141619] border border-emerald-500/30 text-[11px] font-mono text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SOC-2 Type II · HMAC Signed Autonomous Grid</span>
          </div>
        </div>

        {/* Glowing Obsidian Login Card */}
        <div className="bg-[#141619] border border-[#22272F] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl border-t-cyan-500/40">
          {/* Subtle top edge light */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />

          <div className="mb-6">
            <h2 className="text-lg font-bold text-white flex items-center justify-between">
              <span>Enterprise Identity Gate</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                v2026.4
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select your corporate identity provider to access the autonomous agent control plane.
            </p>
          </div>

          {/* Handshake Progress Indicator (Visible when authenticating) */}
          {isAuthenticating && (
            <div className="mb-6 p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/30 font-mono text-[11px] text-cyan-300 animate-pulse flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400 shrink-0" />
              <span className="truncate">{handshakeStep}</span>
            </div>
          )}

          {/* SSO Buttons */}
          <div className="space-y-3">
            {/* Google Workspace SSO */}
            <button
              id="google-sso-btn"
              onClick={() => handleOAuthLogin('google')}
              disabled={isAuthenticating}
              className={`w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                activeProvider === 'google' && isAuthenticating
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.3)]'
                  : 'bg-[#181B20] hover:bg-[#1f242b] border-[#2A303C] text-slate-200 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)] disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {activeProvider === 'google' && isAuthenticating ? (
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              ) : (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>
                {activeProvider === 'google' && isAuthenticating
                  ? 'Authenticating Workspace...'
                  : 'Sign in with Google Workspace'}
              </span>
            </button>

            {/* GitHub Enterprise SSO */}
            <button
              id="github-sso-btn"
              onClick={() => handleOAuthLogin('github')}
              disabled={isAuthenticating}
              className={`w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                activeProvider === 'github' && isAuthenticating
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.3)]'
                  : 'bg-[#181B20] hover:bg-[#1f242b] border-[#2A303C] text-slate-200 hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {activeProvider === 'github' && isAuthenticating ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              ) : (
                <svg className="w-4 h-4 shrink-0 fill-current text-slate-200" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              )}
              <span>
                {activeProvider === 'github' && isAuthenticating
                  ? 'Verifying GitHub Keys...'
                  : 'Sign in with GitHub'}
              </span>
            </button>
          </div>

          {/* Tenant Target Info */}
          <div className="mt-6 pt-5 border-t border-[#22272F]/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Lock className="w-3 h-3 text-cyan-400" /> Tenant: HELPxGROW AI
            </span>
            <span className="text-emerald-400">Zero-Trust Guard active</span>
          </div>
        </div>

        {/* Footnote Security Badge */}
        <div className="mt-6 text-center space-y-1">
          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
            <span>Powered by 6 Specialized LLM Agents</span>
            <span>·</span>
            <span className="text-cyan-400">HMAC-SHA256 Cryptographic Ledger</span>
          </p>
        </div>
      </div>
    </div>
  );
};
