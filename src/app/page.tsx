import Image from "next/image";
import vice from "../../assets/vicenews.svg";
import slush from "../../assets/slush.svg";
import supercell from "../../assets/supercell.svg";

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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <div className="text-sm text-red-500">DOCUMENT ID:</div>
                  <div className="text-base md:text-lg font-bold">
                    SLUSH-2025-CARAVAN
                  </div>
                </div>
                <div>
                  <div className="text-sm text-red-500">CLASSIFICATION:</div>
                  <div className="text-base md:text-lg font-bold text-red-500">
                    TOP SECRET
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-red-500">OPERATION NAME:</div>
              <div className="text-lg md:text-2xl font-bold">
                &gt; TELOS CARAVAN TO SLUSH
              </div>
            </div>
            <div className="mt-6">
              <a
                href="/track"
                className="block w-full border-2 border-red-500 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-black py-4 text-center font-bold tracking-widest transition-all duration-200 text-sm md:text-base cursor-pointer group"
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-red-500 group-hover:text-black">▶</span>
                  <span>CLICK TO ACCESS LIVE TRACKING</span>
                  <span className="text-red-500 group-hover:text-black">◀</span>
                </div>
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-red-500 text-sm mb-1 tracking-wider">
                [SECTION 1: MISSION BRIEF]
              </div>
              <div className="pl-4 text-xs md:text-sm leading-relaxed">
                <p>
                  assemble europe’s brightest founders. fuel a 40hr odyssey from
                  london to helsinki. infiltrate slush and make history.
                </p>
              </div>
            </div>

            <div>
              <div className="text-red-500 text-sm mb-1 tracking-wider">
                [SECTION 2: OBJECTIVES]
              </div>
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
              <div className="text-red-500 text-sm mb-1 tracking-wider">
                [SECTION 3: PARTNERS]
              </div>
              <div className="pl-4 flex flex-wrap gap-6 items-center">
                <a
                  href="https://vice.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/50 px-4 py-3 transition-colors"
                >
                  <Image
                    src={vice}
                    alt="VICE NEWS"
                    className="h-6 md:h-8 w-auto"
                  />
                </a>
                <a
                  href="https://slush.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/50 px-4 py-3 transition-colors"
                >
                  <Image
                    src={slush}
                    alt="SLUSH"
                    className="h-6 md:h-8 w-auto"
                  />
                </a>
                {/* Supercell Logo 
                <a
                  href="https://supercell.com/en/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/50 px-4 py-3 transition-colors"
                >
                  <Image
                    src={supercell}
                    alt="SUPERCELL"
                    className="h-6 md:h-8 w-auto"
                  />
                </a>
                */}
              </div>
            </div>

            <div>
              <div className="text-red-500 text-sm mb-1 tracking-wider">
                [SECTION 4: ROUTE DETAILS]
              </div>
              <div className="pl-2 md:pl-4 relative">
                {/* Train Route Visualization */}
                <div className="space-y-0">
                  {/* London */}
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="flex flex-col items-center min-w-3 md:min-w-4">
                      <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-red-500 border-2 border-red-500"></div>
                      <div className="w-0.5 h-6 md:h-8 bg-red-500/50"></div>
                    </div>
                    <span className="text-xs md:text-sm font-bold leading-tight">
                      TELOS HQ, KINGS CROSS, LONDON
                    </span>
                  </div>

                  {/* Zurich */}
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="flex flex-col items-center min-w-3 md:min-w-4">
                      <div className="w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-red-500 bg-black"></div>
                      <div className="w-0.5 h-6 md:h-8 bg-red-500/50"></div>
                    </div>
                    <span className="text-xs md:text-sm">ZURICH</span>
                  </div>

                  {/* Liechtenstein */}
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="flex flex-col items-center min-w-3 md:min-w-4">
                      <div className="w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-red-500 bg-black"></div>
                      <div className="w-0.5 h-6 md:h-8 bg-red-500/50"></div>
                    </div>
                    <span className="text-xs md:text-sm">LIECHTENSTEIN</span>
                  </div>

                  {/* Munich */}
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="flex flex-col items-center min-w-3 md:min-w-4">
                      <div className="w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-red-500 bg-black"></div>
                      <div className="w-0.5 h-6 md:h-8 bg-red-500/50"></div>
                    </div>
                    <span className="text-xs md:text-sm">MUNICH</span>
                  </div>

                  {/* Berlin */}
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="flex flex-col items-center min-w-3 md:min-w-4">
                      <div className="w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-red-500 bg-black"></div>
                      <div className="w-0.5 h-6 md:h-8 bg-red-500/50"></div>
                    </div>
                    <span className="text-xs md:text-sm">BERLIN</span>
                  </div>

                  {/* Stockholm */}
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="flex flex-col items-center min-w-3 md:min-w-4">
                      <div className="w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-red-500 bg-black"></div>
                      <div className="w-0.5 h-6 md:h-8 bg-red-500/50"></div>
                    </div>
                    <span className="text-xs md:text-sm">STOCKHOLM</span>
                  </div>

                  {/* Helsinki - Final destination */}
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="flex flex-col items-center min-w-3 md:min-w-4">
                      <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-red-500 border-2 border-red-500"></div>
                    </div>
                    <span className="text-xs md:text-sm font-bold">HELSINKI</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="text-red-500 text-sm mb-1 tracking-wider">
                [SECTION 5: CONTACT]
              </div>
              <div className="pl-4 text-xs md:text-sm">
                <div className="flex gap-2">
                  <span className="text-red-500">&gt;</span>
                  <a
                    href="mailto:team@teloshouse.com"
                    className="hover:text-red-300 transition-colors underline"
                  >
                    team@teloshouse.com
                  </a>
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
