'use client';

import React from 'react';
import {
  Home,
  MonitorSmartphone,
  ShieldCheck,
  Cpu,
  Globe,
  Award,
} from 'lucide-react';
import {useSeva} from '@/lib/seva-store';
import {cancelBuiltInSpeech, primeBuiltInSpeech} from '@/lib/built-in-speech';
import {LanguageCode, ViewMode} from '@/lib/types';

export default function TopNavbar() {
  const {language, setLanguage, activeView, setActiveView, applications} = useSeva();

  const pendingCount = applications.filter(
    (app) => app.status === 'Pending Mamlatdar DSC'
  ).length;

  const languages: {code: LanguageCode; label: string}[] = [
    {code: 'gu', label: 'ગુજરાતી'},
    {code: 'hi', label: 'हिन्दी'},
    {code: 'en', label: 'English'},
  ];

  const views: {
    id: ViewMode;
    label: string;
    shortLabel: string;
    icon: React.ReactNode;
    badge?: number;
  }[] = [
    {
      id: 'home',
      label: language === 'gu' ? 'હોમ' : language === 'hi' ? 'होम' : 'Home',
      shortLabel: 'Home',
      icon: <Home className="h-4 w-4 shrink-0" />,
    },
    {
      id: 'kiosk',
      label: '1. Citizen Kiosk',
      shortLabel: '1. Kiosk',
      icon: <MonitorSmartphone className="h-4 w-4 shrink-0" />,
    },
    {
      id: 'mamlatdar',
      label: '2. Mamlatdar Portal',
      shortLabel: '2. Officer',
      icon: <ShieldCheck className="h-4 w-4 shrink-0" />,
      badge: pendingCount,
    },
    {
      id: 'blueprint',
      label: '3. Hardware & BOM',
      shortLabel: '3. Hardware',
      icon: <Cpu className="h-4 w-4 shrink-0" />,
    },
    {
      id: 'grant',
      label: '4. Grant Pitch',
      shortLabel: '4. Grant',
      icon: <Award className="h-4 w-4 shrink-0" />,
    },
  ];

  return (
    <header className="no-print sticky top-0 z-40 bg-white shadow-[0_2px_10px_rgba(18,59,99,0.06)]">
      {/* Official Navy #123B63 Government Utility Bar */}
      <div className="bg-[#123B63] text-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="font-semibold text-white truncate">
              ભારત સરકાર · भारत सरकार · Government of India
            </span>
            <span className="hidden md:inline text-white/40" aria-hidden="true">
              |
            </span>
            <span className="hidden md:inline text-white/85 truncate">
              Digital India · Taluka Kacheri Self-Service Network
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Globe className="h-3.5 w-3.5 text-[#FAB401] hidden sm:block shrink-0" />
            <div
              role="group"
              aria-label="Language Switcher"
              className="flex items-center gap-1"
            >
              {languages.map((lang) => {
                const active = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setLanguage(lang.code)}
                    className={`px-2.5 py-1 text-xs font-bold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-[#FAB401] text-[#202124]'
                        : 'text-white/85 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {lang.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main White Portal Header (Inspired by myAadhaar Beta UI) */}
      <div className="bg-white border-b border-[#D9DEE5]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-4 py-3">
            {/* Brand Lockup: Original SevaAI Sunburst Emblem (Not UIDAI Official Logo) */}
            <button
              type="button"
              onClick={() => {
                cancelBuiltInSpeech();
                setActiveView('home');
              }}
              className="flex items-center gap-3.5 shrink-0 text-left cursor-pointer"
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FAF6EE] border border-[#ECE3D0] shadow-2xs shrink-0"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 44 44"
                  className="h-8 w-8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 24C12 16 18 12 22 12C26 12 32 16 35 24"
                    stroke="#D32828"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M13 28C15.5 21 19 18 22 18C25 18 28.5 21 31 28"
                    stroke="#F0A900"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                  <circle cx="22" cy="12" r="2.8" fill="#D32828" />
                  <path
                    d="M11 33H33"
                    stroke="#123B63"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="font-display text-base sm:text-lg font-extrabold tracking-tight text-[#202124] whitespace-nowrap">
                  SevaAI — Smart Taluka Kiosk
                </div>
                <p className="text-xs font-medium text-[#5F6368] whitespace-nowrap">
                  મારી ઓળખ · સ્માર્ટ તાલુકા કચેરી ઈ-સેવા કેન્દ્ર
                </p>
              </div>
            </button>

            {/* Clean Navigation Strip */}
            <nav
              aria-label="Portal Navigation"
              className="w-full lg:w-auto flex items-center gap-1.5 p-1 bg-[#F6F8FA] border border-[#D9DEE5] rounded-xl overflow-x-auto"
            >
              {views.map((view) => {
                const isActive = activeView === view.id;
                return (
                  <button
                    key={view.id}
                    type="button"
                    onClick={() => {
                      if (view.id === 'kiosk') {
                        primeBuiltInSpeech(language);
                      } else {
                        cancelBuiltInSpeech();
                      }
                      setActiveView(view.id);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[#123B63] text-white shadow-xs'
                        : 'text-[#202124] hover:bg-white'
                    }`}
                  >
                    {view.icon}
                    <span className="hidden md:inline">{view.label}</span>
                    <span className="md:hidden">{view.shortLabel}</span>
                    {typeof view.badge === 'number' && view.badge > 0 && (
                      <span
                        className={`ml-0.5 font-mono text-xs font-extrabold tabular-nums ${
                          isActive ? 'text-[#FAB401]' : 'text-[#D32828]'
                        }`}
                      >
                        ({view.badge})
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Subtle Decorative Tricolor Bottom Line (Only once at top header) */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#F0A900] via-[#FFFFFF] to-[#046A38]" />
    </header>
  );
}
