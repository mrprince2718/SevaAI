# SevaAI — Smart Taluka Kacheri E-Governance Kiosk & Mamlatdar Portal

Voice-assisted, citizen-friendly Taluka Kacheri self-service kiosk paired with a live Mamlatdar Digital Signature Certificate (DSC) Officer Portal. Built for **Caste**, **Income**, and **Domicile** certificate workflows across **Gujarati**, **Hindi**, and **English**.

## Key Features
- **3D Interactive Robot Sahayak (`SevaRobot3D`)**: Zero-cost built-in browser speech guidance with subtitles and instant FAQ doubt answers.
- **Bilingual Auto-Transliteration (`lib/transliterate.ts`)**: Speaking or typing in Gujarati/Hindi (e.g., `રમેશભાઈ કનુભાઈ પટેલ`) automatically populates clean English (`Rameshbhai Kanubhai Patel`) and regional script fields in real time—preventing spelling mismatch rejections.
- **On-Screen Tri-Lingual Keyboard (`OnScreenKeyboard`)**: Supports English, Gujarati, and Hindi touch layouts alongside Web Speech voice input.
- **6-Document Laser Scan & Photo Stage**: Simulated overhead platen OCR verification and live self-declaration stage.
- **Live Mamlatdar Officer Portal (`MamlatdarDashboardView`)**: Instant cross-tab sync (`localStorage` + `BroadcastChannel`), 1-click DSC approval, and printable Official Certificate preview.

## Tech Stack
- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling & Animation**: Tailwind CSS v4, Motion, Three.js, Lucide Icons
- **Zero-Paid-API Architecture**: Runs 100% in-browser with no required API keys or database setup for public jury evaluation.

## Run Locally
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in Chrome or Microsoft Edge for full microphone and built-in voice support.

## Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: SevaAI Smart Taluka Kiosk ready for Netlify"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git
git push -u origin main
```

## Deploy to Netlify
1. Log in to [Netlify](https://app.netlify.com/) and click **Add new site → Import an existing project**.
2. Choose **GitHub** and select your repository.
3. Netlify automatically detects `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: `20`
4. No environment variables are required. Click **Deploy site** and share the generated `https://<your-site>.netlify.app` URL with the jury.
