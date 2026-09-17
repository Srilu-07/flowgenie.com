import { EmployeeTask, HRAlert, MeetingWorkflow } from '../types/agent';

export const INITIAL_EMPLOYEE_TASKS: EmployeeTask[] = [
  {
    id: 'TASK-1001',
    employeeId: 'EMP-9082',
    employeeName: 'Arjun Mehta',
    employeeEmail: 'arjun.mehta@helpxgrow.ai',
    department: 'Platform Infrastructure',
    role: 'Senior Site Reliability Engineer',
    title: 'Submit SOC-2 Security & IAM Key Rotation Attestation',
    description: 'Sign and submit the cryptographic hardware token attestation and rotate root AWS KMS access credentials within the 24-hour onboarding SLA.',
    category: 'Security & Keys',
    assignedDate: '2026-09-14 09:00:00 UTC',
    dueDate: '2026-09-15 09:00:00 UTC',
    slaHours: 24,
    status: 'overdue',
    priority: 'critical',
    inactivityHours: 48,
    lastPingTime: '2026-09-16 14:20:00 UTC',
    escalationLevel: 'alerted_hr',
    hrAlertSent: true,
    hrAlertTimestamp: '2026-09-16 10:00:00 UTC',
    selfCorrectionAction: 'HR Alert Sentinel dispatched high-urgency Slack reminder and flagged People Ops queue.'
  },
  {
    id: 'TASK-1002',
    employeeId: 'EMP-9082',
    employeeName: 'Arjun Mehta',
    employeeEmail: 'arjun.mehta@helpxgrow.ai',
    department: 'Platform Infrastructure',
    role: 'Senior Site Reliability Engineer',
    title: 'Complete Okta MFA Hardware Key Registration',
    description: 'Enroll primary and backup YubiKey 5C NFC hardware authenticators in Okta corporate directory.',
    category: 'Onboarding Compliance',
    assignedDate: '2026-09-14 09:00:00 UTC',
    dueDate: '2026-09-15 18:00:00 UTC',
    slaHours: 36,
    status: 'overdue',
    priority: 'high',
    inactivityHours: 42,
    lastPingTime: '2026-09-16 12:00:00 UTC',
    escalationLevel: 'alerted_hr',
    hrAlertSent: true,
    hrAlertTimestamp: '2026-09-16 18:30:00 UTC'
  },
  {
    id: 'TASK-1003',
    employeeId: 'EMP-9104',
    employeeName: 'Elena Rostova',
    employeeEmail: 'elena.rostova@helpxgrow.ai',
    department: 'Autonomous Engineering',
    role: 'Staff LLM Agent Systems Architect',
    title: 'Review Claude Sonnet 4 Model Routing Latency Budget',
    description: 'Verify 200ms P99 latency SLA benchmarks on the Multi-Agent Router before enabling production traffic.',
    category: 'Sprint Deliverable',
    assignedDate: '2026-09-16 10:00:00 UTC',
    dueDate: '2026-09-17 18:00:00 UTC',
    slaHours: 32,
    status: 'at_risk',
    priority: 'high',
    inactivityHours: 18,
    lastPingTime: '2026-09-17 04:00:00 UTC',
    escalationLevel: 'warning',
    hrAlertSent: false
  },
  {
    id: 'TASK-1004',
    employeeId: 'EMP-9104',
    employeeName: 'Elena Rostova',
    employeeEmail: 'elena.rostova@helpxgrow.ai',
    department: 'Autonomous Engineering',
    role: 'Staff LLM Agent Systems Architect',
    title: 'Deploy Merkle Tree Append-Only Audit Stream to Staging',
    description: 'Connect Compliance Agent output signatures to the persistent ledger buffer.',
    category: 'Sprint Deliverable',
    assignedDate: '2026-09-15 11:00:00 UTC',
    dueDate: '2026-09-18 17:00:00 UTC',
    slaHours: 72,
    status: 'in_progress',
    priority: 'medium',
    inactivityHours: 4,
    lastPingTime: '2026-09-17 06:10:00 UTC',
    escalationLevel: 'none',
    hrAlertSent: false
  },
  {
    id: 'TASK-1005',
    employeeId: 'EMP-9118',
    employeeName: 'Marcus Vance',
    employeeEmail: 'marcus.vance@helpxgrow.ai',
    department: 'People Operations',
    role: 'HR Business Partner',
    title: 'Conduct Week-1 New Hire Check-In for Arjun Mehta',
    description: 'Review workstation provisioning, tools satisfaction, and resolve blocking compliance bottlenecks.',
    category: 'Policy Attestation',
    assignedDate: '2026-09-16 09:00:00 UTC',
    dueDate: '2026-09-17 20:00:00 UTC',
    slaHours: 24,
    status: 'in_progress',
    priority: 'medium',
    inactivityHours: 2,
    lastPingTime: '2026-09-17 05:30:00 UTC',
    escalationLevel: 'none',
    hrAlertSent: false
  },
  {
    id: 'TASK-1006',
    employeeId: 'EMP-9082',
    employeeName: 'Arjun Mehta',
    employeeEmail: 'arjun.mehta@helpxgrow.ai',
    department: 'Platform Infrastructure',
    role: 'Senior Site Reliability Engineer',
    title: 'Accept GitHub Enterprise & AWS IAM Identity Invitations',
    description: 'Click activation links sent by the Execution Agent to confirm access to repository vaults.',
    category: 'Onboarding Compliance',
    assignedDate: '2026-09-14 09:00:00 UTC',
    dueDate: '2026-09-14 17:00:00 UTC',
    slaHours: 8,
    status: 'completed',
    priority: 'high',
    inactivityHours: 0,
    escalationLevel: 'none',
    hrAlertSent: false
  }
];

export const INITIAL_HR_ALERTS: HRAlert[] = [
  {
    id: 'ALERT-HR-8841',
    taskId: 'TASK-1001',
    employeeId: 'EMP-9082',
    employeeName: 'Arjun Mehta',
    employeeRole: 'Senior Site Reliability Engineer',
    department: 'Platform Infrastructure',
    taskTitle: 'Submit SOC-2 Security & IAM Key Rotation Attestation',
    dueDate: '2026-09-15 09:00:00 UTC',
    severity: 'CRITICAL',
    reason: 'Employee has been inactive on assigned compliance attestation for 48 hours past the 24h SLA deadline. High risk of SOC-2 audit finding.',
    timestamp: '2026-09-16 10:00:00 UTC',
    status: 'active',
    autonomousActionsTaken: [
      'Automated SLA Breach notification dispatched to Workday Webhook',
      'Slack Bot sent Level-2 urgency ping to #platform-escalations',
      'Tamper-proof HMAC log entry recorded in Cryptographic Audit Ledger'
    ],
    recommendedAction: 'Trigger HR 1-on-1 check-in or temporarily reassign critical KMS rotation to Secondary On-Call.'
  },
  {
    id: 'ALERT-HR-8842',
    taskId: 'TASK-1002',
    employeeId: 'EMP-9082',
    employeeName: 'Arjun Mehta',
    employeeRole: 'Senior Site Reliability Engineer',
    department: 'Platform Infrastructure',
    taskTitle: 'Complete Okta MFA Hardware Key Registration',
    dueDate: '2026-09-15 18:00:00 UTC',
    severity: 'HIGH',
    reason: 'Employee is 42 hours past deadline with zero authentication telemetry recorded.',
    timestamp: '2026-09-16 18:30:00 UTC',
    status: 'active',
    autonomousActionsTaken: [
      'Automated email nudge sent to employee corporate inbox',
      'Okta directory enrollment window extended by 24 hours under self-correction protocol'
    ],
    recommendedAction: 'Direct People Ops outreach to verify hardware key delivery.'
  }
];

export const INITIAL_MEETINGS: MeetingWorkflow[] = [
  {
    id: 'MTG-301',
    title: 'Weekly Multi-Agent Architecture & SLA Review',
    date: '2026-09-16 14:00:00 UTC',
    durationMinutes: 45,
    participants: ['Alex Mercer (HR Admin)', 'Elena Rostova (Staff Architect)', 'Marcus Vance (People Ops)'],
    rawTranscriptSnippet: '...Alex Mercer: "We need to ensure all new engineers rotate their KMS keys within 24 hours. Arjun Mehta has not signed his attestation yet." Elena: "I will review the Sonnet 4 model routing latency by tomorrow 6 PM." Marcus: "I will schedule a 1-on-1 with Arjun to unblock his hardware key setup..."',
    status: 'DISPATCHED',
    extractedActions: [
      {
        id: 'ACT-501',
        title: 'Review Claude Sonnet 4 Model Routing Latency Budget',
        assigneeName: 'Elena Rostova',
        assigneeRole: 'Staff Architect',
        dueDate: '2026-09-17 18:00:00 UTC',
        priority: 'high',
        status: 'in_progress',
        confidenceScore: 0.98
      },
      {
        id: 'ACT-502',
        title: 'Conduct Week-1 New Hire Check-In for Arjun Mehta',
        assigneeName: 'Marcus Vance',
        assigneeRole: 'HR Business Partner',
        dueDate: '2026-09-17 20:00:00 UTC',
        priority: 'medium',
        status: 'in_progress',
        confidenceScore: 0.95
      },
      {
        id: 'ACT-503',
        title: 'Deploy Merkle Tree Append-Only Audit Stream to Staging',
        assigneeName: 'Elena Rostova',
        assigneeRole: 'Staff Architect',
        dueDate: '2026-09-18 17:00:00 UTC',
        priority: 'medium',
        status: 'in_progress',
        confidenceScore: 0.94
      }
    ]
  },
  {
    id: 'MTG-302',
    title: 'Q3 Enterprise People Operations & SOC-2 Compliance Sync',
    date: '2026-09-17 11:30:00 UTC',
    durationMinutes: 30,
    participants: ['Alex Mercer (HR Admin)', 'Marcus Vance (People Ops)', 'Audit Sentinel Bot'],
    rawTranscriptSnippet: '...Alex Mercer: "Let us check the autonomous SLA Sentinel. Inactive employees should automatically notify HR and trigger self-correcting nudges before any regulatory breach occurs..."',
    status: 'PROCESSED',
    extractedActions: [
      {
        id: 'ACT-504',
        title: 'Execute Audit Sentinel Verification for Inactive Onboarding Queues',
        assigneeName: 'Marcus Vance',
        assigneeRole: 'HR Business Partner',
        dueDate: '2026-09-18 12:00:00 UTC',
        priority: 'high',
        status: 'pending',
        confidenceScore: 0.99
      }
    ]
  }
];
