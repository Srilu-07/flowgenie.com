import { AgentDefinition, AuditRecord, EmployeeTarget, MeshNode, MeshLink } from '../types/agent';

export const INITIAL_AGENTS: AgentDefinition[] = [
  {
    id: 'orchestrator',
    name: 'Orchestrator Agent',
    code: 'AGENT_ORCH_01',
    role: 'Central Workflow Dispatcher & DAG Planner',
    model: 'Claude Sonnet 4',
    status: 'ACTIVE',
    healthScore: 100,
    averageLatencyMs: 142,
    tools: ['TaskPlannerDAG', 'DependencyResolver', 'StateSynchronizer', 'AgentDispatcher'],
    description: 'Deconstructs HR onboarding directives into strict dependent sub-agent graphs, coordinates handoffs, and continuously monitors SLA bounds.',
    memoryPolicy: 'Transactional Ephemeral + Realtime Event Bus',
    iconName: 'Network'
  },
  {
    id: 'retrieval',
    name: 'Retrieval Agent',
    code: 'AGENT_RETR_02',
    role: 'Workday HRIS & Identity Data Harvester',
    model: 'Claude Haiku 3.5',
    status: 'ACTIVE',
    healthScore: 100,
    averageLatencyMs: 88,
    tools: ['WorkdayGraphQL', 'BambooHRExtractor', 'OktaDirectorySearch', 'IdentityVaultReader'],
    description: 'Fetches verified employee records, security tiers, citizenship clearances, and direct manager hierarchy from enterprise HRIS directories.',
    memoryPolicy: 'Redacted Zero-Retention Cache',
    iconName: 'Database'
  },
  {
    id: 'decision',
    name: 'Decision Agent',
    code: 'AGENT_DECS_03',
    role: 'SLA Matrix Validator & Role Policy Engine',
    model: 'Claude Sonnet 4',
    status: 'ACTIVE',
    healthScore: 99.8,
    averageLatencyMs: 210,
    tools: ['SLAMatrixValidator', 'RoleEntitlementEngine', 'LeastPrivilegeGuard', 'ComplianceFilter'],
    description: 'Evaluates required engineering permissions against role SLA matrices, ensures Least Privilege access, and authorizes SaaS entitlement scopes.',
    memoryPolicy: 'Audited Policy Vector State',
    iconName: 'Cpu'
  },
  {
    id: 'execution',
    name: 'Execution Agent',
    code: 'AGENT_EXEC_04',
    role: 'SaaS Tool Provisioner (GitHub, Slack, Jira)',
    model: 'Claude Haiku 3.5',
    status: 'ACTIVE',
    healthScore: 100,
    averageLatencyMs: 165,
    tools: ['GitHubEnterpriseAPI', 'SlackBotProvisioner', 'JiraWorkspaceSetup', 'AwsIamRoleAttacher', 'OnePasswordInviter'],
    description: 'Directly executes API tool calls against external SaaS systems: creates GitHub teams, invites to Slack channels, assigns Jira boards, and generates vaults.',
    memoryPolicy: 'Stateless Idempotent Runner',
    iconName: 'Terminal'
  },
  {
    id: 'compliance',
    name: 'Compliance Agent',
    code: 'AGENT_COMP_05',
    role: 'SOC-2 Cryptographic HMAC Signer',
    model: 'Claude Sonnet 4',
    status: 'ACTIVE',
    healthScore: 100,
    averageLatencyMs: 95,
    tools: ['Sha256HmacEngine', 'MerkleTreeAppender', 'Iso27001Validator', 'Soc2AuditEncoder'],
    description: 'Digitally seals every agent decision, payload parameter, and SaaS response using SHA-256 HMAC cryptographic keys for tamper-proof SOC-2 compliance.',
    memoryPolicy: 'Immutable Append-Only Audit Stream',
    iconName: 'ShieldCheck'
  },
  {
    id: 'audit',
    name: 'Audit & Verifier Agent',
    code: 'AGENT_AUDT_06',
    role: 'Continuous Integrity Watchdog & Tamper Detector',
    model: 'Claude Sonnet 4',
    status: 'ACTIVE',
    healthScore: 100,
    averageLatencyMs: 120,
    tools: ['IntegrityChecker', 'TamperAnomalyAlert', 'ColdStorageArchiver', 'SignatureVerifier'],
    description: 'Continuously monitors immutable audit logs, executes background cryptographic hash verification, and guarantees complete audit trail veracity.',
    memoryPolicy: 'Long-Term Verifiable Ledger',
    iconName: 'FileCheck'
  }
];

export const INITIAL_AUDIT_RECORDS: AuditRecord[] = [
  {
    id: 'AUD-99824',
    timestamp: '2026-09-17 05:42:19 UTC',
    workflowId: 'WF-ONBOARD-7841',
    agentName: 'Compliance Agent',
    action: 'SOC-2 HMAC Signature Generation',
    targetEntity: 'Arjun Mehta (SWE-II · Platform Team)',
    rawPayload: {
      employeeId: 'EMP-9082',
      employeeName: 'Arjun Mehta',
      role: 'SWE-II',
      department: 'Platform Team',
      githubTeam: 'core-infrastructure',
      slackChannels: ['#eng-platform', '#swe-general', '#team-standup'],
      jiraBoard: 'PLATFORM-KANBAN',
      signedAt: '2026-09-17T05:42:19.412Z',
      verifiedBy: 'AGENT_COMP_05'
    },
    hmacSignature: 'a87f91c3e41b9d70183b0f592dc168a2bf610e74f88102d91a92a1067e41b590',
    status: 'VERIFIED',
    algorithm: 'HMAC-SHA256',
    secretVersion: 'v2026.1'
  },
  {
    id: 'AUD-99823',
    timestamp: '2026-09-17 05:42:17 UTC',
    workflowId: 'WF-ONBOARD-7841',
    agentName: 'Execution Agent',
    action: 'Provision External SaaS Toolchains',
    targetEntity: 'GitHub Enterprise, Slack, Jira',
    rawPayload: {
      github: { repoAccess: ['platform-core', 'k8s-infra'], role: 'write' },
      slack: { inviteEmail: 'arjun.mehta@helpxgrow.ai', workspace: 'helpxgrow-corp' },
      jira: { defaultProject: 'PLAT', permissions: 'developer_standard' }
    },
    hmacSignature: '3df207ba51c099318efea2105cc9884c790100be0509a259c47e8c1581ebc009',
    status: 'VERIFIED',
    algorithm: 'HMAC-SHA256',
    secretVersion: 'v2026.1'
  },
  {
    id: 'AUD-99822',
    timestamp: '2026-09-17 05:42:15 UTC',
    workflowId: 'WF-ONBOARD-7841',
    agentName: 'Decision Agent',
    action: 'Validate Role-Based SLA Matrix',
    targetEntity: 'SLA Matrix Tier: Engineering SWE-II',
    rawPayload: {
      roleLevel: 'IC-2',
      approvalChainBypassed: false,
      securityClearanceRequired: 'TIER-2_INTERNAL',
      entitlementsAllowed: ['aws-dev-sandbox', 'github-write', 'jira-dev'],
      slaMaxTurnaroundMins: 15,
      actualTurnaroundSecs: 3.4
    },
    hmacSignature: 'c72b8969e290fbb664c125d7efab982c7018381d6364a275ba026210f992ac19',
    status: 'VERIFIED',
    algorithm: 'HMAC-SHA256',
    secretVersion: 'v2026.1'
  },
  {
    id: 'AUD-99821',
    timestamp: '2026-09-17 05:42:13 UTC',
    workflowId: 'WF-ONBOARD-7841',
    agentName: 'Retrieval Agent',
    action: 'Query Workday HRIS Profile',
    targetEntity: 'Workday HRIS Employee DB',
    rawPayload: {
      workdayCandidateId: 'WD-CAND-81992',
      legalName: 'Arjun Mehta',
      startDate: '2026-10-01',
      costCenter: 'CC-ENG-402',
      managerId: 'MGR-1044',
      status: 'PRE_HIRE_CLEARED'
    },
    hmacSignature: '5e4b2d18f97200aa9127b848c7a65b09817e8284c7590d96d991bce0927e1f44',
    status: 'VERIFIED',
    algorithm: 'HMAC-SHA256',
    secretVersion: 'v2026.1'
  },
  {
    id: 'AUD-99820',
    timestamp: '2026-09-17 05:42:12 UTC',
    workflowId: 'WF-ONBOARD-7841',
    agentName: 'Orchestrator Agent',
    action: 'Initialize Autonomous DAG Pipeline',
    targetEntity: 'Workflow Coordinator Dispatcher',
    rawPayload: {
      workflowType: 'NEW_HIRE_AUTONOMOUS_ONBOARDING',
      initiator: 'Alex Mercer (HR Admin)',
      priority: 'CRITICAL_P0',
      totalSteps: 5,
      simulatedAutonomy: true
    },
    hmacSignature: '92ab6182ef57b830d12e698ca3984501a1c97ef001857bd54128f7734ea0b612',
    status: 'VERIFIED',
    algorithm: 'HMAC-SHA256',
    secretVersion: 'v2026.1'
  }
];

export const TARGET_PRESETS: EmployeeTarget[] = [
  {
    name: 'Arjun Mehta',
    role: 'SWE-II · Platform Team',
    department: 'Core Infrastructure & Developer Velocity',
    email: 'arjun.mehta@helpxgrow.ai',
    startDate: '2026-10-01',
    manager: 'Sarah Chen (VP of Platform)',
    location: 'San Francisco, CA (Hybrid)',
    githubTeam: 'core-infra-platform',
    slackChannels: ['#eng-platform', '#swe-general', '#infra-deployments', '#coffee-sync'],
    equipmentTier: 'MacBook Pro M3 Max 64GB + YubiKey 5C NFC'
  },
  {
    name: 'Elena Rostova',
    role: 'Staff Security Engineer · Infosec',
    department: 'Enterprise Cyber Defense & SOC-2',
    email: 'elena.rostova@helpxgrow.ai',
    startDate: '2026-09-28',
    manager: 'David Miller (Chief Information Security Officer)',
    location: 'Austin, TX (Remote)',
    githubTeam: 'secops-hardening',
    slackChannels: ['#infosec-critical', '#soc2-compliance', '#sec-alerts', '#eng-all'],
    equipmentTier: 'ThinkPad P1 Gen 6 Linux Encrypted + Dual YubiKeys'
  },
  {
    name: 'Samantha Lin',
    role: 'Principal ML Scientist · AI Core',
    department: 'Foundation Models & Agent Architectures',
    email: 'samantha.lin@helpxgrow.ai',
    startDate: '2026-10-05',
    manager: 'Dr. Tariq Al-Mansoor (VP of AI Research)',
    location: 'Seattle, WA (Hybrid)',
    githubTeam: 'ml-research-agents',
    slackChannels: ['#ai-research', '#paper-reading-group', '#gpu-cluster-ops'],
    equipmentTier: 'MacBook Pro M3 Max + 8x H100 Slurm Cluster Grant'
  }
];

export const MESH_NODES: MeshNode[] = [
  { id: 'orchestrator', label: 'Orchestrator Agent', role: 'Central DAG Brain', x: 400, y: 190, icon: 'Network', color: '#00F0FF' },
  { id: 'retrieval', label: 'Retrieval Agent', role: 'Workday HRIS Engine', x: 170, y: 80, icon: 'Database', color: '#38BDF8' },
  { id: 'decision', label: 'Decision Agent', role: 'Role SLA Matrix', x: 630, y: 80, icon: 'Cpu', color: '#818CF8' },
  { id: 'execution', label: 'Execution Agent', role: 'SaaS Tool Provisioner', x: 170, y: 310, icon: 'Terminal', color: '#F59E0B' },
  { id: 'compliance', label: 'Compliance Agent', role: 'SOC-2 HMAC Cryptographer', x: 630, y: 310, icon: 'ShieldCheck', color: '#10B981' },
  { id: 'audit', label: 'Audit Agent', role: 'Continuous Verifier', x: 400, y: 400, icon: 'FileCheck', color: '#A855F7' }
];

export const MESH_LINKS: MeshLink[] = [
  { source: 'orchestrator', target: 'retrieval', label: '1. Query Workday Profile' },
  { source: 'retrieval', target: 'orchestrator', label: '2. Return Redacted Data' },
  { source: 'orchestrator', target: 'decision', label: '3. Transmit SLA Payload' },
  { source: 'decision', target: 'orchestrator', label: '4. Policy Clearances OK' },
  { source: 'orchestrator', target: 'execution', label: '5. Dispatch SaaS Provisioning' },
  { source: 'execution', target: 'orchestrator', label: '6. API Credentials Created' },
  { source: 'orchestrator', target: 'compliance', label: '7. Request HMAC Signature' },
  { source: 'compliance', target: 'audit', label: '8. Push to Immutable Ledger' },
  { source: 'audit', target: 'orchestrator', label: '9. Verifier Seal Confirmed' }
];
