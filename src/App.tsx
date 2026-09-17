import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { LoginGate } from './components/LoginGate';
import { TelemetryDashboard } from './components/TelemetryDashboard';
import { OnboardingEngine } from './components/OnboardingEngine';
import { ArchitectureRegistry } from './components/ArchitectureRegistry';
import { AgentMeshMap } from './components/AgentMeshMap';
import { AuditTrailVerifier } from './components/AuditTrailVerifier';
import { SettingsPanel } from './components/SettingsPanel';
import { AccessDenied } from './components/AccessDenied';
import { AuditRecord, TelemetryMetrics, UserProfile, UserRole, ROLE_PERMISSIONS } from './types/agent';
import { INITIAL_AUDIT_RECORDS } from './services/mockData';

const DEFAULT_USER: UserProfile = {
  name: 'Alex Mercer',
  email: 'alex.mercer@helpxgrow.ai',
  role: 'HR Admin',
  tenant: 'HELPxGROW AI',
  avatarUrl: '',
  bio: 'Autonomous workplace systems architect & Tier-1 SOC-2 security controller at HELPxGROW AI.',
  title: 'Lead People Ops & Autonomous Security Controller'
};

const DEFAULT_METRICS: TelemetryMetrics = {
  totalTasksCompleted: 12840,
  autonomyRatePercent: 100,
  speedupFactor: '207x',
  activeAgentsCount: 6,
  systemHealthPercent: 100,
  securityVerificationRate: '99.8%',
  complianceStandard: 'SOC-2 / HMAC Signed'
};

export default function App() {
  // Check cookie or localStorage for active session
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const hasCookie = document.cookie.includes('flowgenie_session=active');
    const hasLocalAuth = localStorage.getItem('flowgenie_session') === 'active';
    return hasCookie || hasLocalAuth;
  });

  // Current route
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const path = window.location.pathname;
    if (path.startsWith('/dashboard')) {
      return path;
    }
    return isAuthenticated ? '/dashboard' : '/';
  });

  // User details with localStorage persistence
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('flowgenie_admin_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_USER,
          ...parsed
        };
      }
    } catch {}
    return DEFAULT_USER;
  });

  // Audit Records with persistence
  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>(() => {
    try {
      const saved = localStorage.getItem('flowgenie_audit_records');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_AUDIT_RECORDS;
  });

  // Metrics
  const [metrics, setMetrics] = useState<TelemetryMetrics>(() => {
    try {
      const saved = localStorage.getItem('flowgenie_metrics');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_METRICS;
  });

  // Handle URL change / popstate
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (!isAuthenticated && path !== '/') {
        setCurrentRoute('/');
      } else {
        setCurrentRoute(path || (isAuthenticated ? '/dashboard' : '/'));
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAuthenticated]);

  // Navigate helper
  const navigate = (route: string) => {
    try {
      window.history.pushState({}, '', route);
    } catch {
      // In restricted iframe, state still drives views perfectly
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth Success Handler
  const handleLoginSuccess = (provider: 'google_workspace' | 'github_enterprise') => {
    setIsAuthenticated(true);
    localStorage.setItem('flowgenie_session', 'active');
    navigate('/dashboard');
  };

  // Logout Handler
  const handleLogout = () => {
    document.cookie = 'flowgenie_session=; path=/; max-age=0';
    localStorage.removeItem('flowgenie_session');
    setIsAuthenticated(false);
    navigate('/');
  };

  // Reset Platform Data
  const handleResetPlatformData = () => {
    document.cookie = 'flowgenie_session=; path=/; max-age=0';
    localStorage.clear();
    setIsAuthenticated(false);
    setUser(DEFAULT_USER);
    setAuditRecords(INITIAL_AUDIT_RECORDS);
    setMetrics(DEFAULT_METRICS);
    navigate('/');
  };

  // Update Profile (Avatar, Display Name, Bio, etc.)
  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    try {
      localStorage.setItem('flowgenie_admin_user', JSON.stringify(updatedUser));
    } catch (e) {
      console.warn('LocalStorage save warning:', e);
    }
  };

  // Switch Role (for RBAC simulation & demo evaluation)
  const handleSwitchRole = (newRole: UserRole) => {
    const updated = { ...user, role: newRole };
    setUser(updated);
    try {
      localStorage.setItem('flowgenie_admin_user', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save warning:', e);
    }
  };

  // Record Created Handler
  const handleAuditRecordCreated = (newRecord: AuditRecord) => {
    setAuditRecords(prev => {
      const updated = [newRecord, ...prev];
      try {
        localStorage.setItem('flowgenie_audit_records', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setMetrics(prev => {
      const updated = {
        ...prev,
        totalTasksCompleted: prev.totalTasksCompleted + 1
      };
      try {
        localStorage.setItem('flowgenie_metrics', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // If not authenticated, render the OAuth login gate
  if (!isAuthenticated || currentRoute === '/') {
    return <LoginGate onSuccessLogin={handleLoginSuccess} />;
  }

  const rolePerms = ROLE_PERMISSIONS[user.role] || ROLE_PERMISSIONS['Employee'];

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-slate-100 flex flex-col font-sans">
      {/* App Shell Top Header */}
      <Navigation
        currentRoute={currentRoute}
        onNavigate={navigate}
        user={user}
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
      />

      {/* Main Content Area with RBAC Route Guards */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Route: /dashboard */}
        {currentRoute === '/dashboard' && (
          <TelemetryDashboard
            onNavigate={navigate}
            metrics={metrics}
            userRole={user.role}
          />
        )}

        {/* Route: /dashboard/onboarding */}
        {currentRoute === '/dashboard/onboarding' && (
          rolePerms.canAccessOnboarding ? (
            <OnboardingEngine
              onNavigate={navigate}
              onAuditRecordCreated={handleAuditRecordCreated}
            />
          ) : (
            <AccessDenied
              sectionName="Autonomous Onboarding Pipeline"
              requiredRoles={['HR Admin', 'Admin', 'HR Manager']}
              currentRole={user.role}
              onSwitchRole={handleSwitchRole}
              onNavigate={navigate}
            />
          )
        )}

        {/* Route: /dashboard/architecture */}
        {currentRoute === '/dashboard/architecture' && (
          rolePerms.canAccessArchitecture ? (
            <ArchitectureRegistry
              onNavigate={navigate}
            />
          ) : (
            <AccessDenied
              sectionName="System Architecture & LLM Routing Matrix"
              requiredRoles={['HR Admin', 'Admin']}
              currentRole={user.role}
              onSwitchRole={handleSwitchRole}
              onNavigate={navigate}
            />
          )
        )}

        {/* Route: /dashboard/agent-map */}
        {currentRoute === '/dashboard/agent-map' && (
          rolePerms.canAccessAgentMap ? (
            <AgentMeshMap />
          ) : (
            <AccessDenied
              sectionName="Agent P2P Communication Mesh & Topology"
              requiredRoles={['HR Admin', 'Admin']}
              currentRole={user.role}
              onSwitchRole={handleSwitchRole}
              onNavigate={navigate}
            />
          )
        )}

        {/* Route: /dashboard/audit-trail */}
        {currentRoute === '/dashboard/audit-trail' && (
          rolePerms.canAccessAuditTrail ? (
            <AuditTrailVerifier
              auditRecords={auditRecords}
            />
          ) : (
            <AccessDenied
              sectionName="Cryptographic Audit Vault & HMAC Ledger"
              requiredRoles={['HR Admin', 'Admin', 'HR Manager']}
              currentRole={user.role}
              onSwitchRole={handleSwitchRole}
              onNavigate={navigate}
            />
          )
        )}

        {/* Route: /dashboard/settings */}
        {currentRoute === '/dashboard/settings' && (
          <SettingsPanel
            user={user}
            onUpdateUser={handleUpdateUser}
            onResetPlatformData={handleResetPlatformData}
            onSwitchRole={handleSwitchRole}
          />
        )}
      </main>

      {/* Persistent Enterprise Footer */}
      <footer className="border-t border-[#22272F] bg-[#0B0C0E] py-4 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">FlowGenie HR Autonomous Multi-Agent Orchestrator</span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400">HELPxGROW AI</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>Active Operator: <strong className="text-slate-200">{user.name}</strong> ({user.role})</span>
            <span>·</span>
            <span>SOC-2 Type II Certified</span>
            <span>·</span>
            <span>256-Bit SHA HMAC</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
