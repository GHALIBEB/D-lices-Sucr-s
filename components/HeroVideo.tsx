'use client';

import { useEffect, useRef } from 'react';

interface Props { src: string; mobileSrc?: string; }

export default function HeroVideo({ src: defaultSrc, mobileSrc: defaultMobileSrc }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // Récupérer la dernière source depuis l'API
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        const isMobile = window.innerWidth < 768;
        const videoSrc = (isMobile && data.heroVideoMobile)
          ? data.heroVideoMobile
          : (data.heroVideo || defaultSrc);

        if (!videoSrc) return;

        // Injecter le HTML vidéo directement — contourne le bug React/iOS avec muted
        wrapper.innerHTML = `
          <video
            autoplay
            muted
            loop
            playsinline
            webkit-playsinline
            preload="auto"
            style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none;"
          >
            <source src="${videoSrc}" type="video/mp4" />
          </video>
        `;

        const v = wrapper.querySelector('video') as HTMLVideoElement;
        if (!v) return;
        v.muted = true;
        v.play().catch(() => {
          document.addEventListener('touchstart', () => v.play(), { once: true });
        });
      })
      .catch(() => {
        // Fallback si l'API échoue
        const isMobile = window.innerWidth < 768;
        const videoSrc = (isMobile && defaultMobileSrc) ? defaultMobileSrc : defaultSrc;
        if (!videoSrc) return;

        wrapper.innerHTML = `
          <video autoplay muted loop playsinline webkit-playsinline preload="auto"
            style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none;">
            <source src="${videoSrc}" type="video/mp4" />
          </video>
        `;
        const v = wrapper.querySelector('video') as HTMLVideoElement;
        if (v) { v.muted = true; v.play().catch(() => {}); }
      });
  }, [defaultSrc, defaultMobileSrc]);

  return <div ref={wrapperRef} className="absolute inset-0 overflow-hidden" />;
}
