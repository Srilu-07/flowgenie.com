import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Play, 
  FileText, 
  Check, 
  Cpu, 
  Zap, 
  MessageSquareQuote,
  ShieldCheck
} from 'lucide-react';
import { MeetingWorkflow, MeetingActionItem, EmployeeTask, UserRole } from '../types/agent';

interface MeetingActionsIntelligenceProps {
  meetings: MeetingWorkflow[];
  onDispatchActionToTasks: (action: MeetingActionItem, meetingTitle: string) => void;
  userRole: UserRole;
  onNavigate: (route: string) => void;
}

export const MeetingActionsIntelligence: React.FC<MeetingActionsIntelligenceProps> = ({
  meetings,
  onDispatchActionToTasks,
  userRole,
  onNavigate
}) => {
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingWorkflow>(meetings[0] || null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionStep, setExtractionStep] = useState<number>(0);
  const [customTranscript, setCustomTranscript] = useState('');
  const [dispatchedIds, setDispatchedIds] = useState<Set<string>>(new Set(['ACT-501', 'ACT-502', 'ACT-503']));

  const handleRunAutonomousExtraction = () => {
    setIsExtracting(true);
    setExtractionStep(1);

    setTimeout(() => {
      setExtractionStep(2);
      setTimeout(() => {
        setExtractionStep(3);
        setTimeout(() => {
          setIsExtracting(false);
          setExtractionStep(0);
        }, 800);
      }, 900);
    }, 900);
  };

  const handleDispatchAction = (action: MeetingActionItem) => {
    onDispatchActionToTasks(action, selectedMeeting.title);
    setDispatchedIds(prev => new Set([...prev, action.id]));
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#141619] border border-[#22272F] relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              AUTONOMOUS MEETING ACTIONS ORCHESTRATOR
            </span>
            <span className="text-xs text-slate-400 font-mono">Claude Sonnet 4 Natural Intent Ingestion</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Meeting Transcripts & Autonomous Action Items
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Autonomous multi-agent pipeline parsing executive and team transcripts into structured action items, auto-assigning owners, establishing SLA deadlines, and feeding directly into the Task & Deadline Watchdog.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <button
            onClick={() => onNavigate('/dashboard/tasks-sla')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1c2026] hover:bg-[#22272F] border border-[#2A303C] text-slate-200 font-mono text-xs font-bold transition-all cursor-pointer"
          >
            <span>View Task & SLA Watchdog</span>
            <ArrowRight className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* Main Grid: Meeting Selector + Extraction Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Meeting Roster */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400">Transcribed Sessions</h2>
            <span className="text-[10px] font-mono text-cyan-400">{meetings.length} recorded</span>
          </div>

          <div className="space-y-3">
            {meetings.map((m) => {
              const isSelected = selectedMeeting?.id === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMeeting(m)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#141619] border-cyan-500/50 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                      : 'bg-[#141619]/60 hover:bg-[#141619] border-[#22272F]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-cyan-400" />
                      {m.date.split(' ')[0]}
                    </span>
                    <span className="text-emerald-400 font-bold">{m.durationMinutes} mins</span>
                  </div>

                  <h3 className="text-xs font-bold text-white leading-snug">{m.title}</h3>
                  <div className="flex items-center gap-1.5 mt-2 text-[10px] font-mono text-slate-400">
                    <Users className="w-3 h-3 text-slate-500" />
                    <span>{m.participants.length} Participants</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-cyan-400">{m.extractedActions.length} Action Items</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Meeting Deep-Dive & Action Extraction (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {selectedMeeting && (
            <div className="p-6 rounded-2xl bg-[#141619] border border-[#22272F] space-y-6">
              {/* Meeting Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#22272F] pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/40 text-cyan-300 border border-cyan-500/30">
                      {selectedMeeting.id}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{selectedMeeting.date}</span>
                  </div>
                  <h2 className="text-lg font-bold text-white">{selectedMeeting.title}</h2>
                </div>

                <button
                  onClick={handleRunAutonomousExtraction}
                  disabled={isExtracting}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs font-mono transition-all cursor-pointer flex items-center gap-2 shadow-md shrink-0"
                >
                  <Cpu className={`w-4 h-4 ${isExtracting ? 'animate-spin' : ''}`} />
                  <span>{isExtracting ? 'Extracting Action Items...' : 'Re-Run Multi-Agent Extraction'}</span>
                </button>
              </div>

              {/* Extraction Progress Overlay */}
              {isExtracting && (
                <div className="p-4 rounded-xl bg-[#0B0C0E] border border-cyan-500/40 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-300">
                    <span>Autonomous Pipeline Execution:</span>
                    <span>Step {extractionStep} of 3</span>
                  </div>
                  <div className="w-full bg-[#141619] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-cyan-400 h-full transition-all duration-300"
                      style={{ width: `${(extractionStep / 3) * 100}%` }}
                    />
                  </div>
                  <p className="text-[11px] font-mono text-slate-400">
                    {extractionStep === 1 && 'Ingesting acoustic transcript & parsing semantic intent...'}
                    {extractionStep === 2 && 'Detecting commitments, deadline timestamps & employee assignees...'}
                    {extractionStep === 3 && 'Validating SLA thresholds & syncing to task watchdog...'}
                  </p>
                </div>
              )}

              {/* Transcript Snippet */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <MessageSquareQuote className="w-3.5 h-3.5 text-cyan-400" />
                    Verified Transcript Excerpt:
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">SOC-2 Redacted</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0B0C0E] border border-[#22272F] text-xs font-mono text-slate-300 leading-relaxed italic">
                  {selectedMeeting.rawTranscriptSnippet}
                </div>
              </div>

              {/* Extracted Action Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Autonomously Extracted Deliverables & SLAs:
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {selectedMeeting.extractedActions.length} items synthesized
                  </span>
                </div>

                <div className="space-y-2.5">
                  {selectedMeeting.extractedActions.map((act) => {
                    const isDispatched = dispatchedIds.has(act.id);

                    return (
                      <div
                        key={act.id}
                        className="p-4 rounded-xl bg-[#0B0C0E] border border-[#22272F] hover:border-cyan-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#141619] border border-[#22272F] text-cyan-300 font-bold">
                              {act.id}
                            </span>
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase font-bold ${
                              act.priority === 'high' ? 'text-red-400 bg-red-950/40 border border-red-500/30' : 'text-slate-300 bg-slate-800'
                            }`}>
                              {act.priority}
                            </span>
                            <span className="text-[10px] font-mono text-emerald-400">
                              Confidence: {Math.round(act.confidenceScore * 100)}%
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-white">{act.title}</h4>

                          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                            <span>Assignee: <strong className="text-slate-200">{act.assigneeName}</strong> ({act.assigneeRole})</span>
                            <span>·</span>
                            <span>Due: <strong className="text-cyan-400">{act.dueDate}</strong></span>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-2">
                          {isDispatched ? (
                            <span className="px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Synced to SLA Watchdog</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => handleDispatchAction(act)}
                              className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1"
                            >
                              <span>Dispatch to Tracker</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
