'use client';

import React, {useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {SevaProvider, useSeva} from '@/lib/seva-store';
import AppOpeningSplash from './AppOpeningSplash';
import TopNavbar from './TopNavbar';
import HomeHubView from './HomeHubView';
import CitizenKioskView from './CitizenKioskView';
import MamlatdarDashboardView from './MamlatdarDashboardView';
import BlueprintImpactView from './BlueprintImpactView';
import GrantPitchView from './GrantPitchView';

function MainViewport() {
  const {activeView} = useSeva();
  const [showSplash, setShowSplash] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FA] text-[#202124]">
      <AnimatePresence>
        {showSplash && (
          <AppOpeningSplash onFinish={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      <TopNavbar />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{opacity: 0, y: 4}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -4}}
            transition={{duration: 0.13, ease: 'easeOut'}}
          >
            {activeView === 'home' && <HomeHubView />}
            {activeView === 'kiosk' && <CitizenKioskView />}
            {activeView === 'mamlatdar' && <MamlatdarDashboardView />}
            {activeView === 'blueprint' && <BlueprintImpactView />}
            {activeView === 'grant' && <GrantPitchView />}
          </motion.div>
        </AnimatePresence>
      </main>

      {activeView !== 'kiosk' && (
        <footer className="no-print border-t border-[#D9DEE5] bg-white py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-[#5F6368]">
            <span>
              SevaAI — Smart Taluka Kacheri E-Governance Kiosk & Officer Portal
            </span>
            <span>
              UIDAI & Digital India Compliant Prototype · LocalStorage Real-Time Sync
            </span>
          </div>
        </footer>
      )}
    </div>
  );
}

export default function SevaAppShell() {
  return (
    <SevaProvider>
      <MainViewport />
    </SevaProvider>
  );
}
