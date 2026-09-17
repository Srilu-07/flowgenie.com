import React, { useState } from 'react';
import { 
  Cpu, 
  Database, 
  Terminal, 
  ShieldCheck, 
  FileCheck, 
  Network, 
  CheckCircle2, 
  Activity, 
  Layers, 
  Wrench, 
  Sliders,
  Sparkles,
  Server
} from 'lucide-react';
import { AgentDefinition } from '../types/agent';
import { INITIAL_AGENTS } from '../services/mockData';

interface ArchitectureRegistryProps {
  onNavigate: (route: string) => void;
}

export const ArchitectureRegistry: React.FC<ArchitectureRegistryProps> = ({ onNavigate }) => {
  const [agents, setAgents] = useState<AgentDefinition[]>(INITIAL_AGENTS);
  const [selectedAgent, setSelectedAgent] = useState<AgentDefinition>(INITIAL_AGENTS[0]);
  const [filterModel, setFilterModel] = useState<string>('ALL');

  const getAgentIcon = (id: string) => {
    switch (id) {
      case 'orchestrator': return <Network className="w-5 h-5 text-cyan-400" />;
      case 'retrieval': return <Database className="w-5 h-5 text-sky-400" />;
      case 'decision': return <Cpu className="w-5 h-5 text-indigo-400" />;
      case 'execution': return <Terminal className="w-5 h-5 text-amber-400" />;
      case 'compliance': return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'audit': return <FileCheck className="w-5 h-5 text-purple-400" />;
      default: return <Cpu className="w-5 h-5 text-cyan-400" />;
    }
  };

  const handleModelChange = (agentId: string, newModel: any) => {
    setAgents(prev => prev.map(a => a.id === agentId ? { ...a, model: newModel } : a));
    if (selectedAgent.id === agentId) {
      setSelectedAgent(prev => ({ ...prev, model: newModel }));
    }
  };

  const filteredAgents = filterModel === 'ALL'
    ? agents
    : agents.filter(a => a.model.includes(filterModel));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#141619] border border-[#22272F] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              MULTI-AGENT SYSTEM ARCHITECTURE
            </span>
            <span className="text-xs font-mono text-emerald-400">6/6 Nodes Operational</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            Autonomous Agent Topology & Model Matrix
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Specialized micro-agents allocated to discrete workplace governance boundaries. Model routing dynamically splits reasoning between Claude Sonnet 4 and Haiku 3.5.
          </p>
        </div>

        {/* Model Filter Pills */}
        <div className="flex items-center gap-2 shrink-0">
          {['ALL', 'Sonnet', 'Haiku'].map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterModel(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                filterModel === filter
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                  : 'bg-[#1c2026] text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              {filter === 'ALL' ? 'All Models' : `Claude ${filter}`}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 6 Specialized Agents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAgents.map((agent) => {
          const isSelected = selectedAgent.id === agent.id;
          return (
            <div
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer bg-[#141619] relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'border-cyan-500 shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                  : 'border-[#22272F] hover:border-slate-700'
              }`}
            >
              <div>
                {/* Agent Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-[#0B0C0E] border border-[#22272F]">
                      {getAgentIcon(agent.id)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">{agent.name}</h3>
                      <span className="text-[10px] font-mono text-cyan-400">{agent.code}</span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {agent.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-medium">{agent.role}</p>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2">
                  {agent.description}
                </p>

                {/* Model Badge */}
                <div className="mt-4 pt-3 border-t border-[#22272F] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-mono">Assigned LLM:</span>
                  <span className="px-2.5 py-1 rounded bg-[#0B0C0E] border border-[#2A303C] font-mono text-cyan-300 font-semibold text-[11px]">
                    {agent.model}
                  </span>
                </div>

                {/* Authorized Tools Chips */}
                <div className="mt-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1.5">
                    Authorized Tool Capabilities ({agent.tools.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {agent.tools.map((tool, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-[#0B0C0E] text-[10px] font-mono text-slate-300 border border-[#22272F]"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Latency & Health */}
              <div className="mt-4 pt-3 border-t border-[#22272F] flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <Activity className="w-3 h-3 text-cyan-400" />
                  <span>Latency: <strong className="text-slate-200">{agent.averageLatencyMs}ms</strong></span>
                </span>
                <span className="text-emerald-400">Health: {agent.healthScore}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep-Dive Agent Configuration Inspector */}
      {selectedAgent && (
        <div className="p-6 rounded-2xl bg-[#141619] border border-cyan-500/40 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#22272F] pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#0B0C0E] border border-[#22272F]">
                {getAgentIcon(selectedAgent.id)}
              </div>
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{selectedAgent.name} Deep-Dive Parameters</span>
                  <span className="text-xs font-mono text-cyan-400">[{selectedAgent.code}]</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">{selectedAgent.role}</p>
              </div>
            </div>

            {/* Model Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Model Selector:</span>
              <select
                value={selectedAgent.model}
                onChange={(e) => handleModelChange(selectedAgent.id, e.target.value as any)}
                className="bg-[#0B0C0E] border border-cyan-500/40 text-cyan-300 text-xs font-mono px-3 py-1.5 rounded-lg focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="Claude Sonnet 4">Claude Sonnet 4 (Deep Reasoning)</option>
                <option value="Claude Haiku 3.5">Claude Haiku 3.5 (Sub-100ms Fast)</option>
                <option value="Gemini 1.5 Pro Enterprise">Gemini 1.5 Pro Enterprise</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-[#0B0C0E] border border-[#22272F] space-y-1">
              <span className="text-slate-400 text-[11px]">Memory Boundary Policy:</span>
              <p className="text-emerald-400 font-semibold">{selectedAgent.memoryPolicy}</p>
            </div>
            <div className="p-4 rounded-xl bg-[#0B0C0E] border border-[#22272F] space-y-1">
              <span className="text-slate-400 text-[11px]">Average Step Latency:</span>
              <p className="text-cyan-400 font-semibold">{selectedAgent.averageLatencyMs} ms (P99: 210ms)</p>
            </div>
            <div className="p-4 rounded-xl bg-[#0B0C0E] border border-[#22272F] space-y-1">
              <span className="text-slate-400 text-[11px]">SOC-2 Compliance Tier:</span>
              <p className="text-white font-semibold">Tier 1 · Immutable Ledger Enforced</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
