'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import slush from "../../../assets/th.svg"

const EventPage = () => {

  return (
    <div className="min-h-screen bg-linear-to-b from-[#1a4d4d] to-black flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-3xl w-full text-center space-y-8 sm:space-y-12">
        {/* SLUSH Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center"
        >
          <a
            href="https://teloshouse.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-80"
          >
            <Image
              src={slush}
              alt="SLUSH"
              width={200}
              height={80}
              className="w-48 sm:w-64 md:w-80"
              priority
            />
          </a>
        </motion.div>

        {/* Event Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-white  text-lg sm:text-base md:text-lg lg:text-xl leading-relaxed">
            We've travelled across Europe to get here, and now we're opening our doors to those who are investing in change, building tools that challenge the status quo, and pushing the world forward. If this sounds like you, head to the link below and join the waitlist. See you there.
          </p>
        </motion.div>

        {/* Register Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <a
            href="https://luma.com/dopzdpa1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 sm:px-8 sm:py-4 bg-white text-black font-mono font-semibold text-base sm:text-lg rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200"
          >
            Register
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default EventPage;




