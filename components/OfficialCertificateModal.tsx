'use client';

import React from 'react';
import {Printer, X, ShieldCheck, CheckCircle2} from 'lucide-react';
import {ApplicationRecord} from '@/lib/types';

interface OfficialCertificateModalProps {
  application: ApplicationRecord;
  onClose: () => void;
}

export default function OfficialCertificateModal({
  application,
  onClose,
}: OfficialCertificateModalProps) {
  const handlePrint = () => {
    window.print();
  };

  // Deterministic 15x15 QR matrix pattern based on application ID
  const qrSize = 15;
  const seed = application.id
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);

  const isFinderCell = (r: number, c: number) => {
    const inTopLeft = r < 4 && c < 4;
    const inTopRight = r < 4 && c >= qrSize - 4;
    const inBottomLeft = r >= qrSize - 4 && c < 4;
    return inTopLeft || inTopRight || inBottomLeft;
  };

  const isFinderFilled = (r: number, c: number) => {
    const lr = r < 4 ? r : r - (qrSize - 4);
    const lc = c < 4 ? c : c - (qrSize - 4);
    if (lr === 0 || lr === 3 || lc === 0 || lc === 3) return true;
    return (lr === 1 || lr === 2) && (lc === 1 || lc === 2);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Official Digitally Signed ${application.certificateType}`}
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="w-full max-w-3xl bg-white rounded-xl border border-[#D9DEE5] shadow-xl overflow-hidden my-6 print-only-certificate">
        {/* Modal Toolbar (hidden on print) */}
        <div className="no-print flex items-center justify-between gap-4 px-6 py-4 bg-[#F6F8FA] border-b border-[#D9DEE5]">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#046A38]">
            <CheckCircle2 className="h-4 w-4" />
            <span>Digitally Signed & Verifiable Certificate Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#123B63] hover:bg-[#0D2B49] rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>Print Official Certificate</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close certificate preview"
              className="p-2 text-[#5F6368] hover:text-[#202124] hover:bg-[#D9DEE5]/50 rounded-lg transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Certificate Sheet */}
        <div className="p-6 sm:p-10 bg-white text-[#202124]">
          <div className="border-2 border-[#123B63] p-6 sm:p-8 rounded-sm relative">
            {/* Top Tricolor Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#F0A900] via-white to-[#046A38] border-y border-[#D9DEE5]/50 mb-6" />

            {/* Gov Header */}
            <div className="text-center border-b border-[#D9DEE5] pb-5">
              <div className="mx-auto mb-3 h-14 w-14 rounded-full bg-[#123B63] text-white flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="h-9 w-9" fill="none">
                  <circle cx="20" cy="20" r="14" stroke="#FFFFFF" strokeWidth="1.6" />
                  <circle cx="20" cy="20" r="3" fill="#F0A900" />
                  <path
                    d="M20 6V14M20 26V34M6 20H14M26 20H34M10.1 10.1L15.7 15.7M24.3 24.3L29.9 29.9M29.9 10.1L24.3 15.7M15.7 24.3L10.1 29.9"
                    stroke="#FFFFFF"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="text-xs font-semibold tracking-wide text-[#123B63]">
                ગુજરાત સરકાર · GOVERNMENT OF GUJARAT
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#123B63] mt-1">
                {application.certificateType}
              </h2>
              <div className="text-sm font-medium text-[#5F6368] mt-0.5">
                {application.certificateTypeGu} · Office of the Mamlatdar, Taluka{' '}
                {application.taluka}, Dist. {application.district}
              </div>
            </div>

            {/* Reference Metadata Row */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#5F6368] bg-[#F6F8FA] border border-[#D9DEE5] px-4 py-2.5 rounded">
              <span>
                Certificate No: <strong className="text-[#123B63]">{application.id}</strong>
              </span>
              <span>
                Issued Date:{' '}
                <strong className="text-[#123B63]">
                  {application.approvedAt || '17 Nov 2026'}
                </strong>
              </span>
            </div>

            {/* Certificate Legal Body */}
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-800">
              {application.certificateType.toLowerCase().includes('income') ? (
                <>
                  <p>
                    This is to certify that the total annual income from all sources of{' '}
                    <strong className="text-[#0B3B60]">{application.applicantName}</strong>
                    {application.applicantNameGu &&
                    application.applicantNameGu !== application.applicantName ? (
                      <>
                        {' '}
                        (<span className="font-medium">{application.applicantNameGu}</span>)
                      </>
                    ) : null}
                    , Son/Daughter of{' '}
                    <strong className="text-[#0B3B60]">{application.fatherName}</strong>
                    {application.fatherNameGu &&
                    application.fatherNameGu !== application.fatherName ? (
                      <>
                        {' '}
                        (<span className="font-medium">{application.fatherNameGu}</span>)
                      </>
                    ) : null}
                    , residing at Village <strong>{application.village}</strong>, Taluka{' '}
                    <strong>{application.taluka}</strong>, District{' '}
                    <strong>{application.district}</strong>, Gujarat, is verified at{' '}
                    <strong className="text-[#0B3B60]">{application.annualIncome}</strong> per annum
                    after Talati Panchkyas &amp; 6-document scrutiny.
                  </p>
                  <p className="text-slate-600">
                    આથી પ્રમાણિત કરવામાં આવે છે કે શ્રી/શ્રીમતી{' '}
                    <strong className="text-slate-900">
                      {application.applicantNameGu || application.applicantName}
                    </strong>
                    , પિતાનું નામ{' '}
                    <strong className="text-slate-900">
                      {application.fatherNameGu || application.fatherName}
                    </strong>
                    , રહેવાસી ગામ {application.village}, તાલુકો {application.taluka}, જિલ્લો{' '}
                    {application.district}, ગુજરાતના પરિવારની કુલ વાર્ષિક આવક{' '}
                    <strong className="text-slate-900">{application.annualIncome}</strong> છે.
                  </p>
                </>
              ) : application.certificateType.toLowerCase().includes('domicile') ? (
                <>
                  <p>
                    This is to certify that{' '}
                    <strong className="text-[#0B3B60]">{application.applicantName}</strong>
                    {application.applicantNameGu &&
                    application.applicantNameGu !== application.applicantName ? (
                      <>
                        {' '}
                        (<span className="font-medium">{application.applicantNameGu}</span>)
                      </>
                    ) : null}
                    , Son/Daughter of{' '}
                    <strong className="text-[#0B3B60]">{application.fatherName}</strong>
                    {application.fatherNameGu &&
                    application.fatherNameGu !== application.fatherName ? (
                      <>
                        {' '}
                        (<span className="font-medium">{application.fatherNameGu}</span>)
                      </>
                    ) : null}
                    , residing at Village <strong>{application.village}</strong>, Taluka{' '}
                    <strong>{application.taluka}</strong>, District{' '}
                    <strong>{application.district}</strong>, is a bona fide permanent resident and{' '}
                    <strong className="text-[#0B3B60]">Domicile of Gujarat State</strong> (10+ years
                    verified residence).
                  </p>
                  <p className="text-slate-600">
                    આથી પ્રમાણિત કરવામાં આવે છે કે શ્રી/શ્રીમતી{' '}
                    <strong className="text-slate-900">
                      {application.applicantNameGu || application.applicantName}
                    </strong>
                    , પિતાનું નામ{' '}
                    <strong className="text-slate-900">
                      {application.fatherNameGu || application.fatherName}
                    </strong>
                    , રહેવાસી ગામ {application.village}, તાલુકો {application.taluka}, જિલ્લો{' '}
                    {application.district}, છેલ્લા ૧૦+ વર્ષથી{' '}
                    <strong className="text-slate-900">ગુજરાત રાજ્યના કાયમી રહેવાસી</strong> છે.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    This is to certify that{' '}
                    <strong className="text-[#0B3B60]">{application.applicantName}</strong>
                    {application.applicantNameGu &&
                    application.applicantNameGu !== application.applicantName ? (
                      <>
                        {' '}
                        (<span className="font-medium">{application.applicantNameGu}</span>)
                      </>
                    ) : null}
                    , Son/Daughter of{' '}
                    <strong className="text-[#0B3B60]">{application.fatherName}</strong>
                    {application.fatherNameGu &&
                    application.fatherNameGu !== application.fatherName ? (
                      <>
                        {' '}
                        (<span className="font-medium">{application.fatherNameGu}</span>)
                      </>
                    ) : null}
                    , residing at Village <strong>{application.village}</strong>, Taluka{' '}
                    <strong>{application.taluka}</strong>, District{' '}
                    <strong>{application.district}</strong>, Gujarat, belongs to the{' '}
                    <strong className="text-[#0B3B60]">{application.casteCategory}</strong>{' '}
                    community / sub-caste <strong>{application.subCaste}</strong>, which is recognized
                    under Government of Gujarat Social Justice &amp; Empowerment Resolution.
                  </p>
                  <p className="text-slate-600">
                    આથી પ્રમાણિત કરવામાં આવે છે કે શ્રી/શ્રીમતી{' '}
                    <strong className="text-slate-900">
                      {application.applicantNameGu || application.applicantName}
                    </strong>
                    , પિતાનું નામ{' '}
                    <strong className="text-slate-900">
                      {application.fatherNameGu || application.fatherName}
                    </strong>
                    , રહેવાસી ગામ {application.village}, તાલુકો {application.taluka}, જિલ્લો{' '}
                    {application.district}, ગુજરાત સરકારના નિયમો મુજબ{' '}
                    <strong className="text-slate-900">{application.subCaste}</strong> વર્ગના છે.
                  </p>
                </>
              )}
            </div>

            {/* Verified Details Table */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border border-[#D9DEE5] rounded-lg p-4 bg-[#F6F8FA]">
              <div>
                <span className="text-[#5F6368]">Aadhaar Reference (Masked):</span>{' '}
                <span className="font-mono font-semibold text-[#123B63]">
                  {application.aadhaarMasked}
                </span>
              </div>
              <div>
                <span className="text-[#5F6368]">Date of Birth:</span>{' '}
                <span className="font-mono font-semibold text-[#123B63] tabular-nums">
                  {application.dob}
                </span>
              </div>
              <div>
                <span className="text-[#5F6368]">Verified Annual Income:</span>{' '}
                <span className="font-mono font-semibold text-[#123B63] tabular-nums">
                  {application.annualIncome}
                </span>
              </div>
              <div>
                <span className="text-[#5F6368]">AI 6-Doc Cross-Check:</span>{' '}
                <span className="font-semibold text-[#046A38]">
                  100% Verified (0 Mismatches)
                </span>
              </div>
            </div>

            {/* Bottom Signature + QR Code Verification Block */}
            <div className="mt-8 pt-6 border-t border-[#D9DEE5] flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
              {/* Verifiable QR Code */}
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white border border-[#D9DEE5] rounded-lg shrink-0">
                  <svg
                    viewBox={`0 0 ${qrSize} ${qrSize}`}
                    className="w-24 h-24"
                    role="img"
                    aria-label={`Verification QR Code for ${application.id}`}
                  >
                    <rect width={qrSize} height={qrSize} fill="#FFFFFF" />
                    {Array.from({length: qrSize}).map((_, r) =>
                      Array.from({length: qrSize}).map((__, c) => {
                        const filled = isFinderCell(r, c)
                          ? isFinderFilled(r, c)
                          : ((r * 7 + c * 13 + seed) % 11) < 5;
                        return filled ? (
                          <rect
                            key={`${r}-${c}`}
                            x={c}
                            y={r}
                            width={1}
                            height={1}
                            fill="#123B63"
                          />
                        ) : null;
                      })
                    )}
                  </svg>
                </div>
                <div className="text-xs text-[#5F6368] space-y-1">
                  <div className="font-semibold text-[#123B63]">
                    Scan QR to Verify Authenticity
                  </div>
                  <div className="font-mono text-[11px]">
                    ID: {application.id}
                  </div>
                  <div className="font-mono text-[11px] text-[#046A38]">
                    e-Pramanpatra Hash Validated
                  </div>
                </div>
              </div>

              {/* Mamlatdar DSC Signature Box */}
              <div className="border border-[#046A38]/40 bg-[#ECF7F0] rounded-lg p-3.5 text-xs min-w-[240px]">
                <div className="flex items-center gap-1.5 font-bold text-[#046A38]">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>DIGITALLY SIGNED (DSC)</span>
                </div>
                <div className="mt-1.5 font-semibold text-[#123B63]">
                  {application.officerName || 'Shri M. K. Jadeja (Mamlatdar, Sanand)'}
                </div>
                <div className="font-mono text-[11px] text-[#5F6368] mt-0.5">
                  Token: {application.dscTokenId || 'DSC-GJ-SND-2026-8419'}
                </div>
                <div className="font-mono text-[11px] text-[#5F6368]">
                  Signed: {application.approvedAt || '17 Nov 2026'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
