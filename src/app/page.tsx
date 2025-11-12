
export default function Home() {
  return (
    <div className="min-h-screen bg-black text-red-400 font-mono p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="border-4 border-red-500 bg-black p-4 md:p-8 shadow-[0_0_50px_rgba(255,0,0,0.3)]">
          <div className="border-2 border-red-500 bg-red-500 text-black text-center py-3 mb-6">
            <div className="text-2xl md:text-4xl font-bold tracking-widest">
              /// Restricted ///
            </div>
            <div className="text-xs md:text-sm mt-1 tracking-wider">
              CLASSIFIED INFORMATION - UNAUTHORIZED ACCESS PROHIBITED
            </div>
          </div>

          <div className="border-b-2 border-red-500/30 pb-6 mb-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
                <div className="flex-1">
                  <div className="text-sm text-red-500">DOCUMENT ID:</div>
                  <div className="text-base md:text-lg font-bold">SLUSH-2025-CARAVAN</div>
                </div>
                <div className="flex-1 md:text-center">
                  <div className="text-sm text-red-500">CLASSIFICATION:</div>
                  <div className="text-base md:text-lg font-bold text-red-500">TOP SECRET</div>
                </div>
                <div className="hidden md:flex justify-end items-center">
                  <a
                    href="/track"
                    className="flex items-center justify-center w-32 h-32 rounded-full bg-red-500 hover:bg-red-600 border-4 border-red-600 text-white hover:text-white text-sm font-bold transition-all shadow-[0_0_40px_rgba(255,0,0,0.6)] hover:shadow-[0_0_60px_rgba(255,0,0,0.9)] hover:scale-105 text-center leading-tight"
                  >
                    TRACK<br />LIVE<br />LOCATION
                  </a>
                </div>
              </div>
              <div className="flex md:hidden justify-center">
                <a
                  href="/track"
                  className="flex items-center justify-center w-28 h-28 rounded-full bg-red-500 hover:bg-red-600 border-4 border-red-600 text-white hover:text-white text-xs font-bold transition-all shadow-[0_0_40px_rgba(255,0,0,0.6)] hover:shadow-[0_0_60px_rgba(255,0,0,0.9)] hover:scale-105 text-center leading-tight"
                >
                  TRACK<br />LIVE<br />LOCATION
                </a>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-red-500">OPERATION NAME:</div>
              <div className="text-lg md:text-2xl font-bold">&gt; TELOS CARAVAN TO SLUSH</div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-red-500 text-sm mb-1 tracking-wider">[SECTION 1: MISSION BRIEF]</div>
              <div className="pl-4 text-xs md:text-sm leading-relaxed">
                <p>
             assemble europe’s brightest founders. fuel a 40hr odyssey from london to helsinki. infiltrate slush and make history.
                </p>
              </div>
            </div>

            <div>
              <div className="text-red-500 text-sm mb-1 tracking-wider">[SECTION 2: OBJECTIVES]</div>
              <div className="pl-4 space-y-1 text-xs md:text-sm">
                <div className="flex gap-2">
                  <span className="text-red-500">&gt;</span>
                  <span>CONQUER EUROPE</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-red-500">&gt;</span>
                  <span>CONQUER THE WORLD&apos;S LARGEST FOUNDER EVENT</span>
                </div>
              </div>
            </div>

            <div>
              <div className="text-red-500 text-sm mb-1 tracking-wider">[SECTION 3: ROUTE DETAILS]</div>
              <div className="pl-4 space-y-1 text-xs md:text-sm">
                <div className="flex gap-2">
                  <span className="text-red-500">&gt;</span>
                  <span>STARTING FROM TELOS HQ, KINGS CROSS, LONDON</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-red-500">&gt;</span>
                  <span>ZURICH</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-red-500">&gt;</span>
                  <span>LIECHTENSTEIN</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-red-500">&gt;</span>
                  <span>MUNICH</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-red-500">&gt;</span>
                  <span>BERLIN</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-red-500">&gt;</span>
                  <span>STOCKHOLM</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-red-500">&gt;</span>
                  <span>HELSINKI</span>
                </div>
              </div>
            </div>

            <div>
              <div className="text-red-500 text-sm mb-1 tracking-wider">[SECTION 4: PARTNERS]</div>
              <div className="pl-4 space-y-1 text-xs md:text-sm">
                <div className="flex gap-2">
                  <span className="text-red-500">&gt;</span>
                  <a href="https://vice.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-300 transition-colors underline">VICE NEWS</a>
                </div>
                <div className="flex gap-2">
                  <span className="text-red-500">&gt;</span>
                  <a href="https://slush.org" target="_blank" rel="noopener noreferrer" className="hover:text-red-300 transition-colors underline">SLUSH</a>
                </div>
              </div>
            </div>

            <div>
              <div className="text-red-500 text-sm mb-1 tracking-wider">[SECTION 5: CONTACT]</div>
              <div className="pl-4 text-xs md:text-sm">
                <div className="flex gap-2">
                  <span className="text-red-500">&gt;</span>
                  <a href="mailto:team@teloshouse.com" className="hover:text-red-300 transition-colors underline">team@teloshouse.com</a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-2 border-red-500 bg-red-500 text-black text-center py-2 mt-6">
            <div className="text-xs md:text-sm font-bold tracking-widest">
              TOP SECRET // SPECIAL ACCESS REQUIRED
            </div>
          </div>

          <div className="mt-4 text-xs text-red-500/50 flex flex-col md:flex-row justify-between gap-2 text-center md:text-left">
            <div>DOC_REV: 1.0</div>
            <div>ISSUED: NOV 2025</div>
            <div>AUTHORITY: TELOS_HOUSE</div>
          </div>
        </div>
      </div>
    </div>
  );
}
