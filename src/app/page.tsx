"use client";

import Image from "next/image";
import vice from "../../assets/vicelogo.svg";
import slush from "../../assets/slush.svg";
import supercell from "../../assets/supercell.svg";
import BackgroundMap from "@/components/BackgroundMap";
import { useEffect } from "react";
import cloud from "../../assets/cloud.svg"
import openai from "../../assets/openai.svg"
import stix from "../../assets/stix3.svg"

export default function Home() {
  useEffect(() => {
    const observers = new Map();

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in-visible");
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    });

    const elements = document.querySelectorAll(".animate-fade-in-scroll");
    elements.forEach((el) => {
      observer.observe(el);
      observers.set(el, observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return (
    <>
      <BackgroundMap />
      <div className="min-h-screen text-white font-inter p-4 sm:p-6 md:p-8 lg:p-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="p-4 sm:p-6 md:p-8 lg:p-10">
            {/* Hero Section */}
            <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 animate-fade-in-scroll">
              <div className="text-center max-w-5xl w-full">
                <h1 className="font-heming-variable text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-normal mb-6 sm:mb-8 md:mb-10 lg:mb-12 leading-[1.1] sm:leading-tight drop-shadow-[0_4px_20px_rgba(0,0,0,1)] [text-shadow:2px_2px_8px_rgb(0_0_0/100%),-2px_-2px_8px_rgb(0_0_0/100%),2px_-2px_8px_rgb(0_0_0/100%),-2px_2px_8px_rgb(0_0_0/100%)]">
                  Telos Road Trip: <br />
                  London To Slush
                </h1>
              </div>
            </div>

            {/* What is This Section */}
            <div className="flex items-center justify-center py-12 sm:py-16 ">
              <div className="bg-black/40 p-6 sm:p-8 md:p-10 lg:p-12 border border-white/20 w-full max-w-6xl animate-fade-in-scroll shadow-[0_8px_32px_rgba(0,0,0,0.8)]">
                <h2 className="font-bebas-neue text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-wider mb-6 sm:mb-8 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] text-center">
                 THE TECH PILGRIMAGE ACROSS EUROPE 
                </h2>
                <div className="space-y-4 sm:space-y-6 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] text-center px-2 sm:px-4">
                  <p className="leading-relaxed">
                  Telos House is taking a bus of ~30 founders from London to Helsinki, picking up operators and VCs across Europe on the way.
                  </p>
                  <p className="leading-relaxed">
                  We’ll visit the centres of European innovation, before our final stop at the Slush conference.
                  </p>
                </div>
                <div className="mt-8 sm:mt-10 text-center px-2">
                  <a
                    href="/track"
                    className="inline-block bg-white hover:bg-white/90 text-black px-5 sm:px-8 md:px-12 lg:px-16 py-3 sm:py-4 md:py-5 lg:py-6 font-bold tracking-widest transition-all duration-200 text-xs sm:text-sm md:text-base lg:text-xl xl:text-2xl cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.5)] w-full sm:w-auto max-w-md"
                  >
                    TRACK THE CARAVAN LIVE →
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-12 sm:space-y-20 py-12 sm:py-16 text-center">
              <div className="animate-fade-in-scroll bg-black/40 p-5 sm:p-8 md:p-10 lg:p-12 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.8)]">
                <div className="font-bebas-neue text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-wider mb-6 sm:mb-8 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] text-center">
                  PARTNERS
                </div>
                <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-16 items-center px-2">
                  <a
                    href="https://vice.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-all hover:scale-105"
                  >
                    <Image
                      src={vice}
                      alt="VICE NEWS"
                      className="h-8 sm:h-10 md:h-12 lg:h-14 xl:h-16 w-auto"
                    />
                  </a>
                  <a
                    href="https://slush.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-all hover:scale-105"
                  >
                    <Image
                      src={slush}
                      alt="SLUSH"
                      className="h-8 sm:h-10 md:h-12 lg:h-14 xl:h-16 w-auto"
                    />
                  </a>

                   <a
                    href="https://cloud.google.com/?hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-all hover:scale-105"
                  >
                    <Image
                      src={cloud}
                      alt="google cloud"
                      className="h-8 sm:h-10 md:h-12 lg:h-14 xl:h-16 w-auto"
                    />
                  </a>
              
                <a
                  href="https://stix.co/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-all hover:scale-105"
                >
                  <Image
                    src={stix}
                    alt="stix"
                    className="h-8 sm:h-10 md:h-12 lg:h-14 xl:h-16 w-auto"
                  />
                </a>
                

                
                </div>

                <div className="mt-8 sm:mt-10 text-center px-2">
                  <a
                    href="mailto:team@teloshouse.com?subject=Sponsorship"
                    className="inline-block bg-white hover:bg-white/90 text-black px-5 sm:px-8 md:px-12 lg:px-16 py-3 sm:py-4 md:py-5 lg:py-6 font-bold tracking-widest transition-all duration-200 text-xs sm:text-sm md:text-base lg:text-xl xl:text-2xl cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.5)] w-full sm:w-auto max-w-md"
                  >
                    BECOME A SPONSOR
                  </a>
                </div>
              </div>

              <div className="animate-fade-in-scroll bg-black/40 p-5 sm:p-8 md:p-10 lg:p-12 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.8)]">
                <div className="font-heming-variable text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-wider mb-4 sm:mb-6 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] text-center">
                  THE ROUTE
                </div>
                <div className="relative drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] max-w-2xl mx-auto px-2">
                  {/* Route Visualization */}
                  <div className="space-y-1 sm:space-y-1.5">
                    {/* London */}
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                      <div className="flex flex-col items-center min-w-4 sm:min-w-5">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-white border-2 border-white"></div>
                        <div className="w-0.5 h-5 sm:h-8 md:h-10 bg-white/70"></div>
                      </div>
                      <span className="text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-lg font-bold leading-tight text-white">
                        TELOS HQ, KINGS CROSS, LONDON
                      </span>
                    </div>

                    {/* Antwerp */}
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                      <div className="flex flex-col items-center min-w-4 sm:min-w-5">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full border-2 border-white bg-black"></div>
                        <div className="w-0.5 h-5 sm:h-8 md:h-10 bg-white/70"></div>
                      </div>
                      <span className="text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-lg text-white">
                        ANTWERP
                      </span>
                    </div>

                    {/* Berlin */}
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                      <div className="flex flex-col items-center min-w-4 sm:min-w-5">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full border-2 border-white bg-black"></div>
                        <div className="w-0.5 h-5 sm:h-8 md:h-10 bg-white/70"></div>
                      </div>
                      <span className="text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-lg text-white">
                        BERLIN
                      </span>
                    </div>

                    {/* Warsaw */}
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                      <div className="flex flex-col items-center min-w-4 sm:min-w-5">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full border-2 border-white bg-black"></div>
                        <div className="w-0.5 h-5 sm:h-8 md:h-10 bg-white/70"></div>
                      </div>
                      <span className="text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-lg text-white">
                        WARSAW
                      </span>
                    </div>

                    {/* Riga */}
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                      <div className="flex flex-col items-center min-w-4 sm:min-w-5">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full border-2 border-white bg-black"></div>
                        <div className="w-0.5 h-5 sm:h-8 md:h-10 bg-white/70"></div>
                      </div>
                      <span className="text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-lg text-white">
                        RIGA
                      </span>
                    </div>

                    {/* Tallinn */}
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                      <div className="flex flex-col items-center min-w-4 sm:min-w-5">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full border-2 border-white bg-black"></div>
                        <div className="w-0.5 h-5 sm:h-8 md:h-10 bg-white/70"></div>
                      </div>
                      <span className="text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-lg text-white">
                        TALLINN
                      </span>
                    </div>

                    {/* Helsinki - Final destination */}
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                      <div className="flex flex-col items-center min-w-4 sm:min-w-5">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-white border-2 border-white"></div>
                      </div>
                      <span className="text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-lg font-bold text-white">
                        HELSINKI
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 py-12 sm:py-16 text-center px-4">
              <div className="animate-fade-in-scroll">
                <div className="font-heming-variable text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-wider mb-6 sm:mb-8 drop-shadow-[0_4px_20px_rgba(0,0,0,1)] [text-shadow:2px_2px_8px_rgb(0_0_0/100%),-2px_-2px_8px_rgb(0_0_0/100%),2px_-2px_8px_rgb(0_0_0/100%),-2px_2px_8px_rgb(0_0_0/100%)]">
                  Contact
                </div>
                <div className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl drop-shadow-[0_4px_20px_rgba(0,0,0,1)] [text-shadow:1px_1px_6px_rgb(0_0_0/100%),-1px_-1px_6px_rgb(0_0_0/100%),1px_-1px_6px_rgb(0_0_0/100%),-1px_1px_6px_rgb(0_0_0/100%)] break-all sm:break-normal">
                  <a
                    href="mailto:team@teloshouse.com"
                    className="hover:text-gray-300 transition-colors underline font-heming-variable"
                  >
                    team@teloshouse.com
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-4 sm:mt-6 pb-6 text-[10px] xs:text-xs sm:text-sm md:text-base text-white/70 flex flex-col md:flex-row justify-center gap-1 sm:gap-2 md:gap-4 text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] animate-fade-in-scroll px-4">
              <div>DOC_REV: 1.0</div>
              <div>ISSUED: NOV 2025</div>
              <div>AUTHORITY: TELOS_HOUSE</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
