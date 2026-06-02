'use client';

import { useRef, useEffect, useState } from 'react';

interface Props {
  src: string;
  mobileSrc?: string;
}

export default function HeroVideo({ src: defaultSrc, mobileSrc: defaultMobileSrc }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState(defaultSrc);
  const [mobileSrc, setMobileSrc] = useState(defaultMobileSrc);

  // Relit les settings depuis l'API pour avoir la dernière version
  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.heroVideo) setSrc(data.heroVideo);
        if (data.heroVideoMobile) setMobileSrc(data.heroVideoMobile);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v || !src) return;

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
