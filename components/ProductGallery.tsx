'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const all = images.length > 0 ? images : ['/images/placeholder.jpg'];
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-3">
      {/* Image principale */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
        <Image
          src={all[active]}
          alt={`${name} — image ${active + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
          priority
        />
      </div>

      {/* Miniatures */}
      {all.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {all.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-150 ${
                active === i
                  ? 'border-primary scale-105 shadow-md'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <Image src={img} alt={`${name} ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
