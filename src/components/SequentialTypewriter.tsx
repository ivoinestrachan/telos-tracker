'use client';

import { useState, useEffect, useRef } from 'react';
import TypewriterText from './TypewriterText';

type SequentialTypewriterProps = {
  lines: string[];
  speed?: number;
  jitter?: number;
  delayBetweenLines?: number;
  className?: string;
  onDone?: () => void;
};

export default function SequentialTypewriter({
  lines,
  speed = 50,
  jitter = 20,
  delayBetweenLines = 1000,
  className = '',
  onDone,
}: SequentialTypewriterProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const handleLineComplete = () => {
    if (currentLineIndex < lines.length - 1) {
      // Wait before showing next line
      setTimeout(() => {
        setCurrentLineIndex(prev => prev + 1);
      }, delayBetweenLines);
    } else {
      // All lines complete
      setIsComplete(true);
      if (onDone) {
        onDone();
      }
    }
  };

  return (
    <div className={className}>
      <TypewriterText
        key={currentLineIndex}
        text={lines[currentLineIndex]}
        speed={speed}
        jitter={jitter}
        className="text-white text-xl text-center"
        onDone={handleLineComplete}
      />
    </div>
  );
}

