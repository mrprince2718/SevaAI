'use client';

import React, {useMemo, useState} from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Search,
  KeyRound,
  Printer,
  ArrowLeft,
  RotateCcw,
  FileCheck2,
  Loader2,
} from 'lucide-react';
import {useSeva} from '@/lib/seva-store';
import OfficialCertificateModal from './OfficialCertificateModal';
import DemoPrototypeNote from './DemoPrototypeNote';

type FilterTab = 'all' | 'pending' | 'issued';

export default function MamlatdarDashboardView() {
  const {
    language,
    applications,
    selectedApplicationId,
    setSelectedApplicationId,
    approveApplicationWithDSC,
    setActiveView,
    resetAllDemoData,
  } = useSeva();

  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSigning, setIsSigning] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      if (filterTab === 'pending' && app.status !== 'Pending Mamlatdar DSC') {
        return false;
      }
      if (filterTab === 'issued' && app.status !== 'Certificate Issued') {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          app.id.toLowerCase().includes(q) ||
          app.applicantName.toLowerCase().includes(q) ||
          app.applicantNameGu.toLowerCase().includes(q) ||
          app.certificateType.toLowerCase().includes(q) ||
          app.village.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [applications, filterTab, searchQuery]);

  const selectedApp =
    applications.find((a) => a.id === selectedApplicationId) ||
    filteredApplications[0] ||
    applications[0];

  const pendingCount = applications.filter(
    (a) => a.status === 'Pending Mamlatdar DSC'
  ).length;
  const issuedCount = applications.filter(
    (a) => a.status === 'Certificate Issued'
  ).length;

  const handleApproveDSC = () => {
    if (!selectedApp || selectedApp.status === 'Certificate Issued') return;
    setIsSigning(true);
    window.setTimeout(() => {
      approveApplicationWithDSC(selectedApp.id);
      setIsSigning(false);
    }, 450);
  };

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* UIDAI Royal-to-Cyan Officer Console Banner */}
      <div className="uidai-hero-gradient rounded-2xl p-6 sm:p-7 text-white relative overflow-hidden shadow-[0_12px_32px_-8px_rgba(2,11,80,0.3)]">
        <svg
          aria-hidden="true"
          viewBox="0 0 320 320"
          className="absolute -right-12 -top-16 w-72 h-72 text-white/10 pointer-events-none"
          fill="none"
        >
          <circle cx="160" cy="160" r="140" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="160" cy="160" r="105" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="160" cy="160" r="70" stroke="currentColor" strokeWidth="1.5" />
        </svg>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-sky-200">
              <span>Office of the Mamlatdar · Sanand Taluka, Ahmedabad</span>
              <span aria-hidden="true">·</span>
              <span className="text-white">Officer: Shri M. K. Jadeja (Class-II)</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1.5 tracking-tight">
              Mamlatdar & Talati Verification Console
            </h1>
            <p className="text-sm text-sky-100 mt-1">
              Real-time queue of AI pre-verified kiosk packets ready for 1-click Digital Signature (DSC) issuance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <div className="flex items-center gap-6 px-5 py-3 bg-white/12 border border-white/20 rounded-xl text-xs backdrop-blur-xs">
              <div>
                <div className="text-sky-100">Pending DSC</div>
                <div className="font-mono text-xl font-extrabold text-[#FAB401] tabular-nums">
                  {pendingCount}
                </div>
              </div>
              <div className="h-8 w-px bg-white/25" />
              <div>
                <div className="text-sky-100">Issued Today</div>
                <div className="font-mono text-xl font-extrabold text-emerald-300 tabular-nums">
                  {issuedCount}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={resetAllDemoData}
              className="inline-flex items-center gap-1.5 px-4 py-3 text-xs font-bold text-[#123B63] bg-white hover:bg-[#F6F8FA] rounded-xl shadow-sm transition-colors cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Demo Queue</span>
            </button>
          </div>
        </div>
      </div>

      <DemoPrototypeNote language={language} context="dashboard" />

      {/* Main Split Workspace: Left Queue List + Right Side-by-Side OCR Cross-Check */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left: Incoming Kiosk Applications Queue */}
        <div className="xl:col-span-4 uidai-card rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-base font-bold text-[#123B63]">
              Incoming Kiosk Queue
            </h2>
            <span className="font-mono text-xs font-semibold text-[#123B63] tabular-nums">
              {filteredApplications.length} Records
            </span>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ID, citizen name, village..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#F6F8FA] border border-[#D9DEE5] rounded-xl focus:outline-none focus:border-[#D32828] focus:bg-white"
            />
          </div>

          {/* Segmented Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#F6F8FA] border border-[#D9DEE5] rounded-xl">
            {[
              {id: 'all' as FilterTab, label: 'All'},
              {id: 'pending' as FilterTab, label: 'Pending DSC'},
              {id: 'issued' as FilterTab, label: 'Issued'},
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterTab(tab.id)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  filterTab === tab.id
                    ? 'bg-[#123B63] text-white shadow-xs'
                    : 'text-[#123B63]/75 hover:text-[#123B63]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Queue Cards */}
          <div className="space-y-2.5">
            {filteredApplications.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-[#D9DEE5] rounded-xl">
                No matching kiosk applications found.
              </div>
            ) : (
              filteredApplications.map((app) => {
                const isSelected = selectedApp?.id === app.id;
                const isIssued = app.status === 'Certificate Issued';

                return (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => setSelectedApplicationId(app.id)}
                    className={`w-full text-left rounded-xl border p-3.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#F6F8FA] border-[#123B63] ring-1 ring-[#123B63]/25'
                        : 'bg-white border-[#D9DEE5] hover:bg-[#F6F8FA]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-mono font-bold text-[#123B63] tabular-nums">
                        {app.id}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 font-bold ${
                          isIssued
                            ? 'text-[#046A38]'
                            : 'px-2 py-0.5 rounded bg-[#FAF6EE] border border-[#F0A900]/45 text-[#202124]'
                        }`}
                      >
                        {isIssued ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <Clock className="h-3.5 w-3.5" />
                        )}
                        <span>{app.status}</span>
                      </span>
                    </div>

                    <div className="mt-1.5 text-sm font-bold text-[#123B63]">
                      {app.applicantName}
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      {app.certificateType} · {app.village}, {app.taluka}
                    </div>

                    <div className="mt-2 pt-2 border-t border-[#E3EAF5] flex items-center justify-between text-[11px] text-slate-500">
                      <span>{app.submittedAt}</span>
                      <span className="font-bold text-[#046A38] tabular-nums">
                        AI Score: {app.aiScore}%
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Detailed Verification Packet + 6-Doc Cross-Check + 1-Click DSC */}
        {selectedApp && (
          <div className="xl:col-span-8 space-y-5">
            {/* Packet Header & AI Pre-Verification Score */}
            <div className="uidai-card rounded-2xl p-5 sm:p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-5 border-b border-[#E3EAF5]">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500">
                    <span className="font-bold text-[#123B63]">{selectedApp.id}</span>
                    <span aria-hidden="true">·</span>
                    <span>{selectedApp.certificateType}</span>
                    <span aria-hidden="true">·</span>
                    <span>Submitted {selectedApp.submittedAt}</span>
                  </div>
                  <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#123B63] mt-1">
                    {selectedApp.applicantName}
                  </h2>
                  <p className="text-sm text-slate-600">
                    {selectedApp.applicantNameGu} · S/o {selectedApp.fatherName} · Village{' '}
                    {selectedApp.village}, Taluka {selectedApp.taluka}
                  </p>
                </div>

                {/* Mandatory AI Pre-Verification Score Callout */}
                <div className="rounded-xl bg-[#046A38]/8 border border-[#046A38]/35 px-4 py-3 shrink-0">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#046A38]">
                    <ShieldCheck className="h-4 w-4 shrink-0" />
                    <span>AI Pre-Verification Score</span>
                  </div>
                  <div className="font-display text-base sm:text-lg font-extrabold text-[#123B63] mt-0.5 tabular-nums">
                    100% Error-Free (0 Spelling Mismatches)
                  </div>
                </div>
              </div>

              {/* Citizen Summary Strip */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs">
                <div className="bg-[#F4F8FD] border border-[#D9DEE5] rounded-xl p-3">
                  <div className="text-slate-500">
                    {selectedApp.certificateType.toLowerCase().includes('income')
                      ? 'Occupation / Source'
                      : selectedApp.certificateType.toLowerCase().includes('domicile')
                        ? 'Residence Tenure'
                        : 'Caste / Sub-Caste'}
                  </div>
                  <div className="font-bold text-[#123B63] mt-0.5">
                    {selectedApp.subCaste}
                  </div>
                </div>
                <div className="bg-[#F4F8FD] border border-[#D9DEE5] rounded-xl p-3">
                  <div className="text-slate-500">Aadhaar (Redacted)</div>
                  <div className="font-mono font-bold text-[#123B63] mt-0.5">
                    {selectedApp.aadhaarMasked}
                  </div>
                </div>
                <div className="bg-[#F4F8FD] border border-[#D9DEE5] rounded-xl p-3">
                  <div className="text-slate-500">Date of Birth</div>
                  <div className="font-mono font-bold text-[#123B63] mt-0.5 tabular-nums">
                    {selectedApp.dob}
                  </div>
                </div>
                <div className="bg-[#F4F8FD] border border-[#D9DEE5] rounded-xl p-3">
                  <div className="text-slate-500">Annual Income</div>
                  <div className="font-mono font-bold text-[#123B63] mt-0.5 tabular-nums">
                    {selectedApp.annualIncome}
                  </div>
                </div>
              </div>

              {/* 1-Click DSC Action Bar */}
              <div className="mt-5 pt-5 border-t border-[#E3EAF5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {selectedApp.status === 'Certificate Issued' ? (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-10 w-10 rounded-xl bg-[#046A38] text-white flex items-center justify-center shrink-0">
                      <FileCheck2 className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-bold text-[#046A38]">
                        Certificate Issued · Digitally Signed
                      </div>
                      <div className="text-xs font-mono text-slate-600">
                        {selectedApp.dscTokenId} · Approved {selectedApp.approvedAt}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs sm:text-sm text-slate-600">
                    All 6 supporting records verified by Taluka AI Engine. Ready for Mamlatdar DSC token sign-off.
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  {selectedApp.status === 'Pending Mamlatdar DSC' ? (
                    <button
                      type="button"
                      onClick={handleApproveDSC}
                      disabled={isSigning}
                      className="inline-flex items-center gap-2 px-5 py-3 text-sm font-bold text-white bg-[#046A38] hover:bg-[#0f6e06] disabled:opacity-70 rounded-xl shadow-sm transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {isSigning ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Signing with DSC Token...</span>
                        </>
                      ) : (
                        <>
                          <KeyRound className="h-4 w-4" />
                          <span>1-Click Approve with Digital Signature (DSC)</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setShowCertificateModal(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#123B63] to-[#123B63] hover:from-[#123B63] hover:to-[#D32828] rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
                      >
                        <Printer className="h-4 w-4" />
                        <span>Preview Printable Certificate</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveView('kiosk')}
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-[#123B63] bg-[#F6F8FA] border border-[#D9DEE5] hover:bg-[#E1ECFA] rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Return to Citizen Kiosk</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Side-by-Side OCR Cross-Check Table Across All 6 Documents */}
            <div className="uidai-card rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E3EAF5] flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-display text-base font-bold text-[#123B63]">
                    Side-by-Side 6-Document OCR Cross-Check Matrix
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Automated field-level verification confirming identical applicant name, father’s name, and caste lineage.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-[#046A38] tabular-nums">
                  6/6 Matched · 0 Conflicts
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#123B63] text-white text-xs font-semibold">
                      <th className="py-3 px-4">Document & Ref ID</th>
                      <th className="py-3 px-4">Extracted Applicant Name</th>
                      <th className="py-3 px-4">Extracted Father’s Name</th>
                      <th className="py-3 px-4">Caste / Lineage / Detail</th>
                      <th className="py-3 px-4 text-right">Match</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E3EAF5]">
                    {selectedApp.documents.map((doc) => (
                      <tr
                        key={doc.id}
                        className="hover:bg-[#F4F8FD] transition-colors"
                      >
                        <td className="py-3.5 px-4 align-top">
                          <div className="font-bold text-[#123B63]">
                            {doc.order}. {doc.titleEn}
                          </div>
                          <div className="font-mono text-[11px] text-slate-500 mt-0.5">
                            {doc.docNumber}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 align-top">
                          <div className="font-semibold text-slate-900">
                            {doc.extractedName}
                          </div>
                          <div className="text-xs text-slate-500">
                            {doc.extractedNameGu}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 align-top">
                          <div className="font-semibold text-slate-900">
                            {doc.extractedFatherName}
                          </div>
                          <div className="text-xs text-slate-500">
                            {doc.extractedFatherNameGu}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 align-top">
                          <div className="text-slate-700">
                            {doc.extractedCasteOrDetail}
                          </div>
                          <div className="text-[11px] font-semibold text-[#123B63] mt-0.5">
                            {doc.verificationBadge}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 font-mono font-bold text-[#046A38] tabular-nums">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>{doc.matchScore}%</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {showCertificateModal && selectedApp && (
        <OfficialCertificateModal
          application={selectedApp}
          onClose={() => setShowCertificateModal(false)}
        />
      )}
    </section>
  );
}
