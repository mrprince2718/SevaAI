'use client';

import React, {useState} from 'react';
import {
  Award,
  CheckCircle2,
  ArrowRight,
  Printer,
  ShieldCheck,
  Landmark,
  SlidersHorizontal,
  Layers,
  CalendarCheck,
} from 'lucide-react';
import {useSeva} from '@/lib/seva-store';

const GRANT_SCHEMES = [
  {
    name: 'SSIP 2.0 (Gujarat)',
    focus: 'PoC & Hardware Prototype Grant',
    fundingRange: 'Up to ₹2.5L – ₹10L',
    fitReason:
      'Directly solves Gujarati rural Taluka Kacheri literacy & spelling-mismatch bottlenecks with a ₹68,000 hardware unit.',
  },
  {
    name: 'Startup India Seed Fund (SISFS)',
    focus: 'Validation, Field Pilot & Market Entry',
    fundingRange: 'Up to ₹20L Grant',
    fitReason:
      'Strong measurable social impact (62% → 0% rejection) and scalable B2G SaaS + Kiosk deployment across 252 Talukas.',
  },
  {
    name: 'MeitY TIDE 2.0 / Bhashini Aligned',
    focus: 'Regional Voice AI & Digital Public Infrastructure',
    fundingRange: 'Up to ₹7L – ₹30L',
    fitReason:
      'Voice-first Gujarati/Hindi conversational AI removes tout dependency for non-English-speaking citizens.',
  },
];

const BUDGET_ALLOCATION = [
  {
    head: '2 Physical Kiosk Pilot Units (Sanand & Dholka Kacheri)',
    details: '2 × ₹68,000 complete enclosure, 16MP platen, touchscreen, UPS',
    amount: 136000,
  },
  {
    head: 'Gujarati / Hindi Edge OCR & Phonetic NLP Fine-Tuning',
    details: 'Handwritten LC, 7/12 extract, and legacy certificate accuracy tuning',
    amount: 54000,
  },
  {
    head: 'UIDAI Redaction, STQC RD & NIC DSC Security Audit',
    details: 'Compliance testing for masked Aadhaar & encrypted officer packets',
    amount: 35000,
  },
  {
    head: 'Taluka Field Pilot, Operator Training & Citizen Onboarding',
    details: '60-day live Taluka Kacheri validation with Mamlatdar feedback',
    amount: 25000,
  },
];

const MILESTONES = [
  {
    phase: 'Months 1–2',
    title: 'Hardware Assembly & Platen Calibration',
    deliverable:
      'Fabricate 2 steel kiosks with 16MP overhead LED trays and 5MP WDR face-cams.',
  },
  {
    phase: 'Months 3–4',
    title: 'Regional Voice & 6-Doc OCR Engine',
    deliverable:
      'Achieve 99%+ Gujarati/English phonetic matching across Caste, Income & Domicile formats.',
  },
  {
    phase: 'Month 5',
    title: '1-Taluka Live Sandbox Pilot (Sanand)',
    deliverable:
      'Process 500+ shadow citizen packets alongside Mamlatdar DSC workflow.',
  },
  {
    phase: 'Month 6',
    title: 'Security Sign-Off & 10-Taluka Scale Plan',
    deliverable:
      'Publish pilot audit report showing rejection drop and ready-to-procure GIL/GeM spec.',
  },
];

export default function GrantPitchView() {
  const {setActiveView} = useSeva();
  const [talukaCount, setTalukaCount] = useState<number>(25);

  const totalGrantBudget = BUDGET_ALLOCATION.reduce((s, i) => s + i.amount, 0);

  // Deterministic ROI calculation based on selected Taluka scale
  const hardwareCapex = talukaCount * 68000;
  const annualCertificates = talukaCount * 36000; // ~100 apps/day/taluka
  const citizenSavingsInr = annualCertificates * 1200; // ₹1,200 saved in touts & travel
  const officerHoursSaved = Math.round((annualCertificates * 14.75) / 60);

  const formatCrOrLakhs = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(val / 100000).toFixed(2)} L`;
  };

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* UIDAI Royal-to-Cyan Grant Jury Pitch Hero */}
      <div className="uidai-hero-gradient rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-[0_12px_32px_-8px_rgba(2,11,80,0.32)]">
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

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-sky-200">
              <span>Government Grant & Seed Fund Proposal (MVP v1.0)</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-300">Requested PoC Grant: ₹2,50,000</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
              SevaAI: Eliminating 62% Taluka Form Rejections with Voice AI & Edge OCR
            </h1>
            <p className="text-sm sm:text-base text-sky-100 mt-1.5">
              Executive summary, scheme eligibility, live statewide ROI simulator, and 6-month pilot plan prepared for Government Evaluation Juries.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setActiveView('kiosk')}
              className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-bold text-[#123B63] bg-white hover:bg-[#F6F8FA] rounded-xl shadow-md transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>Test Live Citizen Kiosk</span>
              <ArrowRight className="h-4 w-4 text-[#D32828]" />
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-3.5 text-sm font-semibold text-white bg-white/12 border border-white/25 hover:bg-white/20 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
            >
              <Printer className="h-4 w-4" />
              <span>Print Pitch Brief</span>
            </button>
          </div>
        </div>
      </div>

      {/* Problem vs. Solution Clarity for Jury */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="uidai-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#D9232A]">
            <span>THE FIELD PROBLEM IN RURAL TALUKA KACHERIS</span>
          </div>
          <h2 className="font-display text-xl font-extrabold text-[#123B63]">
            Why Citizens Make 3–4 Trips for One Simple Certificate
          </h2>
          <ul className="space-y-2.5 text-sm text-slate-700">
            <li className="flex items-start gap-2.5">
              <span className="font-mono font-bold text-[#D9232A] mt-0.5">01.</span>
              <span>
                <strong>62% First-Attempt Rejection Rate:</strong> Minor Gujarati-to-English name spelling variations across Aadhaar, School LC, and Ration Card cause silent rejections after 10–15 days.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="font-mono font-bold text-[#D9232A] mt-0.5">02.</span>
              <span>
                <strong>Middleman / Tout Dependency:</strong> Citizens pay ₹850–₹1,500 outside Kacheri gates just to get forms filled in English.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="font-mono font-bold text-[#D9232A] mt-0.5">03.</span>
              <span>
                <strong>Mamlatdar Scrutiny Bottleneck:</strong> Officers spend 15+ minutes manually cross-checking 6 paper files per applicant.
              </span>
            </li>
          </ul>
        </div>

        <div className="uidai-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#046A38]">
            <span>THE SEVAAI SOLUTION (VERIFIED IN THIS PROTOTYPE)</span>
          </div>
          <h2 className="font-display text-xl font-extrabold text-[#123B63]">
            Voice-First Kiosk + Pre-Verified 1-Click DSC Packet
          </h2>
          <ul className="space-y-2.5 text-sm text-slate-700">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-[#046A38] shrink-0 mt-0.5" />
              <span>
                <strong>Built-in Zero-Cost Voice &amp; Phonetic Gateway (BHASHINI Ready):</strong> Free offline multilingual voice guidance and auto-transliteration active in MVP today, architected for instant plug-in of MeitY BHASHINI, Sarvam AI, ElevenLabs, and cloud LLMs upon grant funding.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-[#046A38] shrink-0 mt-0.5" />
              <span>
                <strong>6-Document Phonetic OCR Pre-Check:</strong> Catches every name, father’s name, and caste discrepancy <em>before</em> submission (0% rejection).
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-[#046A38] shrink-0 mt-0.5" />
              <span>
                <strong>15-Second Mamlatdar DSC Sign-Off:</strong> Side-by-side matrix lets officers approve error-free packets with 1 click and issue QR-verifiable certificates.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Interactive Statewide Scale & Grant ROI Simulator */}
      <div className="uidai-card rounded-2xl p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E3EAF5]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#F6F8FA] text-[#123B63] flex items-center justify-center">
              <SlidersHorizontal className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-extrabold text-[#123B63]">
                Interactive Government Deployment & ROI Simulator
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Slide to project hardware capex, citizen savings, and officer hours saved across Gujarat’s 252 Talukas.
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-500">Selected Scale</div>
            <div className="font-mono text-2xl font-extrabold text-[#123B63] tabular-nums">
              {talukaCount} Talukas
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <input
            type="range"
            min={1}
            max={252}
            value={talukaCount}
            onChange={(e) => setTalukaCount(Number(e.target.value))}
            aria-label="Number of Talukas Deployed"
            className="w-full accent-[#123B63] cursor-pointer"
          />
          <div className="flex justify-between text-xs font-mono text-slate-500">
            <span>1 Taluka (Pilot)</span>
            <span>33 Districts (1 each)</span>
            <span>125 Talukas</span>
            <span>252 Talukas (All Gujarat)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="bg-[#F6F8FA] border border-[#D9DEE5] rounded-xl p-4">
            <div className="text-xs text-slate-600">Total Kiosk Hardware Capex</div>
            <div className="font-mono text-2xl font-extrabold text-[#123B63] mt-1 tabular-nums">
              {formatCrOrLakhs(hardwareCapex)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {talukaCount} units × ₹68,000/kiosk
            </div>
          </div>

          <div className="bg-[#F6F8FA] border border-[#D9DEE5] rounded-xl p-4">
            <div className="text-xs text-slate-600">Certificates Processed / Year</div>
            <div className="font-mono text-2xl font-extrabold text-[#123B63] mt-1 tabular-nums">
              {annualCertificates.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              ~100 applications/day/Taluka
            </div>
          </div>

          <div className="bg-[#F6F8FA] border border-[#D9DEE5] rounded-xl p-4">
            <div className="text-xs text-slate-600">Annual Citizen Savings</div>
            <div className="font-mono text-2xl font-extrabold text-[#046A38] mt-1 tabular-nums">
              {formatCrOrLakhs(citizenSavingsInr)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Eliminates touts & repeat travel
            </div>
          </div>

          <div className="bg-[#F6F8FA] border border-[#D9DEE5] rounded-xl p-4">
            <div className="text-xs text-slate-600">Officer Scrutiny Hours Saved</div>
            <div className="font-mono text-2xl font-extrabold text-[#D32828] mt-1 tabular-nums">
              {officerHoursSaved.toLocaleString('en-IN')} hrs
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              14.75 min saved per application
            </div>
          </div>
        </div>
      </div>

      {/* Aligned Government Grant Schemes */}
      <div className="uidai-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <Award className="h-5 w-5 text-[#D32828]" />
          <h2 className="font-display text-lg font-extrabold text-[#123B63]">
            Target Government Grant & Seed Funding Schemes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {GRANT_SCHEMES.map((scheme) => (
            <div
              key={scheme.name}
              className="bg-[#F6F8FA] border border-[#D9DEE5] rounded-xl p-5 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs font-bold text-[#123B63]">
                  <span>{scheme.focus}</span>
                </div>
                <h3 className="font-display text-base font-extrabold text-[#123B63] mt-1">
                  {scheme.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed">
                  {scheme.fitReason}
                </p>
              </div>
              <div className="pt-3 border-t border-[#D9DEE5] flex items-center justify-between text-xs font-mono font-bold text-[#046A38]">
                <span>Scheme Cap</span>
                <span>{scheme.fundingRange}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grant Budget Utilization + 6-Month Pilot Roadmap */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-7 uidai-card rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E3EAF5] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Landmark className="h-4 w-4 text-[#123B63]" />
              <h2 className="font-display text-base font-bold text-[#123B63]">
                Seed Grant Utilization Plan (PoC + 1-Taluka Pilot)
              </h2>
            </div>
            <span className="font-mono text-sm font-extrabold text-[#046A38] tabular-nums">
              Total: ₹{totalGrantBudget.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#123B63] text-white text-xs">
                  <th className="py-3 px-4">Budget Head</th>
                  <th className="py-3 px-4">Scope & Deliverables</th>
                  <th className="py-3 px-4 text-right">Allocation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3EAF5]">
                {BUDGET_ALLOCATION.map((row) => (
                  <tr key={row.head} className="hover:bg-[#F6F8FA]">
                    <td className="py-3 px-4 font-bold text-[#123B63]">
                      {row.head}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{row.details}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#123B63] tabular-nums">
                      ₹{row.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-[#F6F8FA] font-extrabold text-[#123B63]">
                  <td colSpan={2} className="py-3 px-4 text-right">
                    Total Requested PoC Grant
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-base tabular-nums">
                    ₹{totalGrantBudget.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="xl:col-span-5 uidai-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E3EAF5]">
            <CalendarCheck className="h-4 w-4 text-[#123B63]" />
            <h2 className="font-display text-base font-bold text-[#123B63]">
              6-Month Grant Execution Roadmap
            </h2>
          </div>

          <div className="space-y-3">
            {MILESTONES.map((m) => (
              <div
                key={m.phase}
                className="rounded-xl bg-[#F6F8FA] border border-[#D9DEE5] p-3.5"
              >
                <div className="flex items-center justify-between text-xs font-mono font-bold text-[#123B63]">
                  <span>{m.phase}</span>
                  <Layers className="h-3.5 w-3.5" />
                </div>
                <div className="text-sm font-bold text-[#123B63] mt-1">
                  {m.title}
                </div>
                <p className="text-xs text-slate-600 mt-0.5">{m.deliverable}</p>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#E3EAF5] flex items-start gap-2.5 text-xs text-slate-700">
            <ShieldCheck className="h-4 w-4 text-[#046A38] shrink-0 mt-0.5" />
            <span>
              <strong>Privacy & DPDP Compliance:</strong> Aadhaar numbers are masked (`XXXX-XXXX-4829`), OCR runs on local Edge NPU, and zero raw biometric templates are stored.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
