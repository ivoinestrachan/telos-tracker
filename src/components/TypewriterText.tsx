'use client';

import { useState, useEffect, useRef } from 'react';

export type TypewriterProps = {
  text: string;             // The full text to type
  speed?: number;           // Base delay in ms between characters (default 60ms)
  jitter?: number;          // Max random extra delay per character in ms (default 20ms)
  startDelay?: number;      // Optional delay before typing starts
  loop?: boolean;           // If true, after completion wait a bit then clear and retype
  className?: string;       // Allow styling from outside
  onDone?: () => void;      // Callback once typing completes (one cycle)
};

export default function TypewriterText({
  text,
  speed = 60,
  jitter = 20,
  startDelay = 0,
  loop = false,
  className = '',
  onDone,
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentIndexRef = useRef(0);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Reset state when text changes
    setDisplayedText('');
    currentIndexRef.current = 0;
    setIsTyping(true);
    hasCompletedRef.current = false;

    // Start typing after initial delay
    const startTyping = () => {
      const typeNextChar = () => {
        const currentIndex = currentIndexRef.current;

        if (currentIndex < text.length) {
          // Add next character
          setDisplayedText(text.substring(0, currentIndex + 1));
          currentIndexRef.current++;

          // Calculate delay with jitter
          const randomJitter = Math.random() * jitter;
          const delay = speed + randomJitter;

          timeoutRef.current = setTimeout(typeNextChar, delay);
        } else {
          // Typing complete
          setIsTyping(false);
          
          // Call onDone callback if provided (only once)
          if (onDone && !hasCompletedRef.current) {
            hasCompletedRef.current = true;
            onDone();
          }

          // Handle looping
          if (loop) {
            timeoutRef.current = setTimeout(() => {
              setDisplayedText('');
              currentIndexRef.current = 0;
              setIsTyping(true);
              hasCompletedRef.current = false;
              timeoutRef.current = setTimeout(typeNextChar, startDelay);
            }, 2000); // Wait 2 seconds before restarting
          }
        }
      };

      timeoutRef.current = setTimeout(typeNextChar, startDelay);
    };

    startTyping();

    // Cleanup on unmount or when text changes
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, speed, jitter, startDelay, loop]);

  // Split text by newlines and render with proper line breaks
  const lines = displayedText.split('\n');

  return (
    <div className={className}>
      {lines.map((line, index) => (
        <span key={index}>
          {line}
          {index < lines.length - 1 && <br />}
        </span>
      ))}
      {isTyping && <span className="animate-pulse">|</span>}
    </div>
  );
}
