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
import { TaskSLAWatchdog } from './components/TaskSLAWatchdog';
import { MeetingActionsIntelligence } from './components/MeetingActionsIntelligence';

import { 
  AuditRecord, 
  TelemetryMetrics, 
  UserProfile, 
  UserRole, 
  ROLE_PERMISSIONS, 
  EmployeeTask, 
  HRAlert, 
  MeetingWorkflow, 
  MeetingActionItem 
} from './types/agent';
import { INITIAL_AUDIT_RECORDS } from './services/mockData';
import { INITIAL_EMPLOYEE_TASKS, INITIAL_HR_ALERTS, INITIAL_MEETINGS } from './services/mockTasksData';
import { generateHMACSignature } from './utils/cryptoUtils';

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

  // Employee Tasks State with persistence
  const [tasks, setTasks] = useState<EmployeeTask[]>(() => {
    try {
      const saved = localStorage.getItem('flowgenie_employee_tasks');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_EMPLOYEE_TASKS;
  });

  // HR Inactivity Alerts State with persistence
  const [hrAlerts, setHrAlerts] = useState<HRAlert[]>(() => {
    try {
      const saved = localStorage.getItem('flowgenie_hr_alerts');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_HR_ALERTS;
  });

  // Meeting Actions State with persistence
  const [meetings, setMeetings] = useState<MeetingWorkflow[]>(() => {
    try {
      const saved = localStorage.getItem('flowgenie_meetings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_MEETINGS;
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
    setTasks(INITIAL_EMPLOYEE_TASKS);
    setHrAlerts(INITIAL_HR_ALERTS);
    setMeetings(INITIAL_MEETINGS);
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

  // Record Created Handler (appends to Cryptographic Ledger)
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

  // Append a specialized HMAC audit entry
  const recordAutonomousAuditAction = (action: string, actor: string, target: string, details: string) => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    const payload = `${action}:${actor}:${target}:${now}`;
    const newRecord: AuditRecord = {
      id: `AUDIT-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: now,
      workflowId: 'WF-SLA-WATCHDOG',
      agentName: actor,
      action,
      targetEntity: target,
      rawPayload: { details, loggedAt: now },
      hmacSignature: generateHMACSignature(payload),
      status: 'VERIFIED',
      algorithm: 'HMAC-SHA256',
      secretVersion: 'v2026.09'
    };
    handleAuditRecordCreated(newRecord);
  };

  // Update Task handler
  const handleUpdateTask = (updatedTask: EmployeeTask) => {
    setTasks(prev => {
      const updated = prev.map(t => t.id === updatedTask.id ? updatedTask : t);
      try {
        localStorage.setItem('flowgenie_employee_tasks', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Check if task transitioned to overdue with inactivity and HR hasn't been alerted
    if (updatedTask.status === 'overdue' && !updatedTask.hrAlertSent && updatedTask.inactivityHours >= 24) {
      handleTriggerManualHRAlert(updatedTask.id);
    }
  };

  // Trigger HR Alert when employee is not doing work / overdue
  const handleTriggerManualHRAlert = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const alertId = `ALERT-HR-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

    const newAlert: HRAlert = {
      id: alertId,
      taskId: task.id,
      employeeId: task.employeeId,
      employeeName: task.employeeName,
      employeeRole: task.role,
      department: task.department,
      taskTitle: task.title,
      dueDate: task.dueDate,
      severity: task.priority === 'critical' ? 'CRITICAL' : 'HIGH',
      reason: `Employee inactivity threshold breached (${task.inactivityHours}h without activity past deadline). Automated SLA Watchdog dispatched high-priority notification to HR Manager.`,
      timestamp: now,
      status: 'active',
      autonomousActionsTaken: [
        'Dispatched high-priority Workday webhook notification to HR Manager',
        'Sent urgent Slack DM & corporate email nudge to employee',
        'Recorded signed HMAC-SHA256 entry in tamper-proof compliance ledger'
      ],
      recommendedAction: 'Schedule emergency 1-on-1 blocker triage or trigger autonomous task re-allocation to secondary engineer.'
    };

    setHrAlerts(prev => {
      const updated = [newAlert, ...prev.filter(a => a.taskId !== taskId)];
      try {
        localStorage.setItem('flowgenie_hr_alerts', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Update task escalation level
    const updatedTask: EmployeeTask = {
      ...task,
      status: 'overdue',
      escalationLevel: 'alerted_hr',
      hrAlertSent: true,
      hrAlertTimestamp: now
    };
    handleUpdateTask(updatedTask);

    // Record in Cryptographic Audit Ledger
    recordAutonomousAuditAction(
      'HR_INACTIVITY_ALERT_TRIGGERED',
      'Autonomous SLA Watchdog Agent',
      `${task.employeeName} (${task.employeeId})`,
      `Employee failed to complete ${task.title} by deadline ${task.dueDate}. Inactivity: ${task.inactivityHours}h. High-urgency alert delivered to People Operations.`
    );
  };

  // Resolve HR Alert
  const handleResolveAlert = (alertId: string, remediationNotes?: string) => {
    setHrAlerts(prev => {
      const updated = prev.map(a => a.id === alertId ? {
        ...a,
        status: 'resolved' as const,
        recommendedAction: remediationNotes || 'Resolved by HR Operator.'
      } : a);
      try {
        localStorage.setItem('flowgenie_hr_alerts', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    recordAutonomousAuditAction(
      'HR_ALERT_RESOLVED',
      'Alex Mercer (HR Admin)',
      'Enterprise SLA Sentinel',
      `Alert ${alertId} resolved. Employee unblocked and task schedule re-synchronized.`
    );
  };

  // Simulate Inactivity Breach for Live Demo Evaluation
  const handleSimulateInactivityBreach = () => {
    // Pick an active or in-progress task
    const candidate = tasks.find(t => t.status === 'in_progress' || t.status === 'at_risk') || tasks[0];
    if (!candidate) return;

    const breached: EmployeeTask = {
      ...candidate,
      status: 'overdue',
      inactivityHours: 52,
      lastPingTime: '2026-09-15 08:00:00 UTC',
      escalationLevel: 'alerted_hr',
      hrAlertSent: false
    };

    handleUpdateTask(breached);
    handleTriggerManualHRAlert(breached.id);
    navigate('/dashboard/tasks-sla');
  };

  // Add New Task
  const handleAddTask = (newTaskData: Omit<EmployeeTask, 'id' | 'escalationLevel'>) => {
    const newTask: EmployeeTask = {
      ...newTaskData,
      id: `TASK-${Math.floor(1000 + Math.random() * 9000)}`,
      escalationLevel: 'none'
    };

    setTasks(prev => {
      const updated = [newTask, ...prev];
      try {
        localStorage.setItem('flowgenie_employee_tasks', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    recordAutonomousAuditAction(
      'EMPLOYEE_TASK_REGISTERED',
      'Autonomous Decision Agent',
      `${newTask.employeeName} (${newTask.employeeId})`,
      `Registered new task ${newTask.title} under 24h SLA watchdog. Category: ${newTask.category}.`
    );
  };

  // Dispatch Action Item from Meeting to Tasks
  const handleDispatchActionToTasks = (action: MeetingActionItem, meetingTitle: string) => {
    const newTask: EmployeeTask = {
      id: `TASK-${action.id}`,
      employeeId: 'EMP-' + Math.floor(1000 + Math.random() * 9000),
      employeeName: action.assigneeName,
      employeeEmail: `${action.assigneeName.toLowerCase().replace(' ', '.')}@helpxgrow.ai`,
      department: 'Autonomous Engineering',
      role: action.assigneeRole,
      title: action.title,
      description: `Action item autonomously transcribed and extracted from executive sync: "${meetingTitle}". Confidence: ${Math.round(action.confidenceScore * 100)}%.`,
      category: 'Meeting Action Item',
      assignedDate: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      dueDate: action.dueDate,
      slaHours: 24,
      status: 'in_progress',
      priority: action.priority,
      inactivityHours: 0,
      escalationLevel: 'none',
      sourceMeetingId: meetingTitle
    };

    setTasks(prev => {
      const updated = [newTask, ...prev.filter(t => t.id !== newTask.id)];
      try {
        localStorage.setItem('flowgenie_employee_tasks', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    recordAutonomousAuditAction(
      'MEETING_ACTION_DISPATCHED',
      'Meeting Actions NLP Agent',
      `${action.assigneeName} (${action.assigneeRole})`,
      `Autonomously dispatched "${action.title}" with SLA deadline ${action.dueDate} into tracking watchdog.`
    );
  };

  // If not authenticated, render the OAuth login gate
  if (!isAuthenticated || currentRoute === '/') {
    return <LoginGate onSuccessLogin={handleLoginSuccess} />;
  }

  const rolePerms = ROLE_PERMISSIONS[user.role] || ROLE_PERMISSIONS['Employee'];
  const activeAlertsCount = hrAlerts.filter(a => a.status === 'active').length;
  const overdueTasksCount = tasks.filter(t => t.status === 'overdue').length;

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-slate-100 flex flex-col font-sans">
      {/* App Shell Top Header */}
      <Navigation
        currentRoute={currentRoute}
        onNavigate={navigate}
        user={user}
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
        activeAlertsCount={activeAlertsCount}
      />

      {/* Main Content Area with RBAC Route Guards */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Route: /dashboard */}
        {currentRoute === '/dashboard' && (
          <TelemetryDashboard
            onNavigate={navigate}
            metrics={metrics}
            userRole={user.role}
            activeAlertsCount={activeAlertsCount}
            overdueTasksCount={overdueTasksCount}
          />
        )}

        {/* Route: /dashboard/tasks-sla (Employee Tasks, Deadlines & HR Alerts) */}
        {currentRoute === '/dashboard/tasks-sla' && (
          rolePerms.canAccessTasksAndSLA ? (
            <TaskSLAWatchdog
              tasks={tasks}
              hrAlerts={hrAlerts}
              userRole={user.role}
              onUpdateTask={handleUpdateTask}
              onResolveAlert={handleResolveAlert}
              onTriggerManualHRAlert={handleTriggerManualHRAlert}
              onAddTask={handleAddTask}
              onSimulateInactivityBreach={handleSimulateInactivityBreach}
            />
          ) : (
            <AccessDenied
              sectionName="Employee Tasks & SLA Watchdog"
              requiredRoles={['HR Admin', 'Admin', 'HR Manager', 'Employee']}
              currentRole={user.role}
              onSwitchRole={handleSwitchRole}
              onNavigate={navigate}
            />
          )
        )}

        {/* Route: /dashboard/meetings (Meeting Actions & Intelligence) */}
        {currentRoute === '/dashboard/meetings' && (
          rolePerms.canAccessMeetings ? (
            <MeetingActionsIntelligence
              meetings={meetings}
              onDispatchActionToTasks={handleDispatchActionToTasks}
              userRole={user.role}
              onNavigate={navigate}
            />
          ) : (
            <AccessDenied
              sectionName="Meeting Actions & Autonomous Intelligence"
              requiredRoles={['HR Admin', 'Admin', 'HR Manager', 'Employee']}
              currentRole={user.role}
              onSwitchRole={handleSwitchRole}
              onNavigate={navigate}
            />
          )
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
