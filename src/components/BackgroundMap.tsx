'use client';

import Image from 'next/image';
import mapbg from '../../assets/mappy.svg';

export default function BackgroundMap() {
  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <Image
        src={mapbg}
        alt="Route Map Background"
        fill
        className="object-cover opacity-[0.3] scale-100"
        priority
      />
    </div>
  );
}
