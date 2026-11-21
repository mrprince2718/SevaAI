'use client';

import React, {useEffect, useRef, useState} from 'react';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {Volume2, VolumeX, RotateCcw, Sparkles} from 'lucide-react';
import {LanguageCode} from '@/lib/types';

interface SevaRobot3DProps {
  isSpeaking: boolean;
  isListening?: boolean;
  isMuted?: boolean;
  onToggleMute?: () => void;
  onReplay?: () => void;
  voiceStatusHint?: string;
  subtitlePrimary: string;
  subtitleSecondary?: string;
  language: LanguageCode;
  compact?: boolean;
  className?: string;
}

function RobotFallback3D({
  isSpeaking,
  isListening,
  compact,
}: {
  isSpeaking: boolean;
  isListening: boolean;
  compact?: boolean;
}) {
  const ledColor = isListening ? '#10B981' : '#18C8FF';
  return (
    <div
      className={`w-full flex items-center justify-center ${
        compact ? 'h-48 sm:h-56' : 'h-64 sm:h-72'
      }`}
    >
      <svg
        viewBox="0 0 240 250"
        className="h-full w-auto drop-shadow-[0_18px_24px_rgba(18,59,99,0.18)]"
        fill="none"
      >
        <defs>
          <radialGradient id="chibiShell3d" cx="38%" cy="28%" r="72%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#ECEFF4" />
            <stop offset="100%" stopColor="#C8D0DC" />
          </radialGradient>
          <linearGradient id="chibiVisor3d" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0E1547" />
            <stop offset="100%" stopColor="#070B2B" />
          </linearGradient>
        </defs>

        <ellipse cx="120" cy="232" rx="44" ry="8" fill="#123B63" fillOpacity="0.14" />

        {/* Tapered Chibi Body */}
        <path
          d="M78 134 C78 124 162 124 162 134 C162 184 142 222 120 222 C98 222 78 184 78 134 Z"
          fill="url(#chibiShell3d)"
        />
        {/* Deep Blue Bottom Cap */}
        <path
          d="M100 206 C106 216 113 222 120 222 C127 222 134 216 140 206 Z"
          fill="#1B3C73"
        />
        {/* Chest Horizontal Seam */}
        <path d="M81 154 Q120 158 159 154" stroke="#64748B" strokeWidth="1.5" />

        {/* Wing-like Floating Arms */}
        <path
          d="M76 138 C60 144 48 166 52 174 C56 180 70 166 78 152 Z"
          fill="url(#chibiShell3d)"
        />
        <path
          d="M164 138 C180 144 192 166 188 174 C184 180 170 166 162 152 Z"
          fill="url(#chibiShell3d)"
        />

        {/* Rounded-Triangle Chest Core */}
        <path
          d="M98 158 C98 153 142 153 142 158 C145 166 130 194 120 194 C110 194 95 166 98 158 Z"
          fill="#E2E8F0"
          stroke="#94A3B8"
          strokeWidth="1.5"
        />
        <path
          d="M104 161 C104 158 136 158 136 161 C138 167 126 188 120 188 C114 188 102 167 104 161 Z"
          fill={ledColor}
          stroke="#1E293B"
          strokeWidth="2"
        />
        <circle cx="120" cy="171" r="6" fill="#38BDF8" stroke="#1E293B" strokeWidth="2.5" />

        {/* Blue Side Fin */}
        <path d="M46 74 L38 46 Q46 50 52 66 Z" fill="#1D6FA5" />

        {/* Left & Right Ear Pods */}
        <ellipse cx="48" cy="84" rx="13" ry="18" fill="url(#chibiShell3d)" stroke="#CBD5E1" />
        <ellipse cx="47" cy="84" rx="7" ry="11" fill={ledColor} stroke="#0F172A" strokeWidth="2" />
        <ellipse cx="192" cy="84" rx="13" ry="18" fill="url(#chibiShell3d)" stroke="#CBD5E1" />

        {/* Oversized Chibi Head */}
        <rect x="48" y="24" width="144" height="106" rx="53" fill="url(#chibiShell3d)" />
        {/* Inner White Rim & Deep Indigo Visor */}
        <rect
          x="65"
          y="42"
          width="110"
          height="74"
          rx="36"
          fill="url(#chibiVisor3d)"
          stroke="#E2E8F0"
          strokeWidth="2.5"
        />
        {/* Happy LED Arc Eyes (^ ^) */}
        <path
          d="M84 78 C86 64 106 64 108 78"
          stroke={ledColor}
          strokeWidth="6.5"
          strokeLinecap="round"
        />
        <path
          d="M132 78 C134 64 154 64 156 78"
          stroke={ledColor}
          strokeWidth="6.5"
          strokeLinecap="round"
        />
        {/* Subtle Speaking Bar when active */}
        {isSpeaking && (
          <rect x="103" y="96" width="34" height="6" rx="3" fill={ledColor} />
        )}
      </svg>
    </div>
  );
}

/**
 * Draws crisp glowing cyan LED dot-matrix happy arc eyes (∩ ∩)
 * plus optional animated equalizer smile when speaking/listening onto a 2D canvas.
 */
function drawVisorFace(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  isSpeaking: boolean,
  isListening: boolean,
  blinkFactor: number
) {
  ctx.clearRect(0, 0, w, h);

  // Deep glossy indigo screen background
  const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.35, 20, w * 0.5, h * 0.5, w * 0.65);
  bgGrad.addColorStop(0, '#111A52');
  bgGrad.addColorStop(1, '#060A26');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Subtle top glass reflection sweep
  ctx.fillStyle = 'rgba(255, 255, 255, 0.045)';
  ctx.beginPath();
  ctx.ellipse(w * 0.42, h * 0.16, w * 0.38, h * 0.16, -0.18, 0, Math.PI * 2);
  ctx.fill();

  const primaryHex = isListening ? '#10E89E' : '#1FD6FF';
  const glowColor = isListening ? 'rgba(16, 232, 158, 0.72)' : 'rgba(31, 214, 255, 0.78)';

  // Draw LED pixel grid arcs for Left and Right Happy Eyes (just like the 3D reference image)
  const drawArcEye = (cx: number, cy: number) => {
    const outerR = 54;
    const innerR = 30;
    const step = 7;

    ctx.save();
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 12;

    for (let py = cy - outerR; py <= cy + 10; py += step) {
      for (let px = cx - outerR; px <= cx + outerR; px += step) {
        const dx = px - cx;
        const dy = (py - cy) / Math.max(0.12, blinkFactor);
        const dist = Math.hypot(dx, dy);

        // Upper semicircular arc band
        if (dy <= 6 && dist >= innerR && dist <= outerR) {
          // Soft round endcaps on arc tips
          const fadeEdge =
            1 - Math.abs(dist - (innerR + outerR) / 2) / ((outerR - innerR) / 2);
          ctx.fillStyle = fadeEdge > 0.45 ? '#9BF1FF' : primaryHex;
          ctx.beginPath();
          ctx.roundRect(px - 2.3, py - 2.3, 4.6, 4.6, 1.2);
          ctx.fill();
        }
      }
    }
    ctx.restore();
  };

  // Slight horizontal glance life
  const lookShiftX = Math.sin(t * 0.85) * 6;
  const eyeY = h * 0.48;
  drawArcEye(w * 0.31 + lookShiftX, eyeY);
  drawArcEye(w * 0.69 + lookShiftX, eyeY);

  // Cute LED pixel mouth equalizer when speaking or listening
  if (isSpeaking || isListening) {
    ctx.save();
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 10;
    const barCount = 9;
    const barSpacing = 14;
    const startX = w * 0.5 - ((barCount - 1) * barSpacing) / 2;
    const mouthY = h * 0.76;

    for (let i = 0; i < barCount; i++) {
      const wave = isSpeaking
        ? 0.45 + Math.abs(Math.sin(t * 14 + i * 0.9)) * 1.15
        : 0.35 + Math.abs(Math.sin(t * 5.5 + i * 0.7)) * 0.55;
      const dotsHigh = Math.max(1, Math.round(wave * 3));
      for (let d = -dotsHigh; d <= dotsHigh; d++) {
        ctx.fillStyle = d === 0 ? '#A5F3FC' : primaryHex;
        ctx.beginPath();
        ctx.roundRect(startX + i * barSpacing - 2.5, mouthY + d * 6 - 2.5, 5, 5, 1.2);
        ctx.fill();
      }
    }
    ctx.restore();
  }
}

export default function SevaRobot3D({
  isSpeaking,
  isListening = false,
  isMuted = false,
  onToggleMute,
  onReplay,
  voiceStatusHint,
  subtitlePrimary,
  subtitleSecondary,
  language,
  compact = false,
  className = '',
}: SevaRobot3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  const stateRef = useRef({
    isSpeaking,
    isListening,
  });

  useEffect(() => {
    stateRef.current = {isSpeaking, isListening};
  }, [isSpeaking, isListening]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let pmrem: THREE.PMREMGenerator | null = null;
    let envTarget: THREE.WebGLRenderTarget | null = null;
    let faceTexture: THREE.CanvasTexture | null = null;
    let animId = 0;
    let disposed = false;

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];

    const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
      geometries.push(g);
      return g;
    };
    const trackMat = <T extends THREE.Material>(m: T): T => {
      materials.push(m);
      return m;
    };

    try {
      const width = Math.max(container.clientWidth || 320, 220);
      const height = Math.max(container.clientHeight || 280, 200);

      const probeCanvas = document.createElement('canvas');
      const probeGl =
        probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
      if (!probeGl) {
        window.setTimeout(() => setWebglUnavailable(true), 0);
        return;
      }

      const glProbeExt = probeGl.getExtension('WEBGL_debug_renderer_info');
      const rendererName = String(
        probeGl.getParameter(
          glProbeExt ? glProbeExt.UNMASKED_RENDERER_WEBGL : probeGl.RENDERER
        ) || ''
      );
      probeGl.getExtension('WEBGL_lose_context')?.loseContext();
      const isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(
        rendererName
      );

      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setPixelRatio(
        isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2)
      );
      renderer.setSize(width, height);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      renderer.shadowMap.enabled = !isSoftwareGl;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      const dom = renderer.domElement;
      dom.style.width = '100%';
      dom.style.height = '100%';
      dom.style.display = 'block';
      container.innerHTML = '';
      container.appendChild(dom);

      const handleContextLost = (e: Event) => {
        e.preventDefault();
        setWebglUnavailable(true);
      };
      const handleContextRestored = () => {
        setWebglUnavailable(false);
      };
      dom.addEventListener('webglcontextlost', handleContextLost);
      dom.addEventListener('webglcontextrestored', handleContextRestored);

      scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 30);
      camera.position.set(0.3, 0.12, 5.25);
      camera.lookAt(0, -0.02, 0);

      pmrem = new THREE.PMREMGenerator(renderer);
      envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
      scene.environment = envTarget.texture;
      scene.environmentIntensity = 0.78;

      // Clean Soft Studio Lighting (Matches the 3D render style)
      const hemi = new THREE.HemisphereLight(0xffffff, 0xd8dee9, 0.95);
      scene.add(hemi);

      const keyLight = new THREE.DirectionalLight(0xffffff, 1.45);
      keyLight.position.set(3.0, 4.5, 4.5);
      if (!isSoftwareGl) {
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.set(512, 512);
      }
      scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight(0x93c5fd, 0.65);
      rimLight.position.set(-3.2, 1.5, -2.5);
      scene.add(rimLight);

      // Materials matching reference 3D model
      const ceramicWhiteMat = trackMat(
        new THREE.MeshPhysicalMaterial({
          color: 0xf4f6f9,
          roughness: 0.22,
          metalness: 0.04,
          clearcoat: 0.85,
          clearcoatRoughness: 0.14,
        })
      );

      const silverTrimMat = trackMat(
        new THREE.MeshPhysicalMaterial({
          color: 0xdbe2ec,
          roughness: 0.25,
          metalness: 0.35,
          clearcoat: 0.5,
        })
      );

      const darkCharcoalMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: 0x262f3f,
          roughness: 0.45,
          metalness: 0.3,
        })
      );

      const navyBottomMat = trackMat(
        new THREE.MeshPhysicalMaterial({
          color: 0x1b3c73,
          roughness: 0.3,
          metalness: 0.2,
          clearcoat: 0.55,
        })
      );

      const earFinMat = trackMat(
        new THREE.MeshPhysicalMaterial({
          color: 0x1d75b8,
          roughness: 0.25,
          metalness: 0.2,
          clearcoat: 0.7,
        })
      );

      const glassDomeMat = trackMat(
        new THREE.MeshPhysicalMaterial({
          color: 0xe6f7ff,
          transparent: true,
          opacity: 0.32,
          roughness: 0.05,
          metalness: 0.05,
          clearcoat: 1.0,
        })
      );

      const cyanLedMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: 0x1fd6ff,
          emissive: 0x1fd6ff,
          emissiveIntensity: 1.35,
          roughness: 0.15,
        })
      );

      // Face Screen Canvas Texture (Happy LED Pixel Arcs ∩ ∩ + Voice Wave)
      const faceCanvas = document.createElement('canvas');
      faceCanvas.width = 512;
      faceCanvas.height = 384;
      const faceCtx = faceCanvas.getContext('2d');
      if (faceCtx) {
        drawVisorFace(faceCtx, 512, 384, 0, false, false, 1);
      }
      faceTexture = new THREE.CanvasTexture(faceCanvas);
      faceTexture.colorSpace = THREE.SRGBColorSpace;
      faceTexture.anisotropy = 4;

      const visorScreenMat = trackMat(
        new THREE.MeshPhysicalMaterial({
          map: faceTexture,
          emissiveMap: faceTexture,
          emissive: 0xffffff,
          emissiveIntensity: 0.92,
          roughness: 0.08,
          metalness: 0.1,
          clearcoat: 1.0,
          clearcoatRoughness: 0.05,
        })
      );

      const shadowMat = trackMat(
        new THREE.MeshBasicMaterial({
          color: 0x123b63,
          transparent: true,
          opacity: 0.13,
          depthWrite: false,
        })
      );

      // Root Robot Hierarchy
      const robotRoot = new THREE.Group();
      scene.add(robotRoot);

      // ================= HEAD ASSEMBLY =================
      const headGroup = new THREE.Group();
      headGroup.position.set(0, 0.56, 0);
      robotRoot.add(headGroup);

      // 1. Oversized Smooth Chibi Egg/Sphere Head
      const headShell = new THREE.Mesh(
        trackGeo(new THREE.SphereGeometry(0.92, 44, 32)),
        ceramicWhiteMat
      );
      headShell.scale.set(1.16, 0.96, 0.98);
      headShell.castShadow = !isSoftwareGl;
      headGroup.add(headShell);

      // 2. Curved Glossy Visor Face Screen + White Inner Bezel
      const visorBezel = new THREE.Mesh(
        trackGeo(new THREE.TorusGeometry(0.68, 0.038, 16, 52)),
        silverTrimMat
      );
      visorBezel.scale.set(1.14, 0.84, 0.45);
      visorBezel.position.set(0, -0.03, 0.72);
      headGroup.add(visorBezel);

      // Dark backing bowl behind screen
      const visorBacking = new THREE.Mesh(
        trackGeo(new THREE.SphereGeometry(0.73, 36, 26)),
        trackMat(
          new THREE.MeshPhysicalMaterial({
            color: 0x080d33,
            roughness: 0.08,
            clearcoat: 1.0,
          })
        )
      );
      visorBacking.scale.set(1.03, 0.76, 0.36);
      visorBacking.position.set(0, -0.03, 0.67);
      headGroup.add(visorBacking);

      // Domed forward-facing oval visor screen mesh using CircleGeometry with smooth Z-bulge
      const ovalFaceGeo = trackGeo(new THREE.CircleGeometry(0.68, 48));
      const ovalPos = ovalFaceGeo.attributes.position;
      const ovalUv = ovalFaceGeo.attributes.uv;
      for (let i = 0; i < ovalPos.count; i++) {
        const ox = ovalPos.getX(i);
        const oy = ovalPos.getY(i) * 0.76;
        const nx = ox / 0.68;
        const ny = oy / (0.68 * 0.76);
        const r2 = Math.min(1.0, nx * nx + ny * ny);
        const oz = Math.sqrt(Math.max(0, 1.0 - r2 * 0.72)) * 0.19;
        ovalPos.setXYZ(i, ox * 1.04, oy, oz);
        ovalUv.setXY(i, 0.5 + ox / 1.36, 0.5 + oy / (1.36 * 0.76));
      }
      ovalFaceGeo.computeVertexNormals();

      const ovalFaceMesh = new THREE.Mesh(ovalFaceGeo, visorScreenMat);
      ovalFaceMesh.position.set(0, -0.03, 0.785);
      headGroup.add(ovalFaceMesh);

      // 3. Left & Right Circular Ear Pods + Glowing Cyan Core + Transparent Glass Dome + Sky-Blue Fin
      const buildEarPod = (side: -1 | 1) => {
        const pod = new THREE.Group();
        pod.position.set(side * 1.02, -0.02, 0.02);
        pod.rotation.z = side * -0.08;

        // Outer white ring housing
        const ringHousing = new THREE.Mesh(
          trackGeo(new THREE.CylinderGeometry(0.28, 0.3, 0.18, 28)),
          ceramicWhiteMat
        );
        ringHousing.rotation.z = Math.PI / 2;
        pod.add(ringHousing);

        // Dark inner cavity
        const innerWell = new THREE.Mesh(
          trackGeo(new THREE.CylinderGeometry(0.21, 0.21, 0.19, 24)),
          darkCharcoalMat
        );
        innerWell.rotation.z = Math.PI / 2;
        pod.add(innerWell);

        // Glowing cyan ear ring + core
        const earLed = new THREE.Mesh(
          trackGeo(new THREE.TorusGeometry(0.13, 0.028, 12, 24)),
          cyanLedMat
        );
        earLed.rotation.y = Math.PI / 2;
        earLed.position.x = side * 0.08;
        pod.add(earLed);

        const earCore = new THREE.Mesh(
          trackGeo(new THREE.SphereGeometry(0.065, 16, 14)),
          cyanLedMat
        );
        earCore.position.x = side * 0.08;
        pod.add(earCore);

        // Transparent glossy dome lens over ear pod
        const earDome = new THREE.Mesh(
          trackGeo(new THREE.SphereGeometry(0.23, 20, 16)),
          glassDomeMat
        );
        earDome.scale.set(0.45, 1, 1);
        earDome.position.x = side * 0.08;
        pod.add(earDome);

        // Cute Blue Ear Fin on the left side (like the reference image)
        if (side === -1) {
          const finMesh = new THREE.Mesh(
            trackGeo(new THREE.ConeGeometry(0.06, 0.32, 16)),
            earFinMat
          );
          finMesh.scale.set(0.55, 1, 1.3);
          finMesh.position.set(-0.02, 0.34, -0.04);
          finMesh.rotation.z = 0.25;
          pod.add(finMesh);
        }

        headGroup.add(pod);
      };

      buildEarPod(-1);
      buildEarPod(1);

      // ================= BODY ASSEMBLY (Chibi Tapered Teardrop) =================
      const bodyGroup = new THREE.Group();
      bodyGroup.position.set(0, -0.62, 0);
      robotRoot.add(bodyGroup);

      // Neck shadow ring
      const neckJoint = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.32, 0.36, 0.12, 24)),
        darkCharcoalMat
      );
      bodyGroup.add(neckJoint);
      neckJoint.position.y = 0.42;

      // Tapered Egg/Teardrop Lathe Torso matching photo silhouette
      const torsoProfile = [
        new THREE.Vector2(0.01, -0.52),
        new THREE.Vector2(0.14, -0.49),
        new THREE.Vector2(0.26, -0.38),
        new THREE.Vector2(0.39, -0.18),
        new THREE.Vector2(0.47, 0.06),
        new THREE.Vector2(0.49, 0.24),
        new THREE.Vector2(0.42, 0.38),
        new THREE.Vector2(0.26, 0.44),
        new THREE.Vector2(0.0, 0.45),
      ];
      const torsoGeo = trackGeo(new THREE.LatheGeometry(torsoProfile, 40));
      const torsoMesh = new THREE.Mesh(torsoGeo, ceramicWhiteMat);
      torsoMesh.scale.set(1.05, 1, 0.92);
      torsoMesh.castShadow = !isSoftwareGl;
      bodyGroup.add(torsoMesh);

      // Deep Blue Rounded Bottom Hover Cap
      const bottomCapProfile = [
        new THREE.Vector2(0.0, -0.545),
        new THREE.Vector2(0.15, -0.51),
        new THREE.Vector2(0.25, -0.41),
        new THREE.Vector2(0.0, -0.41),
      ];
      const bottomCap = new THREE.Mesh(
        trackGeo(new THREE.LatheGeometry(bottomCapProfile, 32)),
        navyBottomMat
      );
      bottomCap.scale.set(1.06, 1, 0.93);
      bodyGroup.add(bottomCap);

      // Subtle Horizontal Seam Ring across chest
      const chestSeam = new THREE.Mesh(
        trackGeo(new THREE.TorusGeometry(0.482, 0.008, 8, 48)),
        darkCharcoalMat
      );
      chestSeam.rotation.x = Math.PI / 2;
      chestSeam.scale.set(1.05, 0.92, 1);
      chestSeam.position.y = 0.16;
      bodyGroup.add(chestSeam);

      // Iconic Rounded-Triangle Arc-Reactor Chest Medallion
      const chestCoreGroup = new THREE.Group();
      chestCoreGroup.position.set(0, -0.02, 0.43);
      chestCoreGroup.rotation.x = 0.14;
      bodyGroup.add(chestCoreGroup);

      const triShape = new THREE.Shape();
      triShape.moveTo(-0.24, 0.2);
      triShape.quadraticCurveTo(0, 0.26, 0.24, 0.2);
      triShape.quadraticCurveTo(0.28, 0.14, 0.08, -0.2);
      triShape.quadraticCurveTo(0, -0.27, -0.08, -0.2);
      triShape.quadraticCurveTo(-0.28, 0.14, -0.24, 0.2);

      const triBezelGeo = trackGeo(
        new THREE.ExtrudeGeometry(triShape, {
          depth: 0.04,
          bevelEnabled: true,
          bevelThickness: 0.02,
          bevelSize: 0.02,
          bevelSegments: 4,
        })
      );
      const triBezel = new THREE.Mesh(triBezelGeo, silverTrimMat);
      chestCoreGroup.add(triBezel);

      // Glowing Cyan Arc Ring inside chest triangle
      const chestRingGlow = new THREE.Mesh(
        trackGeo(new THREE.TorusGeometry(0.14, 0.036, 12, 28)),
        cyanLedMat
      );
      chestRingGlow.position.set(0, 0.04, 0.055);
      chestCoreGroup.add(chestRingGlow);

      // 3 Dark Charcoal Spokes over the glowing cyan chest ring
      for (let s = 0; s < 3; s++) {
        const spoke = new THREE.Mesh(
          trackGeo(new THREE.BoxGeometry(0.032, 0.16, 0.025)),
          darkCharcoalMat
        );
        const angle = (s * Math.PI * 2) / 3 + Math.PI / 6;
        spoke.position.set(
          Math.cos(angle) * 0.1,
          0.04 + Math.sin(angle) * 0.1,
          0.072
        );
        spoke.rotation.z = angle - Math.PI / 2;
        chestCoreGroup.add(spoke);
      }

      // Bright Cyan Center Chest Orb
      const chestCenterOrb = new THREE.Mesh(
        trackGeo(new THREE.SphereGeometry(0.065, 20, 16)),
        cyanLedMat
      );
      chestCenterOrb.scale.set(1, 1, 0.55);
      chestCenterOrb.position.set(0, 0.04, 0.065);
      chestCoreGroup.add(chestCenterOrb);

      // ================= WING-LIKE FLOATING ARMS =================
      const armProfile = [
        new THREE.Vector2(0.0, -0.34),
        new THREE.Vector2(0.055, -0.28),
        new THREE.Vector2(0.095, -0.12),
        new THREE.Vector2(0.115, 0.08),
        new THREE.Vector2(0.085, 0.22),
        new THREE.Vector2(0.0, 0.25),
      ];
      const armGeo = trackGeo(new THREE.LatheGeometry(armProfile, 24));

      const leftArmPivot = new THREE.Group();
      leftArmPivot.position.set(-0.52, 0.22, 0.02);
      bodyGroup.add(leftArmPivot);
      const leftArm = new THREE.Mesh(armGeo, ceramicWhiteMat);
      leftArm.scale.set(0.85, 1, 1.05);
      leftArm.position.set(-0.08, -0.16, 0);
      leftArm.rotation.z = -0.34;
      leftArmPivot.add(leftArm);

      const rightArmPivot = new THREE.Group();
      rightArmPivot.position.set(0.52, 0.22, 0.02);
      bodyGroup.add(rightArmPivot);
      const rightArm = new THREE.Mesh(armGeo, ceramicWhiteMat);
      rightArm.scale.set(0.85, 1, 1.05);
      rightArm.position.set(0.08, -0.16, 0);
      rightArm.rotation.z = 0.34;
      rightArmPivot.add(rightArm);

      // Soft Floor Hover Shadow Disc
      const floorDisc = new THREE.Mesh(
        trackGeo(new THREE.CircleGeometry(0.54, 32)),
        shadowMat
      );
      floorDisc.rotation.x = -Math.PI / 2;
      floorDisc.position.set(0, -1.36, 0);
      scene.add(floorDisc);

      // Resize Handler
      const handleResize = () => {
        if (!container || !renderer) return;
        const w = Math.max(container.clientWidth || 320, 220);
        const h = Math.max(container.clientHeight || 280, 200);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      const resizeObs = new ResizeObserver(handleResize);
      resizeObs.observe(container);

      const clock = new THREE.Clock();
      let lastFaceRedraw = 0;

      const animate = () => {
        if (disposed || !renderer || !scene) return;
        const t = clock.getElapsedTime();
        const {isSpeaking: speaking, isListening: listening} = stateRef.current;

        // Gentle hover float
        const floatY = Math.sin(t * 2.1) * 0.065;
        robotRoot.position.y = 0.02 + floatY;

        // Cute gentle 3/4 head expression
        headGroup.rotation.y = -0.1 + Math.sin(t * 0.75) * 0.1;
        headGroup.rotation.z = speaking
          ? Math.sin(t * 4.5) * 0.04
          : Math.sin(t * 1.15) * 0.025;

        // Blink naturally every ~3.6 seconds
        const blinkCycle = t % 3.6;
        const blinkFactor =
          blinkCycle > 3.44 && blinkCycle < 3.58
            ? Math.max(0.12, Math.abs(Math.cos((blinkCycle - 3.44) * 22)))
            : 1.0;

        // Redraw LED face texture at ~24fps when animated or blinking for crisp zero-lag performance
        if (faceCtx && faceTexture && (t - lastFaceRedraw > 0.04 || blinkFactor < 1)) {
          lastFaceRedraw = t;
          drawVisorFace(faceCtx, 512, 384, t, speaking, listening, blinkFactor);
          faceTexture.needsUpdate = true;
        }

        // Glow pulse on cyan LED chest core & ear rings
        const ledColorHex = listening ? 0x10e89e : 0x1fd6ff;
        cyanLedMat.color.setHex(ledColorHex);
        cyanLedMat.emissive.setHex(ledColorHex);
        cyanLedMat.emissiveIntensity = speaking
          ? 1.35 + Math.sin(t * 10) * 0.35
          : 1.2 + Math.sin(t * 2.2) * 0.15;

        // Wing arms gentle hover & friendly wave when speaking
        leftArmPivot.rotation.z = Math.sin(t * 2.1) * 0.05;
        if (speaking) {
          rightArmPivot.rotation.z = 0.38 + Math.sin(t * 6.0) * 0.18;
        } else {
          rightArmPivot.rotation.z = -Math.sin(t * 2.1) * 0.05;
        }

        // Soft floor shadow breathes with float height
        const sScale = 1 - floatY * 1.5;
        floorDisc.scale.set(sScale, sScale, 1);

        renderer.render(scene, camera);
        animId = window.requestAnimationFrame(animate);
      };

      animId = window.requestAnimationFrame(animate);

      return () => {
        disposed = true;
        window.cancelAnimationFrame(animId);
        resizeObs.disconnect();
        dom.removeEventListener('webglcontextlost', handleContextLost);
        dom.removeEventListener('webglcontextrestored', handleContextRestored);

        faceTexture?.dispose();
        geometries.forEach((g) => g.dispose());
        materials.forEach((m) => m.dispose());
        envTarget?.dispose();
        pmrem?.dispose();
        renderer?.dispose();
        if (container.contains(dom)) {
          container.removeChild(dom);
        }
      };
    } catch {
      window.setTimeout(() => setWebglUnavailable(true), 0);
    }
  }, []);

  const badgeText = isListening
    ? language === 'gu'
      ? 'તમારો અવાજ સાંભળી રહ્યો છે...'
      : language === 'hi'
        ? 'आपकी आवाज़ सुन रहा है...'
        : 'Listening to you...'
    : isSpeaking
      ? language === 'gu'
        ? 'બોલી રહ્યું છે...'
        : language === 'hi'
          ? 'बोल रहा है...'
          : 'Speaking...'
      : language === 'gu'
        ? 'મદદ માટે તૈયાર'
        : language === 'hi'
          ? 'मदद के लिए तैयार'
          : 'Ready to Help';

  return (
    <div
      className={`uidai-card rounded-3xl p-4 sm:p-6 flex flex-col items-center justify-between gap-4 relative overflow-hidden ${className}`}
    >
      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#F2F4FA] via-[#F6F8FA] to-transparent pointer-events-none" />

      {/* Top Identity Row */}
      <div className="relative z-10 w-full flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#F0A900] shrink-0" />
          <span className="text-xs sm:text-sm font-extrabold text-[#202124]">
            SevaAI 3D Sahayak
          </span>
        </div>

        <span
          className={`text-xs font-bold flex items-center gap-1.5 ${
            isListening
              ? 'text-[#046A38]'
              : isSpeaking
                ? 'text-[#D32828]'
                : 'text-[#123B63]'
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isListening
                ? 'bg-[#046A38]'
                : isSpeaking
                  ? 'bg-[#D32828]'
                  : 'bg-[#046A38]'
            }`}
          />
          <span>{badgeText}</span>
        </span>
      </div>

      {/* 3D WebGL Canvas Stage */}
      <div
        className={`relative z-10 w-full flex items-center justify-center ${
          compact ? 'h-48 sm:h-56' : 'h-60 sm:h-72'
        }`}
      >
        {webglUnavailable ? (
          <RobotFallback3D
            isSpeaking={isSpeaking}
            isListening={isListening}
            compact={compact}
          />
        ) : (
          <div ref={containerRef} className="w-full h-full" />
        )}
      </div>

      {/* Crisp Subtitle Dialogue Box */}
      <div className="relative z-10 w-full rounded-2xl bg-[#F6F8FA] border border-[#D9DEE5] p-4 text-center space-y-1.5">
        <p className="text-base sm:text-lg font-extrabold text-[#202124] leading-snug">
          “{subtitlePrimary}”
        </p>
        {subtitleSecondary && (
          <p className="text-xs sm:text-sm text-[#5F6368] leading-snug">
            {subtitleSecondary}
          </p>
        )}
      </div>

      {/* Simple Audio Controls */}
      {(onReplay || onToggleMute) && (
        <div className="relative z-10 w-full space-y-1.5">
          <div className="w-full flex items-center justify-center gap-2.5">
            {onReplay && (
              <button
                type="button"
                onClick={onReplay}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-[#123B63] bg-white border border-[#123B63] hover:bg-[#F6F8FA] rounded-xl transition-colors cursor-pointer"
              >
                <RotateCcw className="h-4 w-4 text-[#123B63]" />
                <span>
                  {language === 'gu'
                    ? 'ફરી સાંભળો'
                    : language === 'hi'
                      ? 'फिर सुनें'
                      : 'Replay Voice'}
                </span>
              </button>
            )}
            {onToggleMute && (
              <button
                type="button"
                onClick={onToggleMute}
                className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl border transition-colors cursor-pointer ${
                  isMuted
                    ? 'bg-[#FDF2F2] text-[#B3261E] border-[#B3261E]/30'
                    : 'bg-[#123B63] text-white border-[#123B63]'
                }`}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
                <span>
                  {isMuted
                    ? language === 'gu'
                      ? 'મ્યૂટ'
                      : 'Muted'
                    : language === 'gu'
                      ? 'અવાજ ચાલુ'
                      : language === 'hi'
                        ? 'आवाज़ चालू'
                        : 'Voice On'}
                </span>
              </button>
            )}
          </div>
          {voiceStatusHint && !isMuted && (
            <div className="text-center text-[11px] font-medium text-[#5F6368]">
              {voiceStatusHint}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
