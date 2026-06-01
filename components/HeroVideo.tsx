'use client';

import { useEffect, useRef } from 'react';

export default function HeroVideo({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Créer la vidéo principale via le DOM (contourne le bug React avec muted)
    const video = document.createElement('video');
    video.src = src;
    video.autoplay = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.muted = true;
    video.preload = 'auto';
    video.style.cssText = `
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center;
      z-index: 1;
    `;

    // Fond flouté pour remplir les bandes noires
    const bg = document.createElement('video');
    bg.src = src;
    bg.autoplay = true;
    bg.loop = true;
    bg.playsInline = true;
    bg.setAttribute('muted', '');
    bg.muted = true;
    bg.preload = 'auto';
    bg.style.cssText = `
      position: absolute;
      inset: -20px;
      width: calc(100% + 40px);
      height: calc(100% + 40px);
      object-fit: cover;
      filter: blur(20px) brightness(0.5) saturate(1.2);
      transform: scale(1.1);
      z-index: 0;
    `;

    container.appendChild(bg);
    container.appendChild(video);

    // Force play (iOS)
    const tryPlay = () => {
      video.play().catch(() => {});
      bg.play().catch(() => {});
    };
    tryPlay();
    document.addEventListener('touchstart', tryPlay, { once: true });
    document.addEventListener('click', tryPlay, { once: true });

    return () => {
      video.remove();
      bg.remove();
    };
  }, [src]);

  return <div ref={containerRef} className="absolute inset-0 overflow-hidden" />;
}
