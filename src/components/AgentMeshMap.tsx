import React, { useState } from 'react';
import { 
  Network, 
  Play, 
  Activity, 
  Cpu, 
  Database, 
  Terminal, 
  ShieldCheck, 
  FileCheck, 
  Zap,
  Sparkles,
  Info
} from 'lucide-react';
import { MESH_NODES, MESH_LINKS } from '../services/mockData';
import { AgentId } from '../types/agent';

export const AgentMeshMap: React.FC = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [selectedNode, setSelectedNode] = useState<AgentId>('orchestrator');

  const simulationFlow = [
    { from: 'orchestrator', to: 'retrieval', msg: 'Orchestrator → Retrieval: Query Workday HRIS Profile' },
    { from: 'retrieval', to: 'orchestrator', msg: 'Retrieval → Orchestrator: Verified Profile Returned (Clean)' },
    { from: 'orchestrator', to: 'decision', msg: 'Orchestrator → Decision: Validate Role SLA Matrix' },
    { from: 'decision', to: 'orchestrator', msg: 'Decision → Orchestrator: Entitlements Approved (IC-2)' },
    { from: 'orchestrator', to: 'execution', msg: 'Orchestrator → Execution: Provision Slack, GitHub, Jira' },
    { from: 'execution', to: 'orchestrator', msg: 'Execution → Orchestrator: 3 SaaS Invites Dispatched (HTTP 200)' },
    { from: 'orchestrator', to: 'compliance', msg: 'Orchestrator → Compliance: Generate SHA-256 HMAC Seal' },
    { from: 'compliance', to: 'audit', msg: 'Compliance → Audit: Append to Cryptographic Ledger' }
  ];

  const handleSimulateRouting = async () => {
    if (isSimulating) return;
    setIsSimulating(true);

    for (let i = 0; i < simulationFlow.length; i++) {
      setActiveStep(i);
      await new Promise(resolve => setTimeout(resolve, 850));
    }

    setActiveStep(-1);
    setIsSimulating(false);
  };

  const getNodeInfo = (id: AgentId) => {
    return MESH_NODES.find(n => n.id === id);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#141619] border border-[#22272F] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              INTERACTIVE AGENT COMMUNICATION MESH
            </span>
            <span className="text-xs font-mono text-emerald-400">P2P Thought Routing</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            Distributed Multi-Agent Topology & Data Bus
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Real-time directed acyclic graph (DAG) routing topology. The central Orchestrator node synthesizes telemetry and coordinates sub-agent message passing.
          </p>
        </div>

        <button
          id="simulate-live-routing-btn"
          onClick={handleSimulateRouting}
          disabled={isSimulating}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer shrink-0 ${
            isSimulating
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 cursor-wait shadow-[0_0_20px_rgba(0,240,255,0.3)]'
              : 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)]'
          }`}
        >
          <Zap className={`w-4 h-4 ${isSimulating ? 'animate-bounce text-cyan-300' : 'fill-current'}`} />
          <span>{isSimulating ? 'Simulating Live Thought Routing...' : 'Simulate Live Routing'}</span>
        </button>
      </div>

      {/* Interactive Node Graph Canvas / SVG Stage */}
      <div className="p-6 rounded-2xl bg-[#141619] border border-[#22272F] relative overflow-hidden">
        {/* Active Simulation Stream Status Banner */}
        <div className="mb-4 p-3 rounded-xl bg-[#0B0C0E] border border-[#22272F] flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isSimulating ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'}`} />
            <span className="text-slate-300 font-semibold">
              {isSimulating && activeStep >= 0
                ? simulationFlow[activeStep].msg
                : 'DAG Topology Idle · Ready for Packet Routing'}
            </span>
          </div>
          <span className="text-cyan-400">
            {isSimulating ? `Packet [${activeStep + 1}/${simulationFlow.length}]` : 'TLS 1.3 Mesh'}
          </span>
        </div>

        {/* SVG Mesh Diagram */}
        <div className="relative w-full h-[480px] bg-[#0B0C0E] rounded-xl border border-[#22272F] overflow-hidden flex items-center justify-center">
          {/* Subtle Grid Background */}
          <div 
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(#00F0FF 1px, transparent 1px), linear-gradient(to right, #00F0FF 1px, transparent 1px)`,
              backgroundSize: '30px 30px'
            }}
          />

          <svg className="w-full h-full" viewBox="0 0 800 480">
            <defs>
              <linearGradient id="link-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
              </linearGradient>

              <filter id="glow-cyan-fx" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Connection Lines */}
            {MESH_LINKS.map((link, idx) => {
              const src = getNodeInfo(link.source);
              const tgt = getNodeInfo(link.target);
              if (!src || !tgt) return null;

              const isLinkActive = isSimulating && activeStep >= 0 && (
                (simulationFlow[activeStep].from === link.source && simulationFlow[activeStep].to === link.target) ||
                (simulationFlow[activeStep].from === link.target && simulationFlow[activeStep].to === link.source)
              );

              return (
                <g key={idx}>
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke={isLinkActive ? '#00F0FF' : '#22272F'}
                    strokeWidth={isLinkActive ? 3.5 : 1.5}
                    strokeDasharray={isLinkActive ? '6 4' : 'none'}
                    className={isLinkActive ? 'animate-pulse' : ''}
                    filter={isLinkActive ? 'url(#glow-cyan-fx)' : undefined}
                  />

                  {/* Animated Data Packet when link is active */}
                  {isLinkActive && (
                    <circle
                      cx={(src.x + tgt.x) / 2}
                      cy={(src.y + tgt.y) / 2}
                      r="6"
                      fill="#10B981"
                      filter="url(#glow-cyan-fx)"
                      className="animate-ping"
                    />
                  )}
                </g>
              );
            })}

            {/* Render Nodes */}
            {MESH_NODES.map((node) => {
              const isSelected = selectedNode === node.id;
              const isOrchestrator = node.id === 'orchestrator';
              const isNodeActive = isSimulating && activeStep >= 0 && (
                simulationFlow[activeStep].from === node.id || simulationFlow[activeStep].to === node.id
              );

              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNode(node.id)}
                  className="cursor-pointer transition-transform hover:scale-105"
                >
                  {/* Outer Pulsing Aura for active or selected node */}
                  {(isSelected || isNodeActive) && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isOrchestrator ? 56 : 46}
                      fill="none"
                      stroke={isOrchestrator ? '#00F0FF' : '#10B981'}
                      strokeWidth="2"
                      opacity="0.5"
                      className="animate-radar"
                    />
                  )}

                  {/* Node Circle Background */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isOrchestrator ? 44 : 36}
                    fill="#141619"
                    stroke={
                      isNodeActive ? '#00F0FF' :
                      isSelected ? '#10B981' :
                      '#22272F'
                    }
                    strokeWidth={isNodeActive || isSelected ? 3 : 1.5}
                    filter={isNodeActive || isSelected ? 'url(#glow-cyan-fx)' : undefined}
                  />

                  {/* Icon label */}
                  <text
                    x={node.x}
                    y={node.y - 4}
                    textAnchor="middle"
                    fill={node.color}
                    fontSize={isOrchestrator ? "16" : "13"}
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {node.id.slice(0, 4).toUpperCase()}
                  </text>

                  {/* Node Label Below */}
                  <text
                    x={node.x}
                    y={node.y + 14}
                    textAnchor="middle"
                    fill="#94A3B8"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {node.role.slice(0, 14)}
                  </text>

                  <text
                    x={node.x}
                    y={node.y + (isOrchestrator ? 58 : 48)}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="11"
                    fontWeight="600"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Node Details Card */}
        {selectedNode && (
          <div className="mt-4 p-4 rounded-xl bg-[#0B0C0E] border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#141619] border border-[#22272F] text-cyan-400">
                <Network className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">{getNodeInfo(selectedNode)?.label}</span>
                  <span className="text-cyan-400 font-semibold">[{getNodeInfo(selectedNode)?.role}]</span>
                </div>
                <span className="text-slate-400 text-[11px]">
                  Direct P2P Encrypted Channel · TLS 1.3 · Mutual Authentication Active
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[11px] shrink-0">
              <span className="px-2 py-1 rounded bg-[#141619] border border-[#22272F] text-slate-300">
                State: Zero-Retention
              </span>
              <span className="px-2 py-1 rounded bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 font-bold">
                100% Healthy
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
