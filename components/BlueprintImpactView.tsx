'use client';

import React, {useState} from 'react';
import {
  Camera,
  Monitor,
  ScanLine,
  Cpu,
  TrendingDown,
  Clock,
  CheckCircle2,
  IndianRupee,
  ShieldCheck,
  Keyboard,
} from 'lucide-react';

interface HardwareZone {
  id: 'facecam' | 'touchscreen' | 'scanplate' | 'compute' | 'keyboard';
  code: string;
  title: string;
  subtitle: string;
  cost: string;
  icon: React.ReactNode;
  specs: string[];
  ruralAdvantage: string;
}

const HARDWARE_ZONES: HardwareZone[] = [
  {
    id: 'facecam',
    code: 'ZONE 01',
    title: 'Top Face-Cam & Directional Mic Array',
    subtitle: '5MP WDR Liveness Camera + Noise-Cancelling Beamforming Mic',
    cost: '₹4,200',
    icon: <Camera className="h-4 w-4" />,
    specs: [
      '5MP Wide Dynamic Range (WDR) camera handles bright Taluka Kacheri doorways',
      'Dual-mic beamforming isolates Gujarati/Hindi speech in 75 dB crowd noise',
      '3W dual front speakers for clear regional voice guidance',
    ],
    ruralAdvantage:
      'Captures citizen live photo and spoken self-declaration automatically without operator intervention.',
  },
  {
    id: 'touchscreen',
    code: 'ZONE 02',
    title: 'Middle 21.5" Anti-Glare Capacitive Touchscreen',
    subtitle: 'Ergonomic 18° Tilted IP54 Display + Thermal Receipt Slot',
    cost: '₹11,000',
    icon: <Monitor className="h-4 w-4" />,
    specs: [
      '21.5" Full HD 500-nit anti-glare toughened glass touch panel',
      'Large icon-first Gujarati, Hindi & English UI designed for first-time users',
      'Integrated 80mm thermal slip printer for instant Application ID receipts',
    ],
    ruralAdvantage:
      'Accessible standing or wheelchair height with zero glare under semi-outdoor veranda lighting.',
  },
  {
    id: 'scanplate',
    code: 'ZONE 03',
    title: 'Bottom LED Overhead Document Scan Plate',
    subtitle: '16MP Overhead Macro Camera + Diffused 5000K Ring Illumination',
    cost: '₹7,500',
    icon: <ScanLine className="h-4 w-4" />,
    specs: [
      '16MP Sony IMX autofocus overhead camera captures A4 documents in 0.8 seconds',
      'Shadow-free 5000K CRI-95 diffused LED bar eliminates glare on laminated cards',
      'Recessed matte black platen tray with tactile A4 alignment corners',
    ],
    ruralAdvantage:
      'Eliminates paper feeder jams on folded, stapled, or laminated Ration Cards and old 7/12 extracts.',
  },
  {
    id: 'compute',
    code: 'ZONE 04',
    title: 'Internal Compute, Biometric & Power Core',
    subtitle: 'Edge Mini-PC + UIDAI STQC Scanner + 1200VA LiFePO4 UPS',
    cost: '₹30,800',
    icon: <Cpu className="h-4 w-4" />,
    specs: [
      '16GB RAM / 512GB NVMe Edge Mini-PC runs bilingual OCR & phonetic check locally',
      'UIDAI STQC L1 certified fingerprint scanner for biometric consent',
      '1200VA UPS + Dual-SIM 4G/BharatNet failover handles rural power cuts cleanly',
    ],
    ruralAdvantage:
      'Runs OCR verification even on intermittent 2G/4G rural connectivity and syncs encrypted packets.',
  },
  {
    id: 'keyboard',
    code: 'ZONE 05',
    title: 'External Rugged Keyboard, Mouse & On-Screen Keys',
    subtitle: 'IP65 Stainless Steel USB Keyboard + Trackball Mouse + Touch Keypad',
    cost: '₹2,800',
    icon: <Keyboard className="h-4 w-4" />,
    specs: [
      'IP65 spill-proof stainless steel USB keyboard tray at comfortable waist height',
      'Integrated sealed optical trackball / rugged USB mouse for cursor control',
      'Dual-mode fallback: in-built Gujarati & English On-Screen Touch Keyboard inside UI',
    ],
    ruralAdvantage:
      'Lets citizens or kiosk helpers type/edit names externally via physical keyboard & mouse OR directly on screen.',
  },
];

const BOM_ITEMS = [
  {
    item: 'Powder-Coated 16-Gauge Steel Enclosure & Tamper Locks',
    spec: 'IP54 Taluka Veranda Grade · 18° Ergonomic Console',
    qty: 1,
    cost: 11700,
  },
  {
    item: 'Rugged USB Stainless Steel Keyboard & Optical Trackball Mouse',
    spec: 'Vandal-Proof Tray + Spill-Proof Mechanical Keys',
    qty: 1,
    cost: 2800,
  },
  {
    item: 'Edge Compute Mini-PC (Local OCR & Phonetic AI)',
    spec: '6-Core CPU · 16GB DDR4 · 512GB NVMe SSD',
    qty: 1,
    cost: 18500,
  },
  {
    item: '21.5" FHD Anti-Glare Capacitive Touch Monitor',
    spec: '500-Nit Brightness · Toughened 4mm Cover Glass',
    qty: 1,
    cost: 11000,
  },
  {
    item: '16MP Overhead Document Camera + 5000K LED Platen',
    spec: 'Auto-Focus Macro Lens · Matte Alignment Tray',
    qty: 1,
    cost: 7500,
  },
  {
    item: 'Top 5MP WDR Face-Cam + Beamforming Mic + Speakers',
    spec: 'Wide Dynamic Range · Crowd Noise Cancellation',
    qty: 1,
    cost: 4200,
  },
  {
    item: 'UIDAI STQC L1 Fingerprint Scanner + 80mm Thermal Printer',
    spec: 'RD Service Compliant · Auto-Cutter Receipt Unit',
    qty: 1,
    cost: 5800,
  },
  {
    item: '1200VA UPS Backup + Dual-SIM 4G / BharatNet Router',
    spec: '4-Hour Outage Buffer · Surge Protection',
    qty: 1,
    cost: 6500,
  },
];

export default function BlueprintImpactView() {
  const [activeZoneId, setActiveZoneId] =
    useState<HardwareZone['id']>('scanplate');

  const activeZone =
    HARDWARE_ZONES.find((z) => z.id === activeZoneId) || HARDWARE_ZONES[2];

  const totalBom = BOM_ITEMS.reduce((sum, row) => sum + row.cost, 0);

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* UIDAI Royal-to-Cyan Blueprint Hero */}
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
              <span>Grant Jury Technical Dossier</span>
              <span aria-hidden="true">·</span>
              <span className="text-white">Make-in-India Rural E-Governance Hardware</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1.5 tracking-tight">
              Hardware Architecture & GovTech Impact Blueprint
            </h1>
            <p className="text-sm text-sky-100 mt-1">
              Engineered for rugged Taluka Kacheri deployment at a ₹68,000 prototype bill of materials.
            </p>
          </div>

          <div className="flex items-center gap-6 px-5 py-3 bg-white/12 border border-white/20 rounded-xl shrink-0 backdrop-blur-xs">
            <div>
              <div className="text-xs text-sky-100">Prototype BOM Cost</div>
              <div className="font-mono text-2xl font-extrabold text-white tabular-nums">
                ₹{totalBom.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="h-9 w-px bg-white/25" />
            <div>
              <div className="text-xs text-sky-100">Target Rejection Rate</div>
              <div className="font-mono text-2xl font-extrabold text-emerald-300 tabular-nums">
                0%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Impact Metrics Row (For Grant Jury) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="uidai-card rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#046A38]" />
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Form Rejection Rate</span>
            <TrendingDown className="h-4 w-4 text-[#046A38]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="font-mono text-lg text-slate-400 line-through tabular-nums">
              62%
            </span>
            <span className="text-slate-400">→</span>
            <span className="font-mono text-3xl font-extrabold text-[#046A38] tabular-nums">
              0%
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-600">
            Eliminated via 6-document laser OCR & Gujarati/English phonetic cross-check before submission.
          </p>
        </div>

        <div className="uidai-card rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#D32828]" />
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Certificate Processing Time</span>
            <Clock className="h-4 w-4 text-[#D32828]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="font-mono text-lg text-slate-400 line-through tabular-nums">
              15 days
            </span>
            <span className="text-slate-400">→</span>
            <span className="font-mono text-3xl font-extrabold text-[#123B63] tabular-nums">
              10 min
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-600">
            Pre-verified citizen packets enable instant 1-click Mamlatdar DSC approval.
          </p>
        </div>

        <div className="uidai-card rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#F0A900]" />
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Citizen Middleman & Travel Cost</span>
            <IndianRupee className="h-4 w-4 text-[#F0A900]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="font-mono text-lg text-slate-400 line-through tabular-nums">
              ₹1,200
            </span>
            <span className="text-slate-400">→</span>
            <span className="font-mono text-3xl font-extrabold text-[#123B63] tabular-nums">
              ₹0
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-600">
            Self-service voice kiosk removes tout dependency and repeated 30 km taluka trips.
          </p>
        </div>

        <div className="uidai-card rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#123B63]" />
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Mamlatdar Scrutiny Speed</span>
            <ShieldCheck className="h-4 w-4 text-[#046A38]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="font-mono text-lg text-slate-400 line-through tabular-nums">
              15 min
            </span>
            <span className="text-slate-400">→</span>
            <span className="font-mono text-3xl font-extrabold text-[#046A38] tabular-nums">
              15 sec
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-600">
            Side-by-side 6-doc OCR verification matrix surfaces 0-conflict proof immediately.
          </p>
        </div>
      </div>

      {/* Interactive Kiosk Hardware Diagram + Subsystem Inspector */}
      <div className="uidai-card rounded-2xl p-5 sm:p-6">
        <div className="pb-4 border-b border-[#E3EAF5] flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-lg font-bold text-[#123B63]">
              Interactive Physical Kiosk Hardware Schematic
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Click any hardware zone on the kiosk diagram or selector tabs to inspect engineering specifications.
            </p>
          </div>
          <span className="font-mono text-xs font-bold text-[#123B63]">
            Dimensions: 168cm H × 58cm W × 52cm D
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Interactive SVG Kiosk Blueprint */}
          <div className="lg:col-span-6 bg-[#F6F8FA] border border-[#D9DEE5] rounded-2xl p-4 sm:p-6 flex items-center justify-center">
            <svg
              viewBox="0 0 460 520"
              className="w-full max-w-[420px] h-auto"
              role="img"
              aria-label="Interactive SevaAI Taluka Kiosk Hardware Diagram"
            >
              <defs>
                <pattern
                  id="blueprintGrid"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 20 0 L 0 0 0 20"
                    fill="none"
                    stroke="#D9DEE5"
                    strokeWidth="0.8"
                  />
                </pattern>
              </defs>
              <rect width="460" height="520" rx="12" fill="url(#blueprintGrid)" />

              {/* Kiosk Floor Shadow */}
              <ellipse cx="195" cy="488" rx="108" ry="12" fill="#CBD8EB" />

              {/* Kiosk Main Steel Pedestal Base */}
              <rect x="110" y="454" width="170" height="28" rx="4" fill="#123B63" />
              {/* Main Chassis Body */}
              <rect
                x="122"
                y="56"
                width="146"
                height="398"
                rx="12"
                fill="#FFFFFF"
                stroke="#123B63"
                strokeWidth="3"
              />

              {/* Digital India Header Band */}
              <rect x="130" y="64" width="130" height="6" rx="3" fill="#F0A900" />

              {/* ZONE 1: Top Face-Cam & Mic Array */}
              <g
                onClick={() => setActiveZoneId('facecam')}
                className="cursor-pointer"
              >
                <rect
                  x="138"
                  y="78"
                  width="114"
                  height="38"
                  rx="8"
                  fill={activeZoneId === 'facecam' ? '#D32828' : '#F6F8FA'}
                  stroke={activeZoneId === 'facecam' ? '#123B63' : '#94A3B8'}
                  strokeWidth="2"
                />
                <circle
                  cx="195"
                  cy="97"
                  r="9"
                  fill="#123B63"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
                <circle cx="195" cy="97" r="3.5" fill="#38BDF8" />
                <circle cx="158" cy="97" r="3" fill="#F0A900" />
                <circle cx="232" cy="97" r="3" fill="#F0A900" />
              </g>

              {/* ZONE 2: Middle 21.5" Touchscreen */}
              <g
                onClick={() => setActiveZoneId('touchscreen')}
                className="cursor-pointer"
              >
                <rect
                  x="134"
                  y="128"
                  width="122"
                  height="112"
                  rx="8"
                  fill={activeZoneId === 'touchscreen' ? '#123B63' : '#1E293B'}
                  stroke={activeZoneId === 'touchscreen' ? '#D32828' : '#123B63'}
                  strokeWidth="3"
                />
                <rect x="142" y="136" width="106" height="96" rx="4" fill="#FFFFFF" />
                <rect x="148" y="142" width="94" height="14" rx="2" fill="#123B63" />
                <circle cx="172" cy="178" r="14" fill="#F6F8FA" stroke="#123B63" strokeWidth="2" />
                <rect x="194" y="168" width="42" height="6" rx="2" fill="#123B63" />
                <rect x="194" y="178" width="34" height="5" rx="2" fill="#94A3B8" />
                <rect x="148" y="204" width="94" height="18" rx="4" fill="#F0A900" />
              </g>

              {/* ZONE 3: Bottom LED Overhead Document Scan Plate */}
              <g
                onClick={() => setActiveZoneId('scanplate')}
                className="cursor-pointer"
              >
                <path
                  d="M122 260 H74 C66 260 62 264 62 272 V290"
                  fill="none"
                  stroke="#123B63"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <rect
                  x="48"
                  y="282"
                  width="42"
                  height="16"
                  rx="4"
                  fill={activeZoneId === 'scanplate' ? '#D32828' : '#123B63'}
                />
                <circle cx="69" cy="298" r="4" fill="#38BDF8" />

                <polygon
                  points="69,302 36,348 118,348"
                  fill={
                    activeZoneId === 'scanplate'
                      ? 'rgba(0, 143, 213, 0.25)'
                      : 'rgba(0, 143, 213, 0.10)'
                  }
                />

                <rect
                  x="26"
                  y="346"
                  width="110"
                  height="16"
                  rx="4"
                  fill={activeZoneId === 'scanplate' ? '#D32828' : '#123B63'}
                />
                <rect
                  x="40"
                  y="340"
                  width="68"
                  height="6"
                  rx="1"
                  fill="#FFFFFF"
                  stroke="#046A38"
                  strokeWidth="1.5"
                />
              </g>

              {/* ZONE 4: Internal Compute, STQC Fingerprint & UPS Core */}
              <g
                onClick={() => setActiveZoneId('compute')}
                className="cursor-pointer"
              >
                <rect
                  x="136"
                  y="256"
                  width="118"
                  height="38"
                  rx="6"
                  fill={activeZoneId === 'compute' ? '#D32828' : '#F6F8FA'}
                  stroke="#94A3B8"
                  strokeWidth="1.5"
                />
                <rect x="148" y="266" width="38" height="18" rx="3" fill="#123B63" />
                <rect x="200" y="268" width="42" height="14" rx="2" fill="#046A38" />

                <rect
                  x="136"
                  y="306"
                  width="118"
                  height="132"
                  rx="8"
                  fill={activeZoneId === 'compute' ? '#E0F2FE' : '#F6F8FA'}
                  stroke={activeZoneId === 'compute' ? '#D32828' : '#CBD8EB'}
                  strokeWidth="2"
                />
                <rect x="150" y="324" width="90" height="28" rx="4" fill="#123B63" />
                <rect x="150" y="362" width="90" height="32" rx="4" fill="#123B63" />
                <rect x="150" y="404" width="90" height="22" rx="4" fill="#046A38" />
              </g>

              {/* ZONE 5: External Rugged Keyboard & Optical Mouse Shelf */}
              <g
                onClick={() => setActiveZoneId('keyboard')}
                className="cursor-pointer"
              >
                <rect
                  x="130"
                  y="246"
                  width="134"
                  height="16"
                  rx="4"
                  fill={activeZoneId === 'keyboard' ? '#D32828' : '#123B63'}
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
                <rect x="140" y="250" width="84" height="7" rx="1.5" fill="#E2E8F0" />
                <circle cx="242" cy="253.5" r="4" fill="#F0A900" />
              </g>

              {/* Interactive Callout Lines & Labels on Right */}
              {[
                {id: 'facecam' as const, y: 97, label: '01. Top Face-Cam + Mic'},
                {id: 'touchscreen' as const, y: 178, label: '02. 21.5" Touch Display'},
                {id: 'keyboard' as const, y: 254, label: '05. Keyboard + Mouse Tray'},
                {id: 'scanplate' as const, y: 324, label: '03. Bottom LED Scan Plate'},
                {id: 'compute' as const, y: 392, label: '04. Edge AI + UPS Core'},
              ].map((callout) => {
                const isActive = activeZoneId === callout.id;
                const xStart = callout.id === 'scanplate' ? 118 : 268;
                return (
                  <g
                    key={callout.id}
                    onClick={() => setActiveZoneId(callout.id)}
                    className="cursor-pointer"
                  >
                    <line
                      x1={xStart}
                      y1={callout.y}
                      x2={292}
                      y2={callout.y}
                      stroke={isActive ? '#123B63' : '#94A3B8'}
                      strokeWidth={isActive ? '2.5' : '1.5'}
                      strokeDasharray={isActive ? undefined : '4 3'}
                    />
                    <rect
                      x="292"
                      y={callout.y - 16}
                      width="156"
                      height="32"
                      rx="6"
                      fill={isActive ? '#123B63' : '#FFFFFF'}
                      stroke={isActive ? '#123B63' : '#CBD8EB'}
                      strokeWidth="1.5"
                    />
                    <text
                      x="300"
                      y={callout.y + 4}
                      fontSize="10.5"
                      fontWeight="700"
                      fill={isActive ? '#FFFFFF' : '#123B63'}
                    >
                      {callout.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Right: Active Hardware Zone Inspector */}
          <div className="lg:col-span-6 space-y-4">
            <div className="grid grid-cols-2 gap-2.5">
              {HARDWARE_ZONES.map((zone) => {
                const selected = zone.id === activeZoneId;
                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => setActiveZoneId(zone.id)}
                    className={`flex items-center gap-2.5 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selected
                        ? 'bg-gradient-to-r from-[#123B63] to-[#123B63] text-white border-[#123B63] shadow-xs'
                        : 'bg-[#F6F8FA] text-[#123B63] border-[#D9DEE5] hover:bg-[#E7F0FB]'
                    }`}
                  >
                    <span className="shrink-0">{zone.icon}</span>
                    <div className="min-w-0">
                      <div
                        className={`text-[11px] font-mono ${
                          selected ? 'text-sky-200' : 'text-slate-500'
                        }`}
                      >
                        {zone.code} · {zone.cost}
                      </div>
                      <div className="text-xs font-bold truncate">
                        {zone.title}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="bg-[#F6F8FA] border border-[#D9DEE5] rounded-2xl p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="font-mono text-xs font-bold text-[#123B63]">
                    {activeZone.code}
                  </span>
                  <h3 className="font-display text-lg font-extrabold text-[#123B63] mt-0.5">
                    {activeZone.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {activeZone.subtitle}
                  </p>
                </div>
                <div className="font-mono text-base font-extrabold text-[#123B63] tabular-nums shrink-0">
                  {activeZone.cost}
                </div>
              </div>

              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {activeZone.specs.map((spec) => (
                  <li key={spec} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#046A38] shrink-0 mt-0.5" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-3 border-t border-[#D9DEE5]">
                <div className="text-xs font-bold text-[#123B63]">
                  Rural Kacheri Field Advantage
                </div>
                <p className="text-xs sm:text-sm text-slate-700 mt-1">
                  {activeZone.ruralAdvantage}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ₹68,000 Prototype BOM Breakdown Table */}
      <div className="uidai-card rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E3EAF5] flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-lg font-bold text-[#123B63]">
              ₹68,000 Prototype Bill of Materials (BOM)
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Component-level Indian procurement costing for 1 complete Taluka Kacheri SevaAI Kiosk unit.
            </p>
          </div>
          <span className="font-mono text-sm font-extrabold text-[#046A38] tabular-nums">
            Total Unit Cost: ₹{totalBom.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#123B63] text-white text-xs font-semibold">
                <th className="py-3 px-5">#</th>
                <th className="py-3 px-5">Hardware Subsystem</th>
                <th className="py-3 px-5">Technical Specification</th>
                <th className="py-3 px-5 text-right">Qty</th>
                <th className="py-3 px-5 text-right">Unit Cost (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3EAF5]">
              {BOM_ITEMS.map((row, idx) => (
                <tr key={row.item} className="hover:bg-[#F6F8FA]">
                  <td className="py-3 px-5 font-mono text-slate-500 tabular-nums">
                    0{idx + 1}
                  </td>
                  <td className="py-3 px-5 font-bold text-[#123B63]">
                    {row.item}
                  </td>
                  <td className="py-3 px-5 text-slate-600">{row.spec}</td>
                  <td className="py-3 px-5 text-right font-mono tabular-nums">
                    {row.qty}
                  </td>
                  <td className="py-3 px-5 text-right font-mono font-bold text-[#123B63] tabular-nums">
                    ₹{row.cost.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-[#F6F8FA] border-t-2 border-[#123B63]/20 font-extrabold text-[#123B63]">
                <td colSpan={4} className="py-3.5 px-5 text-right">
                  Total Complete Kiosk Prototype Cost
                </td>
                <td className="py-3.5 px-5 text-right font-mono text-base text-[#123B63] tabular-nums">
                  ₹{totalBom.toLocaleString('en-IN')}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </section>
  );
}
