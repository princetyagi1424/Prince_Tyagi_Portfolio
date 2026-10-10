import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FastForward, Sparkles, VolumeX } from 'lucide-react';

interface CinematicIntroProps {
  onComplete: () => void;
  isOpen: boolean;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  originX: number;
  originY: number;
  originZ: number;
  targetX: number;
  targetY: number;
  targetZ: number;
  angle: number;
  radius: number;
  speed: number;
  arm: number;
  size: number;
  baseAlpha: number;
  color: string;
  glow: number;
  driftX: number;
  driftY: number;
}

export function CinematicIntro({ onComplete, isOpen }: CinematicIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const isRunningRef = useRef(false);
  const hasFinishedRef = useRef(false);
  const startTimeRef = useRef<number | null>(null);

  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Pointer position for subtle 3D parallax
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Stable callback ref to avoid effect recreation
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const handleSkip = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    setIsFadingOut(true);
    setTimeout(() => {
      onCompleteRef.current();
    }, 450);
  }, []);

  // Keyboard shortcut (Escape to skip)
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, handleSkip]);

  // Handle prefers-reduced-motion
  useEffect(() => {
    if (!isOpen) return undefined;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      const timer = setTimeout(() => {
        handleSkip();
      }, 800);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isOpen, handleSkip]);

  // Main 3D Particle Animation Loop
  useEffect(() => {
    if (!isOpen) {
      // Reset state for potential replay
      hasFinishedRef.current = false;
      startTimeRef.current = null;
      setIsFadingOut(false);
      setSubtitleVisible(false);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    isRunningRef.current = true;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = width < 768;
    const particleCount = isMobile ? 950 : 2000;

    // Palette inspired by GPT-6 Astra: Cyan, Electric Sky, Deep Violet, Ice White
    const palette = [
      '#38bdf8', // bright sky cyan
      '#67e8f9', // luminous aqua
      '#818cf8', // vibrant indigo
      '#c084fc', // celestial violet
      '#e0f2fe', // icy starlight
      '#ffffff', // diamond white highlight
    ];

    let textTargets: { x: number; y: number }[] = [];

    const sampleTextPoints = () => {
      const offCanvas = document.createElement('canvas');
      const offCtx = offCanvas.getContext('2d');
      if (!offCtx) return;

      offCanvas.width = width;
      offCanvas.height = height;

      const fontSize = Math.min(width * 0.11, isMobile ? 46 : 84);
      offCtx.font = `800 ${fontSize}px "Space Grotesk", "Manrope", sans-serif`;
      offCtx.fillStyle = '#ffffff';
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';

      const centerY = height * 0.44;

      if (isMobile) {
        offCtx.fillText('PRINCE', width * 0.5, centerY - fontSize * 0.58);
        offCtx.fillText('TYAGI', width * 0.5, centerY + fontSize * 0.58);
      } else {
        offCtx.fillText('PRINCE  TYAGI', width * 0.5, centerY);
      }

      const imgData = offCtx.getImageData(0, 0, width, height);
      const data = imgData.data;
      const points: { x: number; y: number }[] = [];
      const step = isMobile ? 4 : 3;

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const idx = (y * width + x) * 4;
          if (data[idx + 3] > 120) {
            points.push({ x, y });
          }
        }
      }

      // Shuffle points evenly
      for (let i = points.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [points[i], points[j]] = [points[j], points[i]];
      }

      textTargets = points;
    };

    sampleTextPoints();

    // Create particles
    const particles: Particle[] = [];
    const maxRadius = Math.max(width, height) * 0.78;

    for (let i = 0; i < particleCount; i++) {
      const arm = i % 3;
      const t = i / particleCount;
      const angle = t * Math.PI * 14 + (arm * Math.PI * 2) / 3;
      const radius = 25 + t * maxRadius;
      const z = (Math.random() - 0.5) * 850;

      const originX = width * 0.5 + Math.cos(angle) * radius;
      const originY = height * 0.44 + Math.sin(angle) * (radius * 0.6);
      const originZ = z;

      let targetX = originX;
      let targetY = originY;
      if (textTargets.length > 0) {
        const pt = textTargets[i % textTargets.length];
        targetX = pt.x + (Math.random() - 0.5) * 2;
        targetY = pt.y + (Math.random() - 0.5) * 2;
      }

      particles.push({
        x: originX,
        y: originY,
        z: originZ,
        originX,
        originY,
        originZ,
        targetX,
        targetY,
        targetZ: (Math.random() - 0.5) * 35,
        angle,
        radius,
        speed: 0.022 + Math.random() * 0.028,
        arm,
        size: Math.random() < 0.12 ? (isMobile ? 2.2 : 3.0) : Math.random() * 1.6 + 0.8,
        baseAlpha: 0.45 + Math.random() * 0.55,
        color: palette[Math.floor(Math.random() * palette.length)],
        glow: Math.random() < 0.28 ? 10 : 0,
        driftX: (Math.random() - 0.5) * 0.5,
        driftY: (Math.random() - 0.5) * 0.5,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      sampleTextPoints();
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      mouseRef.current.targetX = (e.clientX / width - 0.5) * 2;
      mouseRef.current.targetY = (e.clientY / height - 0.5) * 2;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    const totalDuration = 3800; // 3.8s target runtime

    const render = (now: number) => {
      if (!isRunningRef.current) return;

      if (startTimeRef.current === null) {
        startTimeRef.current = now;
      }

      const elapsed = now - startTimeRef.current;

      // Mouse smooth interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      const px = mouseRef.current.x * 24;
      const py = mouseRef.current.y * 18;

      // Sequence timeline
      if (elapsed > 2300 && !subtitleVisible) {
        setSubtitleVisible(true);
      }

      if (elapsed >= 3400 && !hasFinishedRef.current) {
        hasFinishedRef.current = true;
        setIsFadingOut(true);
        setTimeout(() => {
          onCompleteRef.current();
        }, 450);
      }

      // Draw background
      ctx.fillStyle = '#060811';
      ctx.fillRect(0, 0, width, height);

      // Deep atmospheric glow (GPT-6 Astra style)
      const grad = ctx.createRadialGradient(
        width * 0.5 + px * 0.4,
        height * 0.44 + py * 0.4,
        10,
        width * 0.5,
        height * 0.44,
        Math.max(width, height) * 0.6
      );
      grad.addColorStop(0, 'rgba(38, 90, 160, 0.22)');
      grad.addColorStop(0.35, 'rgba(99, 102, 241, 0.12)');
      grad.addColorStop(0.7, 'rgba(15, 23, 42, 0.06)');
      grad.addColorStop(1, 'rgba(6, 8, 17, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Morph factor: 0 in spiral phase, smoothly transitions to 1 in name formation phase
      let morphFactor = 0;
      if (elapsed > 1000) {
        const t = Math.min(1, Math.max(0, (elapsed - 1000) / 1400));
        morphFactor = t * t * (3 - 2 * t);
      }

      // Draw energy lines between nearby particles during assembly
      if (morphFactor > 0.15 && morphFactor < 0.92 && !isMobile) {
        ctx.lineWidth = 0.5;
        const step = 20;
        for (let i = 0; i < particles.length; i += step) {
          const p1 = particles[i];
          for (let j = i + step; j < Math.min(particles.length, i + 80); j += step) {
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < 3200) {
              const alpha = (1 - distSq / 3200) * 0.16 * (1 - Math.abs(morphFactor - 0.5) * 2);
              ctx.strokeStyle = `rgba(110, 231, 255, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }

      // Render all particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 1. Vortex trajectory
        p.angle += p.speed * (1 + (1 - morphFactor) * 1.6);
        const curRadius = p.radius * (1 - morphFactor * 0.68);
        const spiralX = width * 0.5 + Math.cos(p.angle) * curRadius + p.driftX * (elapsed * 0.02);
        const spiralY = height * 0.44 + Math.sin(p.angle) * (curRadius * 0.58) + p.driftY * (elapsed * 0.02);
        const spiralZ = p.originZ * (1 - morphFactor);

        // 2. Target text position
        const destX = p.targetX;
        const destY = p.targetY;
        const destZ = p.targetZ;

        // Smooth 3D blending
        const currentX = spiralX * (1 - morphFactor) + destX * morphFactor + px * (0.02 + (p.z / 900) * 0.04);
        const currentY = spiralY * (1 - morphFactor) + destY * morphFactor + py * (0.02 + (p.z / 900) * 0.04);
        const currentZ = spiralZ * (1 - morphFactor) + destZ * morphFactor;

        p.x = currentX;
        p.y = currentY;
        p.z = currentZ;

        // Shimmer & opacity
        const shimmer = Math.sin(elapsed * 0.006 + i) * 0.2 + 0.8;
        const entryFade = Math.min(1, elapsed / 450);
        const finalAlpha = Math.min(1, p.baseAlpha * shimmer * entryFade);

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = finalAlpha;

        if (p.glow > 0 && morphFactor > 0.5) {
          ctx.shadowColor = p.color;
          ctx.shadowBlur = p.glow;
        }

        ctx.beginPath();
        const renderSize = Math.max(0.6, p.size * (1 - (p.z / 1300)));
        ctx.arc(p.x, p.y, renderSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Elegant luminous light sweep across the formed name
      if (elapsed > 2100 && elapsed < 3300) {
        const sweepProgress = (elapsed - 2100) / 1200;
        const sweepX = width * 0.2 + width * 0.6 * sweepProgress;
        const sweepGrad = ctx.createLinearGradient(sweepX - 70, 0, sweepX + 70, 0);
        sweepGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
        sweepGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.42)');
        sweepGrad.addColorStop(1, 'rgba(192, 132, 252, 0)');
        ctx.fillStyle = sweepGrad;
        ctx.fillRect(sweepX - 70, height * 0.35, 140, height * 0.2);
      }

      if (elapsed < totalDuration + 500) {
        animFrameIdRef.current = requestAnimationFrame(render);
      }
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      isRunningRef.current = false;
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden transition-all duration-700 select-none ${
        isFadingOut ? 'opacity-0 scale-[1.03] pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: '#060811',
        backgroundColor: '#060811',
      }}
      aria-label="Prince Tyagi Portfolio Cinematic Opening Sequence"
    >
      {/* 3D Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
        style={{ touchAction: 'none' }}
      />

      {/* Top Header Controls */}
      <header className="absolute top-6 left-0 right-0 px-6 sm:px-10 flex items-center justify-between z-20 pointer-events-auto">
        <div className="flex items-center gap-2 text-cyan-400/80 font-mono text-[11px] tracking-widest uppercase">
          <Sparkles size={13} className="animate-pulse text-cyan-300" />
          <span>ASTRA 3D ENGINE · OPENING SEQUENCE</span>
        </div>

        <button
          onClick={handleSkip}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-slate-900/70 hover:bg-cyan-950/60 hover:border-cyan-400/70 text-cyan-200 text-xs font-mono tracking-wide transition-all shadow-lg shadow-cyan-950/40 backdrop-blur-md cursor-pointer group"
          aria-label="Skip cinematic introduction"
        >
          <span>Skip intro</span>
          <FastForward size={12} className="group-hover:translate-x-0.5 transition-transform" />
          <span className="text-[10px] text-slate-400 hidden sm:inline">(Esc)</span>
        </button>
      </header>

      {/* Center Subtitle Overlay */}
      <div
        className={`absolute top-[58%] sm:top-[56%] z-20 text-center px-4 max-w-2xl transition-all duration-1000 ${
          subtitleVisible
            ? 'opacity-100 translate-y-0 filter-none'
            : 'opacity-0 translate-y-4 blur-sm'
        }`}
      >
        <div className="inline-block px-3 py-1 rounded-full border border-cyan-400/20 bg-cyan-950/40 text-cyan-300 font-mono text-[10px] sm:text-[11px] tracking-wider uppercase mb-3">
          GLA University · B.Tech CSE (AI & Data Science)
        </div>
        <h2 className="text-slate-200 text-sm sm:text-base md:text-lg font-medium tracking-tight leading-relaxed">
          Computer Science Engineering Student <span className="text-cyan-400/70">|</span> Aspiring Software Developer
        </h2>
      </div>

      {/* Footer Info */}
      <footer className="absolute bottom-6 left-0 right-0 px-6 sm:px-10 flex items-center justify-between z-20 text-slate-500 font-mono text-[10px] tracking-wider pointer-events-none">
        <div className="flex items-center gap-1.5">
          <VolumeX size={12} />
          <span>AUDIO MUTED</span>
        </div>
        <div>
          <span>PORTFOLIO / 2026</span>
        </div>
      </footer>
    </div>
  );
}
