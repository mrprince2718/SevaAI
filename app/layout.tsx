import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SevaAI — Smart Taluka Kiosk & Mamlatdar Portal',
  description:
    'Voice-guided Taluka Kacheri E-Governance Kiosk with 6-document laser OCR verification and 1-click Mamlatdar DSC approval.',
  openGraph: {
    title: 'SevaAI — Smart Taluka Kiosk & Mamlatdar Portal',
    description:
      'Voice-guided Taluka Kacheri E-Governance Kiosk with 6-document laser OCR verification and 1-click Mamlatdar DSC approval.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SevaAI — Smart Taluka Kiosk & Mamlatdar Portal',
    description:
      'Voice-guided Taluka Kacheri E-Governance Kiosk with 6-document laser OCR verification and 1-click Mamlatdar DSC approval.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body
        className="bg-[#F5F8FC] text-[#0F172A] antialiased selection:bg-[#0066B3]/15 selection:text-[#0B3B60]"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
