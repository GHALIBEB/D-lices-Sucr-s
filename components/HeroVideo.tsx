'use client';

import { useRef, useEffect } from 'react';

interface Props {
  src: string;
  mobileSrc?: string;
}

export default function HeroVideo({ src, mobileSrc }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    // Choisir la bonne source selon la taille d'écran
    const isMobile = window.innerWidth < 768;
    const videoSrc = (isMobile && mobileSrc) ? mobileSrc : src;

    v.src = videoSrc;
    v.muted = true;
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
    v.controls = false;
    v.load();

    const play = () => v.play().catch(() => {});
    play();
    document.addEventListener('touchstart', play, { once: true });

    return () => document.removeEventListener('touchstart', play);
  }, [src, mobileSrc]);

  return (
    <video
      ref={ref}
      loop
      playsInline
      autoPlay
      preload="auto"
      controls={false}
      disablePictureInPicture
      className="absolute inset-0 w-full h-full object-cover"
      style={{ pointerEvents: 'none' }}
    />
  );
}
