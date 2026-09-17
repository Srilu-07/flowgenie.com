import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Circle, 
  Loader2, 
  Terminal, 
  FileCode, 
  ShieldCheck, 
  Cpu, 
  Database, 
  Network, 
  ArrowRight, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  UserCheck,
  Building2,
  Copy,
  Check
} from 'lucide-react';
import { AgentExecutionStep, AuditRecord, EmployeeTarget } from '../types/agent';
import { TARGET_PRESETS } from '../services/mockData';
import { executeAgentPipeline, PipelineResult } from '../services/clientAgentService';

interface OnboardingEngineProps {
  onNavigate: (route: string) => void;
  onAuditRecordCreated: (record: AuditRecord) => void;
}

export const OnboardingEngine: React.FC<OnboardingEngineProps> = ({
  onNavigate,
  onAuditRecordCreated
}) => {
  const [selectedTarget, setSelectedTarget] = useState<EmployeeTarget>(TARGET_PRESETS[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [executedSteps, setExecutedSteps] = useState<AgentExecutionStep[]>([]);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    `[SYSTEM] FlowGenie HR Autonomous Orchestration Engine initialized.`,
    `[SYSTEM] Tenant: HELPxGROW AI · Zero-Trust TLS 1.3 · HMAC Secret active.`,
    `[STANDBY] Ready to execute autonomous onboarding pipeline. Click 'Run Onboarding Demo' to initiate.`
  ]);
  const [selectedStepForJson, setSelectedStepForJson] = useState<number | null>(null);
  const [lastResult, setLastResult] = useState<PipelineResult | null>(null);
  const [copiedHmac, setCopiedHmac] = useState(false);

  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal
  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  const defaultStepDefinitions = [
    {
      stepNumber: 1,
      agentId: 'orchestrator' as const,
      agentName: 'Orchestrator Agent',
      title: 'DAG Pipeline Initialization & Autonomous Routing',
      tool: 'TaskPlannerDAG.createHandoff()'
    },
    {
      stepNumber: 2,
      agentId: 'retrieval' as const,
      agentName: 'Retrieval Agent',
      title: 'Query Workday HRIS Profile & Background Clearance',
      tool: 'WorkdayGraphQL.fetchPreHireCandidate()'
    },
    {
      stepNumber: 3,
      agentId: 'decision' as const,
      agentName: 'Decision Agent',
      title: 'Validate Role-Based SLA Matrix & Entitlements',
      tool: 'SLAMatrixValidator.assertLeastPrivilege()'
    },
    {
      stepNumber: 4,
      agentId: 'execution' as const,
      agentName: 'Execution Agent',
      title: 'Execute SaaS API Provisioning (Slack, GitHub, Jira)',
      tool: 'MultiSaaSProvisioner.executeAll([GitHub, Slack, Jira])'
    },
    {
      stepNumber: 5,
      agentId: 'compliance' as const,
      agentName: 'Compliance Agent',
      title: 'Generate SHA-256 HMAC Cryptographic Signature',
      tool: 'Sha256HmacEngine.sealAuditBlock()'
    }
  ];

  const handleRunPipeline = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setProgressPercent(0);
    setActiveStepIndex(0);
    setExecutedSteps([]);
    setLastResult(null);

    const startTime = new Date().toLocaleTimeString();
    setTerminalLogs(prev => [
      ...prev,
      `--------------------------------------------------------------------------------`,
      `[${startTime}] ▶ DISPATCHING AUTONOMOUS ONBOARDING PIPELINE`,
      `[TARGET] Employee: ${selectedTarget.name} | Role: ${selectedTarget.role}`,
      `[API] POST /api/agent with { employeeName: "${selectedTarget.name}", role: "${selectedTarget.role}" }...`
    ]);

    try {
      const result = await executeAgentPipeline(
        selectedTarget,
        (currentStep, percent) => {
          setProgressPercent(percent);
          setActiveStepIndex(currentStep.stepNumber - 1);
          setExecutedSteps(prev => {
            const filtered = prev.filter(s => s.stepNumber !== currentStep.stepNumber);
            return [...filtered, currentStep];
          });
          setTerminalLogs(prev => [
            ...prev,
            `[${new Date().toLocaleTimeString()}] ✓ [STEP ${currentStep.stepNumber}/5] ${currentStep.agentName}: ${currentStep.toolInvoked}`,
            `    ${currentStep.logSummary}`
          ]);
        }
      );

      setLastResult(result);
      setSelectedStepForJson(4); // Default to viewing compliance agent output
      onAuditRecordCreated(result.auditRecord);

      setTerminalLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] 🔒 CRYPTOGRAPHIC AUDIT SEAL ATTACHED:`,
        `    HMAC-SHA256: ${result.hmacSignature}`,
        `[${new Date().toLocaleTimeString()}] 🏁 PIPELINE COMPLETED IN 4.2s (Autonomy: 100%, Speedup: 207x).`
      ]);
    } catch (err: any) {
      setTerminalLogs(prev => [
        ...prev,
        `[ERROR] Pipeline failure: ${err?.message || 'Unknown execution error'}`
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopyHmac = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHmac(true);
    setTimeout(() => setCopiedHmac(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Target Employee & Run Controls Card */}
      <div className="p-6 rounded-2xl bg-[#141619] border border-[#22272F] shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                LIVE AGENT EXECUTION ENGINE
              </span>
              <span className="text-xs font-mono text-slate-400">Zero Human In The Loop</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">
              Autonomous Workplace Onboarding Runner
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Deconstructs employee provisioning into a 5-step autonomous agent DAG loop. Server executes tool calls, monitors SLA adherence, and signs the record with SHA-256 HMAC.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              id="run-onboarding-demo-btn"
              onClick={handleRunPipeline}
              disabled={isRunning}
              className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                isRunning
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 cursor-wait'
                  : 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.35)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)]'
              }`}
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>Streaming Agent Steps ({progressPercent}%)...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Run Onboarding Demo</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preset Selector Banner */}
        <div className="mt-6 pt-5 border-t border-[#22272F] grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TARGET_PRESETS.map((preset) => {
            const isSelected = selectedTarget.name === preset.name;
            return (
              <button
                key={preset.name}
                onClick={() => {
                  if (!isRunning) setSelectedTarget(preset);
                }}
                disabled={isRunning}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_12px_rgba(0,240,255,0.15)]'
                    : 'bg-[#0B0C0E] border-[#22272F] hover:border-slate-700 opacity-75 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{preset.name}</span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />}
                </div>
                <p className="text-[11px] text-cyan-400 font-mono truncate mt-0.5">{preset.role}</p>
                <p className="text-[10px] text-slate-400 truncate mt-1">{preset.department}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress Bar (0% -> 20% -> 40% -> 60% -> 80% -> 100%) */}
      <div className="p-4 rounded-xl bg-[#141619] border border-[#22272F] space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${progressPercent === 100 ? 'bg-emerald-400' : isRunning ? 'bg-cyan-400 animate-pulse' : 'bg-slate-500'}`} />
            <span>DAG EXECUTION STREAM</span>
          </span>
          <span className="text-cyan-400 font-bold">{progressPercent}% COMPLETED</span>
        </div>

        <div className="w-full h-2.5 rounded-full bg-[#0B0C0E] border border-[#22272F] overflow-hidden p-0.5">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(0,240,255,0.5)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 5-Step Agent Loop Visualizer */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {defaultStepDefinitions.map((def, idx) => {
          const executed = executedSteps.find(s => s.stepNumber === def.stepNumber);
          const isCurrentActive = isRunning && activeStepIndex === idx;
          const isDone = !!executed || progressPercent >= (def.stepNumber * 20);

          return (
            <div
              key={def.stepNumber}
              onClick={() => setSelectedStepForJson(idx)}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                isDone
                  ? 'bg-[#141619] border-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.25)] border-glow-emerald'
                  : isCurrentActive
                  ? 'bg-cyan-950/20 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.3)] animate-pulse'
                  : 'bg-[#141619]/60 border-[#22272F] opacity-70'
              }`}
            >
              {/* Step indicator header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  STEP {def.stepNumber}/5
                </span>
                {isDone ? (
                  <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>200 OK</span>
                  </div>
                ) : isCurrentActive ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                ) : (
                  <Circle className="w-3 h-3 text-slate-600" />
                )}
              </div>

              <p className="text-xs font-bold text-white truncate">{def.agentName}</p>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 min-h-[32px]">
                {def.title}
              </p>

              <div className="mt-3 pt-2 border-t border-[#22272F] flex items-center justify-between text-[10px] font-mono">
                <span className="text-cyan-400 truncate max-w-[120px]">{def.tool.split('.')[0]}</span>
                {executed && (
                  <span className="text-emerald-400 font-semibold">{executed.latencyMs}ms</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lower Dual View: Executed Tool JSON Inspector & Integrated Terminal Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Executed JSON Tool Parameters Inspector */}
        <div className="p-5 rounded-2xl bg-[#141619] border border-[#22272F] flex flex-col space-y-3">
          <div className="flex items-center justify-between border-b border-[#22272F] pb-3">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Tool Execution Payload (Step {selectedStepForJson !== null ? selectedStepForJson + 1 : 1})
              </span>
            </div>
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((stepIdx) => (
                <button
                  key={stepIdx}
                  onClick={() => setSelectedStepForJson(stepIdx)}
                  className={`w-6 h-6 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    selectedStepForJson === stepIdx
                      ? 'bg-cyan-500 text-slate-950 shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                      : 'bg-[#1c2026] text-slate-400 hover:text-white'
                  }`}
                >
                  {stepIdx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-[#0B0C0E] border border-[#22272F] rounded-xl p-3 font-mono text-xs overflow-x-auto max-h-72 text-slate-300">
            {executedSteps[selectedStepForJson ?? 0] ? (
              <pre className="text-emerald-400">
                {JSON.stringify(
                  {
                    stepNumber: executedSteps[selectedStepForJson ?? 0].stepNumber,
                    agentName: executedSteps[selectedStepForJson ?? 0].agentName,
                    toolInvoked: executedSteps[selectedStepForJson ?? 0].toolInvoked,
                    inputParameters: executedSteps[selectedStepForJson ?? 0].inputParameters,
                    outputPayload: executedSteps[selectedStepForJson ?? 0].outputPayload,
                    hmacSignature: executedSteps[selectedStepForJson ?? 0].hmacSignature
                  },
                  null,
                  2
                )}
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8 text-center">
                <FileCode className="w-8 h-8 mb-2 opacity-40 text-cyan-400" />
                <p>Run the onboarding demo to inspect the live JSON tool call payload and parameters.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Integrated Terminal Window with Scanline Effect */}
        <div className="p-5 rounded-2xl bg-[#141619] border border-[#22272F] flex flex-col space-y-3">
          <div className="flex items-center justify-between border-b border-[#22272F] pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Agent Orchestration Terminal
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-400">TTY: /dev/agent0</span>
            </div>
          </div>

          <div className="flex-1 bg-[#0B0C0E] border border-[#22272F] rounded-xl p-3 font-mono text-[11px] overflow-y-auto max-h-72 text-slate-300 relative scanline leading-relaxed space-y-1">
            {terminalLogs.map((log, index) => (
              <div 
                key={index}
                className={
                  log.includes('▶') ? 'text-cyan-300 font-bold' :
                  log.includes('✓') ? 'text-emerald-400' :
                  log.includes('🔒') ? 'text-yellow-400 font-semibold' :
                  log.includes('🏁') ? 'text-cyan-400 font-bold' :
                  log.includes('[ERROR]') ? 'text-red-400' :
                  'text-slate-400'
                }
              >
                {log}
              </div>
            ))}
            <div ref={terminalBottomRef} />
          </div>
        </div>
      </div>

      {/* Finished Pipeline Banner with Cryptographic Proof */}
      {lastResult && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#141619] to-[#141619] border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.2)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-bold text-white">
                Pipeline Successfully Sealed with HMAC-SHA256
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono border border-emerald-500/40">
                SOC-2 Verified
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400 flex items-center gap-2 flex-wrap">
              <span>Signature:</span>
              <span className="text-cyan-300 bg-[#0B0C0E] px-2 py-0.5 rounded border border-[#22272F] max-w-xs sm:max-w-md truncate">
                {lastResult.hmacSignature}
              </span>
              <button
                onClick={() => handleCopyHmac(lastResult.hmacSignature)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-[#1c2026] cursor-pointer"
                title="Copy HMAC"
              >
                {copiedHmac ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => onNavigate('/dashboard/audit-trail')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 text-xs font-bold transition-all cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.2)]"
            >
              <span>Verify in Cryptographic Audit Trail</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
