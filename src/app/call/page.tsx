'use client';

import Image from 'next/image';
import SequentialTypewriter from '@/components/SequentialTypewriter';

export default function EventPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <Image 
          src="/images/phone-removebg-preview.png" 
          alt="Phone"
          width={250}
          height={250}
          priority
        />
        <SequentialTypewriter 
          lines={[
            'the line has closed',
            'the journey has begun...'
          ]}
          speed={50}
          jitter={20}
          delayBetweenLines={1500}
          className="text-white text-xl text-center"
        />
      </div>
    </div>
  );
}
