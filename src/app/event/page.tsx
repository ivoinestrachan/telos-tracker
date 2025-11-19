'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Limited letter options for each position (correct letter + 5 extras)
const LETTER_OPTIONS = [
  ['P', 'Q', 'R', 'S', 'T', 'U'], // S is at index 3
  ['I', 'J', 'K', 'L', 'M', 'N'], // L is at index 3
  ['R', 'S', 'T', 'U', 'V', 'W'], // U is at index 3
  ['P', 'Q', 'R', 'S', 'T', 'U'], // S is at index 3
  ['E', 'F', 'G', 'H', 'I', 'J'], // H is at index 3
];

const EventPage = () => {
  // Randomize starting positions (not at correct answer)
  const [letterIndices, setLetterIndices] = useState(() =>
    LETTER_OPTIONS.map(() => Math.floor(Math.random() * 6))
  );
  const [success, setSuccess] = useState(false);
  const [touchStart, setTouchStart] = useState<{ y: number; index: number } | null>(null);

  const correctCode = 'SLUSH';

  useEffect(() => {
    const currentCode = letterIndices.map((idx, i) => LETTER_OPTIONS[i][idx]).join('');
    if (currentCode === correctCode) {
      setSuccess(true);
      setTimeout(() => {
        window.location.href = 'https://luma.com/dopzdpa1';
      }, 1500);
    } else if (success) {
      setSuccess(false);
    }
  }, [letterIndices, success]);

  const scrollLetter = (index: number, direction: 'up' | 'down') => {
    if (success) return;

    setLetterIndices(prev => {
      const newIndices = [...prev];
      const maxIndex = LETTER_OPTIONS[index].length;
      if (direction === 'up') {
        newIndices[index] = (newIndices[index] - 1 + maxIndex) % maxIndex;
      } else {
        newIndices[index] = (newIndices[index] + 1) % maxIndex;
      }
      return newIndices;
    });
  };

  const handleWheel = (index: number, e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      scrollLetter(index, 'up');
    } else {
      scrollLetter(index, 'down');
    }
  };

  const handleTouchStart = (index: number, e: React.TouchEvent) => {
    setTouchStart({
      y: e.touches[0].clientY,
      index
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const currentY = e.touches[0].clientY;
    const diff = touchStart.y - currentY;

    if (Math.abs(diff) > 30) {
      if (diff > 0) {
        scrollLetter(touchStart.index, 'down');
      } else {
        scrollLetter(touchStart.index, 'up');
      }
      setTouchStart({ ...touchStart, y: currentY });
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Matrix-style background effect */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-linear-to-b from-red-900/20 to-black"></div>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-red-500 font-mono text-xs animate-matrix"
            style={{
              left: `${i * 5}%`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            {Array(50).fill(0).map(() => String.fromCharCode(33 + Math.floor(Math.random() * 94))).join('\n')}
          </div>
        ))}
      </div>

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-red-500/5 to-transparent animate-scan"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-red-500 font-mono text-sm animate-pulse">{'>'}</span>
            <h1 className="text-5xl md:text-7xl font-bold text-red-500 font-mono tracking-wider glitch">
              CLASSIFIED
            </h1>
            <span className="text-red-500 font-mono text-sm animate-pulse">{'<'}</span>
          </div>
          <div className="text-red-400/80 font-mono text-sm md:text-base tracking-widest">
            <span className="inline-block animate-pulse">█</span> PRIVATE EVENT
            <span className="inline-block animate-pulse ml-2">█</span>
          </div>
          <div className="text-red-500/60 font-mono text-xs mt-2">
            ACCESS CODE REQUIRED // INVITATION ONLY
          </div>
        </motion.div>

        {/* Riddle Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="bg-black/60 border-2 border-red-500/50 rounded-lg p-6 mb-8 max-w-2xl w-full backdrop-blur-sm shadow-[0_0_30px_rgba(239,68,68,0.3)]"
        >
          <div className="font-mono text-red-400 space-y-3">
            <div className="flex gap-2 items-center">
              <span className="text-red-500 text-2xl">?</span>
              <span className="text-red-500 text-lg font-bold">SECURITY QUESTION:</span>
            </div>
            <div className="pl-8 text-sm md:text-base">
              <p className="text-red-300 italic animate-pulse">
                "What event did you just attend?"
              </p>
            </div>
            <div className="pl-8 text-xs text-red-500/60">
              HINT: Think carefully... it's right in front of you
            </div>
          </div>
        </motion.div>

        {/* Event details in terminal style */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="bg-black/60 border-2 border-red-500/50 rounded-lg p-6 mb-8 max-w-2xl w-full backdrop-blur-sm shadow-[0_0_30px_rgba(239,68,68,0.3)]"
        >
          <div className="font-mono text-red-400 space-y-3">
            <div className="flex gap-2">
              <span className="text-red-500">root@telos:~$</span>
              <span className="typing-animation">cat event_details.txt</span>
            </div>
            <div className="pl-4 text-xs md:text-sm space-y-2 border-l-2 border-red-500/30">
              <p><span className="text-red-500">DATE:</span> TBD</p>
              <p><span className="text-red-500">LOCATION:</span> [ENCRYPTED]</p>
              <p><span className="text-red-500">CLEARANCE:</span> Level 5</p>
              <p><span className="text-red-500">STATUS:</span> <span className="animate-pulse">ACTIVE</span></p>
            </div>
          </div>
        </motion.div>

        {/* Briefcase Code Entry */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="relative"
        >
          <div className="relative">
            {/* Glowing effect */}
            <div className={`absolute inset-0 blur-xl rounded-lg animate-pulse ${
              success ? 'bg-green-500/30' : 'bg-red-500/20'
            }`}></div>

            {/* Briefcase */}
            <div className={`relative bg-linear-to-b from-gray-800 to-gray-900 border-4 rounded-lg w-72 h-48 transition-all duration-300 ${
              success ? 'border-green-500 shadow-[0_0_50px_rgba(34,197,94,0.5)]' : 'border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.5)]'
            }`}>
              {/* Handle */}
              <div className={`absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-8 bg-gray-800 border-4 rounded-t-lg border-b-0 ${
                success ? 'border-green-500' : 'border-red-500'
              }`}></div>

              {/* Lock mechanism */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-8">
                {/* Combination Lock Tumblers */}
                <div className={`bg-black/80 border-2 rounded-lg p-3 md:p-4 mb-4 ${
                  success ? 'border-green-500' : 'border-red-500'
                }`}>
                  <div className="flex justify-center gap-1.5 md:gap-2">
                    {letterIndices.map((currentIndex, i) => {
                      const letters = LETTER_OPTIONS[i];
                      return (
                        <div
                          key={i}
                          className={`relative w-10 h-14 md:w-12 md:h-16 bg-black border-2 rounded overflow-hidden cursor-pointer select-none ${
                            success ? 'border-green-400' : 'border-red-400'
                          }`}
                          onWheel={(e) => handleWheel(i, e)}
                          onTouchStart={(e) => handleTouchStart(i, e)}
                          onTouchMove={handleTouchMove}
                          onTouchEnd={handleTouchEnd}
                        >
                          {/* Up Arrow */}
                          <button
                            onClick={() => scrollLetter(i, 'up')}
                            disabled={success}
                            className={`absolute top-0 left-0 right-0 h-3 md:h-4 flex items-center justify-center text-[10px] md:text-xs transition-colors z-10 ${
                              success ? 'text-green-500 active:bg-green-500/30 md:hover:bg-green-500/20' :
                              'text-red-500 active:bg-red-500/30 md:hover:bg-red-500/20'
                            }`}
                          >
                            ▲
                          </button>

                          {/* Letter Display with smooth scroll */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="relative h-full w-full overflow-hidden">
                              <motion.div
                                className="absolute inset-0 flex flex-col items-center"
                                animate={{ y: `calc(50% - ${currentIndex * 56}px)` }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                              >
                                {/* Show letters in a loop for smooth scrolling */}
                                {[...letters, ...letters].map((letter, idx) => (
                                  <div
                                    key={idx}
                                    className={`h-14 md:h-16 w-10 md:w-12 flex items-center justify-center text-xl md:text-2xl font-mono font-bold transition-all duration-200 ${
                                      idx === currentIndex ?
                                        (success ? 'text-green-500 scale-110' : 'text-red-500 scale-110') :
                                        (success ? 'text-green-500/30' : 'text-red-500/30')
                                    }`}
                                  >
                                    {letter}
                                  </div>
                                ))}
                              </motion.div>
                            </div>
                          </div>

                          {/* Down Arrow */}
                          <button
                            onClick={() => scrollLetter(i, 'down')}
                            disabled={success}
                            className={`absolute bottom-0 left-0 right-0 h-3 md:h-4 flex items-center justify-center text-[10px] md:text-xs transition-colors z-10 ${
                              success ? 'text-green-500 active:bg-green-500/30 md:hover:bg-green-500/20' :
                              'text-red-500 active:bg-red-500/30 md:hover:bg-red-500/20'
                            }`}
                          >
                            ▼
                          </button>

                          {/* Center indicator line */}
                          <div className={`absolute top-1/2 left-0 right-0 h-0.5 pointer-events-none ${
                            success ? 'bg-green-500/50' : 'bg-red-500/50'
                          }`}></div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Status text */}
                <div className="text-center">
                  {success ? (
                    <>
                      <div className="text-green-500 font-mono font-bold text-lg md:text-xl tracking-wider mb-1 animate-pulse">
                        ACCESS GRANTED
                      </div>
                      <div className="text-green-400/60 font-mono text-[10px] md:text-xs tracking-widest">
                        REDIRECTING...
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-red-500 font-mono font-bold text-lg md:text-xl tracking-wider mb-1">
                        UNLOCK CODE
                      </div>
                      <div className="text-red-400/60 font-mono text-[10px] md:text-xs tracking-widest">
                        CLICK, SCROLL OR SWIPE
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Corner details */}
              <div className={`absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 ${
                success ? 'border-green-400/50' : 'border-red-400/50'
              }`}></div>
              <div className={`absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 ${
                success ? 'border-green-400/50' : 'border-red-400/50'
              }`}></div>
              <div className={`absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 ${
                success ? 'border-green-400/50' : 'border-red-400/50'
              }`}></div>
              <div className={`absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 ${
                success ? 'border-green-400/50' : 'border-red-400/50'
              }`}></div>
            </div>
          </div>

          {/* Status indicator */}
          <div className="text-center mt-6 font-mono text-red-500/70 text-xs">
            <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
            {success ? 'AUTHORIZATION SUCCESSFUL' : 'SECURE CONNECTION ESTABLISHED'}
          </div>
        </motion.div>

        {/* Footer warning */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute bottom-8 text-center font-mono text-red-500/40 text-xs"
        >
          <p>⚠ UNAUTHORIZED ACCESS PROHIBITED ⚠</p>
          <p className="mt-1">SYSTEM MONITORED // ALL ACTIVITIES LOGGED</p>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes matrix {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100vh);
          }
        }

        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }

        @keyframes typing {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        .animate-matrix {
          animation: matrix linear infinite;
        }

        .animate-scan {
          animation: scan 3s linear infinite;
        }

        .typing-animation {
          overflow: hidden;
          white-space: nowrap;
          animation: typing 2s steps(30, end) infinite;
        }

        .glitch {
          text-shadow:
            2px 2px 0 rgba(239, 68, 68, 0.3),
            -2px -2px 0 rgba(239, 68, 68, 0.3);
          animation: glitch 3s infinite;
        }

        @keyframes glitch {
          0%, 90%, 100% {
            text-shadow:
              2px 2px 0 rgba(239, 68, 68, 0.3),
              -2px -2px 0 rgba(239, 68, 68, 0.3);
          }
          95% {
            text-shadow:
              5px 0 0 rgba(239, 68, 68, 0.5),
              -5px 0 0 rgba(239, 68, 68, 0.5);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        .animate-shake {
          animation: shake 0.5s;
        }
      `}</style>
    </div>
  );
};

export default EventPage;




