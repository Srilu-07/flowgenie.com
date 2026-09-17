import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  UserX, 
  CheckCircle2, 
  BellRing, 
  ShieldAlert, 
  ArrowRight, 
  Search, 
  Filter, 
  Plus, 
  Sparkles, 
  Send, 
  RefreshCw, 
  Calendar, 
  UserCheck, 
  ChevronRight,
  Flame,
  Zap,
  Info,
  Check
} from 'lucide-react';
import { EmployeeTask, HRAlert, UserRole, TaskStatus, AuditRecord } from '../types/agent';

interface TaskSLAWatchdogProps {
  tasks: EmployeeTask[];
  hrAlerts: HRAlert[];
  userRole: UserRole;
  onUpdateTask: (task: EmployeeTask) => void;
  onResolveAlert: (alertId: string, remediationNotes?: string) => void;
  onTriggerManualHRAlert: (taskId: string) => void;
  onAddTask: (newTask: Omit<EmployeeTask, 'id' | 'escalationLevel'>) => void;
  onSimulateInactivityBreach: () => void;
}

export const TaskSLAWatchdog: React.FC<TaskSLAWatchdogProps> = ({
  tasks,
  hrAlerts,
  userRole,
  onUpdateTask,
  onResolveAlert,
  onTriggerManualHRAlert,
  onAddTask,
  onSimulateInactivityBreach
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newEmployeeName, setNewEmployeeName] = useState('Arjun Mehta');
  const [newEmployeeEmail, setNewEmployeeEmail] = useState('arjun.mehta@helpxgrow.ai');
  const [newDepartment, setNewDepartment] = useState('Platform Infrastructure');
  const [newCategory, setNewCategory] = useState<'Onboarding Compliance' | 'Security & Keys' | 'Sprint Deliverable' | 'Meeting Action Item' | 'Policy Attestation'>('Onboarding Compliance');
  const [newDueDate, setNewDueDate] = useState('2026-09-18T17:00');
  const [newPriority, setNewPriority] = useState<'critical' | 'high' | 'medium' | 'low'>('high');
  const [newDescription, setNewDescription] = useState('');

  const overdueCount = tasks.filter(t => t.status === 'overdue').length;
  const atRiskCount = tasks.filter(t => t.status === 'at_risk').length;
  const activeAlertsCount = hrAlerts.filter(a => a.status === 'active').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterStatus === 'all') return true;
    if (filterStatus === 'overdue') return task.status === 'overdue';
    if (filterStatus === 'at_risk') return task.status === 'at_risk';
    if (filterStatus === 'in_progress') return task.status === 'in_progress';
    if (filterStatus === 'completed') return task.status === 'completed';
    return true;
  });

  const showToast = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 3500);
  };

  const handleNudgeEmployee = (task: EmployeeTask) => {
    const updated: EmployeeTask = {
      ...task,
      lastPingTime: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      selfCorrectionAction: 'Autonomous Sentinel dispatched Slack priority ping & email alert to employee.'
    };
    onUpdateTask(updated);
    showToast(`Urgent notification ping dispatched to ${task.employeeName} (${task.employeeEmail}) via Slack and Corporate Email.`);
  };

  const handleSelfCorrectTask = (task: EmployeeTask) => {
    const updated: EmployeeTask = {
      ...task,
      status: 'in_progress',
      escalationLevel: 'auto_remediated',
      selfCorrectionAction: 'Auto-Remediated: SLA extended by 24h and reallocated secondary on-call reviewer.'
    };
    onUpdateTask(updated);
    showToast(`Self-correction applied for ${task.employeeName}: SLA extended by 24h & reviewer assigned.`);
  };

  const handleToggleComplete = (task: EmployeeTask) => {
    const isCompleted = task.status === 'completed';
    const updated: EmployeeTask = {
      ...task,
      status: isCompleted ? 'in_progress' : 'completed',
      inactivityHours: 0
    };
    onUpdateTask(updated);
    showToast(`Task marked as ${isCompleted ? 'In Progress' : 'Completed'} for ${task.employeeName}.`);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      employeeId: 'EMP-' + Math.floor(1000 + Math.random() * 9000),
      employeeName: newEmployeeName,
      employeeEmail: newEmployeeEmail,
      department: newDepartment,
      role: 'Enterprise Member',
      title: newTitle.trim(),
      description: newDescription.trim() || 'Assigned via FlowGenie HR Autonomous SLA Tracker',
      category: newCategory,
      assignedDate: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      dueDate: newDueDate.replace('T', ' ') + ':00 UTC',
      slaHours: 24,
      status: 'in_progress',
      priority: newPriority,
      inactivityHours: 0
    });

    setShowAddModal(false);
    setNewTitle('');
    setNewDescription('');
    showToast(`New task assigned to ${newEmployeeName} with 24h SLA watchdog active.`);
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {actionSuccessMsg && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-[#141619] border border-cyan-500/50 shadow-2xl text-xs font-mono text-cyan-300 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <Zap className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#141619] border border-[#22272F] relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 animate-pulse" />
              AUTONOMOUS SLA WATCHDOG & INACTIVITY SENTINEL
            </span>
            <span className="text-xs text-slate-400 font-mono">Zero-Latency HR Alerting</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Employee Tasks, Deadlines & HR Alerts
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Autonomous tracking of onboarding compliance, sprint deliverables, and meeting action items. If an employee is inactive or misses deadlines, the SLA Watchdog immediately notifies HR and deploys self-correcting remediation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 relative z-10">
          <button
            onClick={onSimulateInactivityBreach}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-300 text-xs font-mono font-bold transition-all cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.15)]"
            title="Simulate an employee who isn't doing their work to test the HR Alert workflow"
          >
            <UserX className="w-4 h-4 text-red-400" />
            <span>Simulate Inactivity Breach</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.25)]"
          >
            <Plus className="w-4 h-4" />
            <span>Assign New Task</span>
          </button>
        </div>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active HR Alerts */}
        <div className="p-5 rounded-2xl bg-[#141619] border border-red-900/40 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-red-400 uppercase tracking-wider">Active HR Alerts</span>
            <div className="p-2 rounded-lg bg-red-950/40 text-red-400">
              <BellRing className="w-4 h-4 animate-bounce" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{activeAlertsCount}</div>
          <p className="text-[11px] font-mono text-slate-400 mt-1.5">
            {activeAlertsCount > 0 ? 'Urgent HR intervention required' : 'All employees within SLA boundaries'}
          </p>
        </div>

        {/* Card 2: Overdue Tasks */}
        <div className="p-5 rounded-2xl bg-[#141619] border border-[#22272F]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">Overdue Tasks</span>
            <div className="p-2 rounded-lg bg-amber-950/40 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{overdueCount}</div>
          <p className="text-[11px] font-mono text-slate-400 mt-1.5">
            Employees with inactive task queues
          </p>
        </div>

        {/* Card 3: At Risk (Approaching SLA) */}
        <div className="p-5 rounded-2xl bg-[#141619] border border-[#22272F]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">At-Risk Deadlines</span>
            <div className="p-2 rounded-lg bg-cyan-950/40 text-cyan-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{atRiskCount}</div>
          <p className="text-[11px] font-mono text-slate-400 mt-1.5">
            Approaching 24h SLA threshold
          </p>
        </div>

        {/* Card 4: Completed Tasks */}
        <div className="p-5 rounded-2xl bg-[#141619] border border-[#22272F]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Completed Tasks</span>
            <div className="p-2 rounded-lg bg-emerald-950/40 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{completedCount}</div>
          <p className="text-[11px] font-mono text-slate-400 mt-1.5">
            Verified with SOC-2 HMAC attestations
          </p>
        </div>
      </div>

      {/* ACTIVE HR INACTIVITY ALERTS SECTION (CRITICAL) */}
      {hrAlerts.filter(a => a.status === 'active').length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-400" />
              <h2 className="text-base font-bold text-white font-mono">
                Active Inactivity Escalations (HR Alert Feed)
              </h2>
            </div>
            <span className="text-xs font-mono text-red-400 bg-red-950/40 border border-red-500/30 px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
              Employee Not Doing Work · Action Required
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hrAlerts.filter(a => a.status === 'active').map((alert) => (
              <div
                key={alert.id}
                className="p-5 rounded-2xl bg-[#141619] border border-red-500/40 shadow-[0_0_25px_rgba(239,68,68,0.12)] relative overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/40">
                        {alert.severity} SLA BREACH
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">{alert.id}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{alert.timestamp}</span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white">{alert.taskTitle}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-300">
                      <span className="font-semibold text-cyan-300">{alert.employeeName}</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-slate-400">{alert.employeeRole}</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-emerald-400">{alert.department}</span>
                    </div>
                  </div>

                  <p className="text-xs text-red-300/90 font-mono bg-red-950/30 p-2.5 rounded-xl border border-red-900/40 leading-relaxed">
                    <strong>Reason:</strong> {alert.reason}
                  </p>

                  <div className="space-y-1 text-[11px] font-mono text-slate-400">
                    <span className="text-slate-300 font-semibold block">Autonomous Remediation Log:</span>
                    {alert.autonomousActionsTaken.map((act, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-slate-400">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#22272F] flex flex-wrap items-center justify-between gap-2">
                  <div className="text-[11px] font-mono text-slate-400">
                    <strong className="text-cyan-400">Recommended:</strong> {alert.recommendedAction}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onResolveAlert(alert.id, 'Resolved by HR Operator with 1-on-1 employee unblocking call.')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Resolve Alert</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Task & Deadline Filter & Table Controls */}
      <div className="p-6 rounded-2xl bg-[#141619] border border-[#22272F] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">Employee Task & Deadline Roster</h2>
            <span className="text-xs font-mono text-slate-400">({filteredTasks.length} tasks)</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search employee, task, team..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#0B0C0E] border border-[#22272F] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-48 sm:w-64 font-mono"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center bg-[#0B0C0E] p-1 rounded-xl border border-[#22272F]">
              {[
                { id: 'all', label: 'All' },
                { id: 'overdue', label: 'Overdue' },
                { id: 'at_risk', label: 'At Risk' },
                { id: 'in_progress', label: 'In Progress' },
                { id: 'completed', label: 'Completed' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterStatus(f.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    filterStatus === f.id
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Task List Table */}
        <div className="overflow-x-auto rounded-xl border border-[#22272F]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#22272F] bg-[#0B0C0E] font-mono text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Status & Priority</th>
                <th className="py-3 px-4">Task Title & Category</th>
                <th className="py-3 px-4">Employee Assignee</th>
                <th className="py-3 px-4">Deadline & Inactivity</th>
                <th className="py-3 px-4 text-right">Autonomous Actions & HR Alert</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#22272F]/60">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 font-mono text-xs">
                    No employee tasks found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  const isOverdue = task.status === 'overdue';
                  const isAtRisk = task.status === 'at_risk';
                  const isCompleted = task.status === 'completed';

                  return (
                    <tr
                      key={task.id}
                      className={`hover:bg-[#181B1F] transition-colors ${
                        isOverdue ? 'bg-red-950/10' : isAtRisk ? 'bg-amber-950/10' : ''
                      }`}
                    >
                      {/* Status */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border w-fit ${
                              isOverdue
                                ? 'bg-red-500/20 text-red-300 border-red-500/40'
                                : isAtRisk
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : isCompleted
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                            }`}
                          >
                            {isOverdue && <Flame className="w-3 h-3 text-red-400 animate-pulse" />}
                            {task.status.toUpperCase()}
                          </span>

                          <span className="text-[10px] text-slate-500 uppercase">
                            Priority: <strong className={task.priority === 'critical' ? 'text-red-400' : 'text-slate-300'}>{task.priority}</strong>
                          </span>
                        </div>
                      </td>

                      {/* Task Info */}
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="font-semibold text-white text-xs leading-snug">{task.title}</div>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{task.description}</p>
                        <div className="flex items-center gap-2 mt-1 font-mono text-[10px]">
                          <span className="px-1.5 py-0.5 rounded bg-[#0B0C0E] text-slate-300 border border-[#22272F]">
                            {task.category}
                          </span>
                          <span className="text-slate-500">{task.id}</span>
                        </div>
                      </td>

                      {/* Employee Assignee */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                            {task.employeeName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-bold text-white text-xs">{task.employeeName}</div>
                            <div className="text-[10px] text-slate-400">{task.role}</div>
                            <div className="text-[10px] text-emerald-400">{task.department}</div>
                          </div>
                        </div>
                      </td>

                      {/* Deadline & Inactivity */}
                      <td className="py-3.5 px-4 font-mono text-xs">
                        <div className="flex items-center gap-1 text-slate-200">
                          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{task.dueDate}</span>
                        </div>

                        <div className="mt-1 flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-500">Inactivity:</span>
                          <span className={`text-[11px] font-bold ${
                            task.inactivityHours >= 24
                              ? 'text-red-400'
                              : task.inactivityHours > 12
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}>
                            {task.inactivityHours}h elapsed
                          </span>
                        </div>

                        {task.selfCorrectionAction && (
                          <div className="mt-1 text-[10px] text-cyan-400/90 italic truncate max-w-xs">
                            {task.selfCorrectionAction}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Alert HR button */}
                          {isOverdue && !task.hrAlertSent && (
                            <button
                              onClick={() => onTriggerManualHRAlert(task.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 font-mono text-[11px] font-bold cursor-pointer transition-all flex items-center gap-1"
                              title="Employee is not doing work: Trigger HR Escalation"
                            >
                              <BellRing className="w-3 h-3 text-red-400" />
                              <span>Alert HR</span>
                            </button>
                          )}

                          {/* Dispatch Nudge button */}
                          {!isCompleted && (
                            <button
                              onClick={() => handleNudgeEmployee(task)}
                              className="px-2.5 py-1.5 rounded-lg bg-[#0B0C0E] hover:bg-[#1c2026] border border-[#22272F] text-slate-300 hover:text-cyan-300 font-mono text-[11px] cursor-pointer transition-colors flex items-center gap-1"
                              title="Dispatch autonomous Slack / email nudge to employee"
                            >
                              <Send className="w-3 h-3" />
                              <span>Nudge</span>
                            </button>
                          )}

                          {/* Self-correct button */}
                          {isOverdue && (
                            <button
                              onClick={() => handleSelfCorrectTask(task)}
                              className="px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] font-bold cursor-pointer transition-all flex items-center gap-1"
                              title="Apply autonomous self-correction (SLA extension & re-allocation)"
                            >
                              <RefreshCw className="w-3 h-3 text-cyan-400" />
                              <span>Self-Correct</span>
                            </button>
                          )}

                          {/* Toggle Complete */}
                          <button
                            onClick={() => handleToggleComplete(task)}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                              isCompleted
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                : 'bg-[#0B0C0E] text-slate-400 hover:text-white border-[#22272F]'
                            }`}
                            title={isCompleted ? 'Mark incomplete' : 'Mark completed'}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign New Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#141619] border border-[#22272F] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#22272F] pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Assign Task & Set SLA Watchdog</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-sm font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Complete SOC-2 Encryption Hardware Token Setup"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#0B0C0E] border border-[#22272F] rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Assignee Name</label>
                  <input
                    type="text"
                    required
                    value={newEmployeeName}
                    onChange={(e) => setNewEmployeeName(e.target.value)}
                    className="w-full bg-[#0B0C0E] border border-[#22272F] rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Assignee Email</label>
                  <input
                    type="email"
                    required
                    value={newEmployeeEmail}
                    onChange={(e) => setNewEmployeeEmail(e.target.value)}
                    className="w-full bg-[#0B0C0E] border border-[#22272F] rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Department</label>
                  <select
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full bg-[#0B0C0E] border border-[#22272F] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 font-mono"
                  >
                    <option value="Platform Infrastructure">Platform Infrastructure</option>
                    <option value="Autonomous Engineering">Autonomous Engineering</option>
                    <option value="People Operations">People Operations</option>
                    <option value="Security & Compliance">Security & Compliance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-[#0B0C0E] border border-[#22272F] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 font-mono"
                  >
                    <option value="Onboarding Compliance">Onboarding Compliance</option>
                    <option value="Security & Keys">Security & Keys</option>
                    <option value="Sprint Deliverable">Sprint Deliverable</option>
                    <option value="Meeting Action Item">Meeting Action Item</option>
                    <option value="Policy Attestation">Policy Attestation</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Due Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-[#0B0C0E] border border-[#22272F] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-[#0B0C0E] border border-[#22272F] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 font-mono"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description / Deliverable Specs</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Specific requirements for SLA verification..."
                  className="w-full bg-[#0B0C0E] border border-[#22272F] rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#0B0C0E] text-slate-400 hover:text-white border border-[#22272F] font-mono cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold font-mono cursor-pointer shadow-md"
                >
                  Confirm & Activate SLA Watchdog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
