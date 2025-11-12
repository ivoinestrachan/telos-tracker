import Image from "next/image";
import vice from "../../assets/vicenews.svg";
import slush from "../../assets/slush.svg";
import supercell from "../../assets/supercell.svg";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-red-400 font-mono p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="border-4 border-red-500 bg-black p-4 md:p-8 shadow-[0_0_50px_rgba(255,0,0,0.3)]">
          <div className="border-2 border-red-500 bg-red-500 text-black text-center py-4 mb-8">
            <div className="text-3xl md:text-5xl font-bold tracking-widest">
              /// Restricted ///
            </div>
            <div className="text-sm md:text-lg mt-2 tracking-wider">
              CLASSIFIED INFORMATION - UNAUTHORIZED ACCESS PROHIBITED
            </div>
          </div>

          {/* WHAT THIS IS - Most Important Info First */}
          <div className="border-b-2 border-red-500/30 pb-8 mb-8">
            <div className="mb-8">
              <div className="text-xl md:text-3xl font-bold mb-6">
                &gt; TELOS CARAVAN TO SLUSH
              </div>
              <div className="text-base md:text-xl leading-relaxed bg-red-500/10 p-6 border-l-4 border-red-500">
                <p className="font-bold mb-4">THIS IS A 80-HOUR JOURNEY:</p>
                <p className="text-lg md:text-2xl">
                  EUROPE&apos;S BRIGHTEST FOUNDERS TRAVELING BY TRAIN FROM LONDON TO HELSINKI FOR SLUSH 2025 - THE WORLD&apos;S LARGEST FOUNDER EVENT
                </p>
              </div>
            </div>

            {/* Live Tracking Button - Second Most Important */}
            <div className="mb-8">
              <a
                href="/track"
                className="block w-full border-2 border-red-500 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-black py-6 text-center font-bold tracking-widest transition-all duration-200 text-lg md:text-2xl cursor-pointer group"
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-red-500 group-hover:text-black text-2xl">▶</span>
                  <span>TRACK THE CARAVAN LIVE</span>
                  <span className="text-red-500 group-hover:text-black text-2xl">◀</span>
                </div>
              </a>
            </div>

            {/* Document Details - Less Important */}
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-base md:text-lg text-red-500">DOCUMENT ID:</div>
                  <div className="text-lg md:text-xl">
                    SLUSH-2025-CARAVAN
                  </div>
                </div>
                <div>
                  <div className="text-base md:text-lg text-red-500">CLASSIFICATION:</div>
                  <div className="text-lg md:text-xl font-bold text-red-500">
                    TOP SECRET
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <div className="text-red-500 text-base md:text-xl mb-4 tracking-wider font-bold">
                [MISSION OBJECTIVES]
              </div>
              <div className="pl-4 space-y-3 text-base md:text-lg">
                <div className="flex gap-3">
                  <span className="text-red-500 text-xl">&gt;</span>
                  <span>CONQUER EUROPE</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-red-500 text-xl">&gt;</span>
                  <span>CONQUER THE WORLD&apos;S LARGEST FOUNDER EVENT</span>
                </div>
              </div>
            </div>

            <div>
              <div className="text-red-500 text-base md:text-xl mb-6 tracking-wider font-bold">
                [PARTNERS]
              </div>
              <div className="bg-red-500/10 border-2 border-red-500/30 p-6 md:p-8">
                <div className="flex flex-wrap justify-center gap-10 md:gap-16 items-center">
                  <a
                    href="https://vice.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/80 px-8 py-6 transition-all hover:scale-105"
                  >
                    <Image
                      src={vice}
                      alt="VICE NEWS"
                      className="h-12 md:h-16 w-auto"
                    />
                  </a>
                  <a
                    href="https://slush.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/80 px-8 py-6 transition-all hover:scale-105"
                  >
                    <Image
                      src={slush}
                      alt="SLUSH"
                      className="h-12 md:h-16 w-auto"
                    />
                  </a>
                  {/* Supercell Logo
                  <a
                    href="https://supercell.com/en/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white px-8 py-6 transition-all hover:scale-105"
                  >
                    <Image
                      src={supercell}
                      alt="SUPERCELL"
                      className="h-12 md:h-16 w-auto"
                    />
                  </a>
                  */}
                </div>
              </div>
            </div>

            <div>
              <div className="text-red-500 text-base md:text-xl mb-4 tracking-wider font-bold">
                [THE ROUTE]
              </div>
              <div className="pl-2 md:pl-4 relative">
                {/* Train Route Visualization */}
                <div className="space-y-2">
                  {/* London */}
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="flex flex-col items-center min-w-4 md:min-w-5">
                      <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-red-500 border-2 border-red-500"></div>
                      <div className="w-0.5 h-14 md:h-16 bg-red-500/50"></div>
                    </div>
                    <span className="text-base md:text-lg font-bold leading-tight">
                      TELOS HQ, KINGS CROSS, LONDON
                    </span>
                  </div>

                  {/* Zurich */}
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="flex flex-col items-center min-w-4 md:min-w-5">
                      <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-red-500 bg-black"></div>
                      <div className="w-0.5 h-14 md:h-16 bg-red-500/50"></div>
                    </div>
                    <span className="text-base md:text-lg">ZURICH</span>
                  </div>

                  {/* Liechtenstein */}
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="flex flex-col items-center min-w-4 md:min-w-5">
                      <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-red-500 bg-black"></div>
                      <div className="w-0.5 h-14 md:h-16 bg-red-500/50"></div>
                    </div>
                    <span className="text-base md:text-lg">LIECHTENSTEIN</span>
                  </div>

                  {/* Munich */}
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="flex flex-col items-center min-w-4 md:min-w-5">
                      <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-red-500 bg-black"></div>
                      <div className="w-0.5 h-14 md:h-16 bg-red-500/50"></div>
                    </div>
                    <span className="text-base md:text-lg">MUNICH</span>
                  </div>

                  {/* Berlin */}
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="flex flex-col items-center min-w-4 md:min-w-5">
                      <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-red-500 bg-black"></div>
                      <div className="w-0.5 h-14 md:h-16 bg-red-500/50"></div>
                    </div>
                    <span className="text-base md:text-lg">BERLIN</span>
                  </div>

                  {/* Stockholm */}
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="flex flex-col items-center min-w-4 md:min-w-5">
                      <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-red-500 bg-black"></div>
                      <div className="w-0.5 h-14 md:h-16 bg-red-500/50"></div>
                    </div>
                    <span className="text-base md:text-lg">STOCKHOLM</span>
                  </div>

                  {/* Helsinki - Final destination */}
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="flex flex-col items-center min-w-4 md:min-w-5">
                      <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-red-500 border-2 border-red-500"></div>
                    </div>
                    <span className="text-base md:text-lg font-bold">HELSINKI</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="text-red-500 text-base md:text-xl mb-4 tracking-wider font-bold">
                [CONTACT]
              </div>
              <div className="pl-4 text-base md:text-lg">
                <div className="flex gap-3">
                  <span className="text-red-500 text-xl">&gt;</span>
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

          <div className="border-2 border-red-500 bg-red-500 text-black text-center py-3 mt-10">
            <div className="text-sm md:text-lg font-bold tracking-widest">
              TOP SECRET // SPECIAL ACCESS REQUIRED
            </div>
          </div>

          <div className="mt-6 text-sm md:text-base text-red-500/50 flex flex-col md:flex-row justify-between gap-2 text-center md:text-left">
            <div>DOC_REV: 1.0</div>
            <div>ISSUED: NOV 2025</div>
            <div>AUTHORITY: TELOS_HOUSE</div>
          </div>
        </div>
      </div>
    </div>
  );
}
