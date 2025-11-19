'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useForm } from '@formspree/react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import TypewriterText from '@/components/TypewriterText';
import SequentialTypewriter from '@/components/SequentialTypewriter';

export default function EventPage() {
  const [currentScreen, setCurrentScreen] = useState<'phone' | 'switchboard' | 'announcement' | 'confirmation'>('phone');
  const [showOptions, setShowOptions] = useState(false);
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [showShutters, setShowShutters] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>('');
  const [submitError, setSubmitError] = useState('');
  const [state, handleSubmit] = useForm('xanvjzwn');

  // Reset showOptions and showPhoneInput when changing screens
  useEffect(() => {
    if (currentScreen === 'switchboard' || currentScreen === 'phone') {
      setShowOptions(false);
    }
    if (currentScreen === 'announcement') {
      setShowPhoneInput(false);
    }
  }, [currentScreen]);

  // Auto-navigate to confirmation if submission succeeded
  useEffect(() => {
    if (state.succeeded && currentScreen === 'announcement') {
      setCurrentScreen('confirmation');
    }
  }, [state.succeeded, currentScreen]);

  // Confirmation screen
  if (currentScreen === 'confirmation') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <SequentialTypewriter 
          lines={[
            'good choice',
            'expect a call at 1600'
          ]}
          speed={50}
          jitter={20}
          delayBetweenLines={1000}
          className="text-white text-xl text-center"
          onDone={() => {
            setTimeout(() => setShowShutters(true), 300);
          }}
        />
        {showShutters && (
          <>
            <div className="shutter shutter-top" />
            <div className="shutter shutter-bottom" />
          </>
        )}
      </div>
    );
  }

  // Announcement screen with phone input
  if (currentScreen === 'announcement') {
    const handlePhoneSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitError('');
      
      try {
        // Submit to Formspree
        const formData = new FormData();
        formData.append('phone', phoneNumber || '');
        formData.append('timestamp', new Date().toISOString());
        
        const result = await handleSubmit(formData as any);
        
        // Check if submission was successful
        if (state.succeeded) {
          // Navigate to confirmation
          setCurrentScreen('confirmation');
        } else if (state.errors) {
          setSubmitError('failed to submit. please try again.');
        }
      } catch (error) {
        setSubmitError('something went wrong. please try again.');
      }
    };

    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-8 max-w-2xl w-full">
          <Image 
            src="/images/phone-removebg-preview.png" 
            alt="Phone"
            width={250}
            height={250}
            priority
          />
          <SequentialTypewriter 
            lines={[
              'congratulations',
              "you've begun the journey",
              'we hope you make the right choices',
              "input your number to continue",
            ]}
            speed={50}
            jitter={20}
            delayBetweenLines={1000}
            className="text-white text-xl text-center"
            onDone={() => {
              setTimeout(() => setShowPhoneInput(true), 1000);
            }}
          />
          {showPhoneInput && (
            <form onSubmit={handlePhoneSubmit} className="flex flex-col items-center gap-4 w-full max-w-md">
              <div className="flex items-center gap-2 w-full">
                <div className="flex-1">
                  <PhoneInput
                    international
                    defaultCountry="US"
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    placeholder="Enter phone number"
                    className="phone-input"
                    name="phone"
                  />
                </div>
                {phoneNumber && phoneNumber.length > 0 && (
                  <button
                    type="submit"
                    disabled={state.submitting}
                    className="text-white text-2xl hover:opacity-70 transition-opacity cursor-pointer disabled:opacity-30"
                  >
                    {state.submitting ? '...' : '→'}
                  </button>
                )}
              </div>
              {submitError && (
                <p className="text-red-500 text-sm">{submitError}</p>
              )}
              {state.errors && !submitError && (
                <p className="text-red-500 text-sm">error submitting form. please try again.</p>
              )}
            </form>
          )}
        </div>
      </div>
    );
  }

  // Switchboard screen with options
  if (currentScreen === 'switchboard') {

    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-8 max-w-2xl w-full">
          <Image 
            src="/images/phone-removebg-preview.png" 
            alt="Phone"
            width={250}
            height={250}
            priority
          />
          <TypewriterText 
            text="welcome to the telos house switchboard, would you like to proceed?"
            speed={50}
            jitter={20}
            className="text-white text-xl text-center"
            onDone={() => {
              setTimeout(() => setShowOptions(true), 800);
            }}
          />
          {showOptions && (
            <div className="grid grid-cols-2 gap-4 w-full">
              <button 
                onClick={() => setCurrentScreen('announcement')}
                className="border border-white text-white px-6 py-4 hover:bg-white hover:text-black transition-colors cursor-pointer"
              >
                yes
              </button>
              <button 
                onClick={() => setCurrentScreen('phone')}
                className="border border-white text-white px-6 py-4 hover:bg-white hover:text-black transition-colors cursor-pointer"
              >
                no
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Phone screen with call button
  if (currentScreen === 'phone') {
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
          <button 
            onClick={() => setCurrentScreen('switchboard')}
            className="border border-white text-white px-8 py-3 hover:bg-white hover:text-black transition-colors cursor-pointer"
          >
            answer the call
          </button>
        </div>
      </div>
    );
  }

}
