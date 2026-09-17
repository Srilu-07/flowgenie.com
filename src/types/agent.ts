export type AgentId = 
  | 'orchestrator'
  | 'retrieval'
  | 'decision'
  | 'execution'
  | 'compliance'
  | 'audit';

export interface AgentDefinition {
  id: AgentId;
  name: string;
  code: string;
  role: string;
  model: 'Claude Sonnet 4' | 'Claude Haiku 3.5' | 'Gemini 1.5 Pro Enterprise';
  status: 'ACTIVE' | 'BUSY' | 'STANDBY';
  healthScore: number;
  averageLatencyMs: number;
  tools: string[];
  description: string;
  memoryPolicy: string;
  iconName: string;
}

export type StepStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

export interface AgentExecutionStep {
  stepNumber: number;
  agentId: AgentId;
  agentName: string;
  title: string;
  status: StepStatus;
  progressPercent: number;
  timestamp: string;
  toolInvoked: string;
  inputParameters: Record<string, unknown>;
  outputPayload: Record<string, unknown>;
  logSummary: string;
  hmacSignature?: string;
  latencyMs: number;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  workflowId: string;
  agentName: string;
  action: string;
  targetEntity: string;
  rawPayload: Record<string, unknown>;
  hmacSignature: string;
  status: 'VERIFIED' | 'TAMPER_CHECK_PASS' | 'PENDING';
  algorithm: 'HMAC-SHA256';
  secretVersion: string;
}

export interface EmployeeTarget {
  name: string;
  role: string;
  department: string;
  email: string;
  startDate: string;
  manager: string;
  location: string;
  githubTeam: string;
  slackChannels: string[];
  equipmentTier: string;
}

export interface TelemetryMetrics {
  totalTasksCompleted: number;
  autonomyRatePercent: number;
  speedupFactor: string;
  activeAgentsCount: number;
  systemHealthPercent: number;
  securityVerificationRate: string;
  complianceStandard: string;
}

export interface MeshNode {
  id: AgentId;
  label: string;
  role: string;
  x: number;
  y: number;
  icon: string;
  color: string;
}

export interface MeshLink {
  source: AgentId;
  target: AgentId;
  label: string;
  active?: boolean;
}

export type UserRole = 'HR Admin' | 'Admin' | 'HR Manager' | 'Employee';

export interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
  tenant: string;
  avatarUrl?: string;
  bio?: string;
  title?: string;
}

export interface RolePermissionConfig {
  canAccessOverview: boolean;
  canAccessOnboarding: boolean;
  canAccessArchitecture: boolean;
  canAccessAgentMap: boolean;
  canAccessAuditTrail: boolean;
  canAccessSettings: boolean;
  canExecuteOnboarding: boolean;
  canResetPlatform: boolean;
  label: string;
  clearanceLevel: string;
  badgeClass: string;
  description: string;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissionConfig> = {
  'HR Admin': {
    canAccessOverview: true,
    canAccessOnboarding: true,
    canAccessArchitecture: true,
    canAccessAgentMap: true,
    canAccessAuditTrail: true,
    canAccessSettings: true,
    canExecuteOnboarding: true,
    canResetPlatform: true,
    label: 'HR Admin',
    clearanceLevel: 'Tier 1 · Full Autonomous Control',
    badgeClass: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40',
    description: 'Unrestricted enterprise administrative access across all agent clusters, cryptographic vaults, and system topology.'
  },
  'Admin': {
    canAccessOverview: true,
    canAccessOnboarding: true,
    canAccessArchitecture: true,
    canAccessAgentMap: true,
    canAccessAuditTrail: true,
    canAccessSettings: true,
    canExecuteOnboarding: true,
    canResetPlatform: true,
    label: 'Admin',
    clearanceLevel: 'Tier 1 · Full Autonomous Control',
    badgeClass: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40',
    description: 'Master platform administrator with complete authority over models, mesh routers, and tenant data.'
  },
  'HR Manager': {
    canAccessOverview: true,
    canAccessOnboarding: true,
    canAccessArchitecture: false,
    canAccessAgentMap: false,
    canAccessAuditTrail: true,
    canAccessSettings: true,
    canExecuteOnboarding: true,
    canResetPlatform: false,
    label: 'HR Manager',
    clearanceLevel: 'Tier 2 · Workflow Operations & Audits',
    badgeClass: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40',
    description: 'Operational clearance to execute onboarding pipelines and inspect HMAC audit logs. Restricted from low-level topology and platform resets.'
  },
  'Employee': {
    canAccessOverview: true,
    canAccessOnboarding: false,
    canAccessArchitecture: false,
    canAccessAgentMap: false,
    canAccessAuditTrail: false,
    canAccessSettings: true,
    canExecuteOnboarding: false,
    canResetPlatform: false,
    label: 'Employee',
    clearanceLevel: 'Tier 3 · Self-Service & Profile Only',
    badgeClass: 'text-amber-400 border-amber-500/40 bg-amber-950/40',
    description: 'Self-service identity clearance. Authorized for personal profile management and telemetry viewing. Enterprise agent triggers are locked.'
  }
};

export interface AuthSession {
  isAuthenticated: boolean;
  user: UserProfile & {
    provider: 'google_workspace' | 'github_enterprise';
  };
  token: string;
}
