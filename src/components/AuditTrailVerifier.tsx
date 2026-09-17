import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  XCircle, 
  FileCode, 
  KeyRound, 
  Lock, 
  RotateCw, 
  Copy, 
  Check, 
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  X
} from 'lucide-react';
import { AuditRecord } from '../types/agent';
import { verifyRecordIntegrity } from '../services/clientAgentService';
import { computeHmacSha256, HMAC_SECRET_SALT } from '../services/cryptoUtils';

interface AuditTrailVerifierProps {
  auditRecords: AuditRecord[];
}

export const AuditTrailVerifier: React.FC<AuditTrailVerifierProps> = ({ auditRecords }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<AuditRecord | null>(null);
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    recomputedHash: string;
    statusText: string;
  } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isTampered, setIsTampered] = useState(false);
  const [tamperedPayloadText, setTamperedPayloadText] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const filteredRecords = auditRecords.filter(r => 
    r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.targetEntity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.hmacSignature.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenVerifyModal = async (record: AuditRecord) => {
    setSelectedRecord(record);
    setIsTampered(false);
    setTamperedPayloadText(JSON.stringify(record.rawPayload, null, 2));
    setIsVerifying(true);

    const result = await verifyRecordIntegrity(record);
    setVerificationResult({
      isValid: result.isValid,
      recomputedHash: result.recomputedHash,
      statusText: result.statusText
    });
    setIsVerifying(false);
  };

  const handleSimulateTamper = async () => {
    if (!selectedRecord) return;

    if (!isTampered) {
      // Alter a single field to simulate unauthorized tampering
      const tampered = {
        ...selectedRecord.rawPayload,
        unauthorizedEntitlementInjected: "aws:root:superadmin_bypass_grant",
        tamperedAt: new Date().toISOString()
      };
      const text = JSON.stringify(tampered, null, 2);
      setTamperedPayloadText(text);
      setIsTampered(true);

      // Recompute HMAC on the tampered payload
      const tamperedSerialized = JSON.stringify(tampered, Object.keys(tampered).sort());
      const tamperedHash = await computeHmacSha256(tamperedSerialized, HMAC_SECRET_SALT);
      setVerificationResult({
        isValid: false,
        recomputedHash: tamperedHash,
        statusText: "SIGNATURE MISMATCH: Cryptographic Integrity Violated! Payload Altered."
      });
    } else {
      // Revert to original untampered
      setIsTampered(false);
      setTamperedPayloadText(JSON.stringify(selectedRecord.rawPayload, null, 2));
      const result = await verifyRecordIntegrity(selectedRecord);
      setVerificationResult({
        isValid: result.isValid,
        recomputedHash: result.recomputedHash,
        statusText: result.statusText
      });
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#141619] border border-[#22272F] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              SOC-2 / ISO 27001 AUDIT TRAIL
            </span>
            <span className="text-xs font-mono text-cyan-400">HMAC-SHA256 Signed</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            Cryptographic Audit Trail & Verifier
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Immutable append-only ledger for all agent execution handoffs. Click any record to inspect the raw JSON payload and execute real-time SHA-256 HMAC verification.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Agent, HMAC, or Target..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0B0C0E] border border-[#22272F] rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Audit Log Table Card */}
      <div className="rounded-2xl bg-[#141619] border border-[#22272F] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#22272F] bg-[#0B0C0E]/70 font-mono text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4">Record ID</th>
                <th className="py-3.5 px-4">Timestamp (UTC)</th>
                <th className="py-3.5 px-4">Agent Name</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Target Entity</th>
                <th className="py-3.5 px-4">HMAC Signature</th>
                <th className="py-3.5 px-4 text-right">Integrity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#22272F]/60 font-mono">
              {filteredRecords.map((record) => (
                <tr
                  key={record.id}
                  onClick={() => handleOpenVerifyModal(record)}
                  className="hover:bg-[#1a1e24] cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-4 font-bold text-cyan-400 whitespace-nowrap">
                    {record.id}
                  </td>
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                    {record.timestamp}
                  </td>
                  <td className="py-3 px-4 text-white font-semibold whitespace-nowrap">
                    {record.agentName}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {record.action}
                  </td>
                  <td className="py-3 px-4 text-slate-400 truncate max-w-[180px]">
                    {record.targetEntity}
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono">
                    <span className="text-cyan-300/80 bg-[#0B0C0E] px-2 py-0.5 rounded border border-[#22272F] text-[10px] inline-block max-w-[140px] truncate group-hover:border-cyan-500/40">
                      {record.hmacSignature}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenVerifyModal(record);
                      }}
                      className="px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer transition-all shadow-sm"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verify Integrity</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="py-12 text-center text-slate-500 font-mono text-xs">
            No audit records match "{searchQuery}".
          </div>
        )}
      </div>

      {/* Verify Integrity Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-3xl max-h-[90vh] bg-[#141619] border border-cyan-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#22272F] flex items-center justify-between bg-[#0B0C0E]/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#141619] border border-emerald-500/40 text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Cryptographic Integrity Verifier</span>
                    <span className="text-xs font-mono text-cyan-400">[{selectedRecord.id}]</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Action: {selectedRecord.action} · Executed by {selectedRecord.agentName}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#22272F] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 font-mono text-xs">
              {/* Verification Status Banner */}
              {isVerifying ? (
                <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 flex items-center gap-2">
                  <RotateCw className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>Computing SHA-256 HMAC digest against KMS secret key...</span>
                </div>
              ) : verificationResult?.isValid ? (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 flex items-center justify-between shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-bold text-sm text-emerald-400">
                        SIGNATURE VERIFIED: SHA-256 Hash Matches Database Payload
                      </p>
                      <p className="text-[11px] text-emerald-300/80 mt-0.5">
                        HMAC MATCH: Record Unaltered. SOC-2 Type II cryptographic compliance intact.
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/40">
                    PASS
                  </span>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 flex items-center justify-between shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                    <div>
                      <p className="font-bold text-sm text-red-400">
                        SIGNATURE MISMATCH: Cryptographic Integrity Violated
                      </p>
                      <p className="text-[11px] text-red-300/80 mt-0.5">
                        Payload contents have been altered after signing. Tamper alert triggered.
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 font-bold text-[10px] border border-red-500/40">
                    FAIL
                  </span>
                </div>
              )}

              {/* Hash Comparison Table */}
              <div className="p-4 rounded-xl bg-[#0B0C0E] border border-[#22272F] space-y-3">
                <div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                    <span>Stored Database HMAC Signature:</span>
                    <button
                      onClick={() => copyToClipboard(selectedRecord.hmacSignature, 'stored')}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedField === 'stored' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <p className="p-2.5 rounded bg-[#141619] border border-[#22272F] text-cyan-300 text-[11px] break-all select-all">
                    {selectedRecord.hmacSignature}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                    <span>Recomputed Live Hash (SHA-256):</span>
                    <button
                      onClick={() => copyToClipboard(verificationResult?.recomputedHash || '', 'recomputed')}
                      className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedField === 'recomputed' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <p className={`p-2.5 rounded bg-[#141619] border text-[11px] break-all select-all ${
                    verificationResult?.isValid
                      ? 'border-emerald-500/40 text-emerald-300'
                      : 'border-red-500/40 text-red-300'
                  }`}>
                    {verificationResult?.recomputedHash}
                  </p>
                </div>
              </div>

              {/* Raw JSON Payload */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-slate-400 font-mono text-[11px]">
                    Raw Execution Payload (Immutable Ledger Representation):
                  </span>
                  <button
                    onClick={handleSimulateTamper}
                    className={`px-3 py-1 rounded text-[11px] font-mono font-bold transition-all cursor-pointer ${
                      isTampered
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                        : 'bg-[#1c2026] text-slate-300 hover:text-cyan-300 border border-[#2A303C]'
                    }`}
                  >
                    {isTampered ? 'Revert Tamper Simulation' : '⚡ Simulate Payload Tamper (Test Proof)'}
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0B0C0E] border border-[#22272F] text-slate-300 max-h-56 overflow-y-auto">
                  <pre className={isTampered ? 'text-red-400' : 'text-emerald-400'}>
                    {tamperedPayloadText}
                  </pre>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#22272F] bg-[#0B0C0E]/50 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1 text-slate-300">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                Algorithm: HMAC-SHA256 (RFC 2104)
              </span>
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-xl bg-[#1c2026] hover:bg-[#22272F] text-slate-200 font-semibold cursor-pointer transition-colors"
              >
                Close Verifier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
