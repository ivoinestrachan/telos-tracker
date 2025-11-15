'use client';

import { useState, useEffect } from 'react';
import { TRACKERS } from '../../config/trackers';

interface ActiveTracker {
  trackerId: string;
  stale: boolean;
}

export default function LaunchPage() {
  const [status, setStatus] = useState<'idle' | 'launching' | 'active' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [watchId, setWatchId] = useState<number | null>(null);
  const [selectedTracker, setSelectedTracker] = useState<string>(TRACKERS[0].id);
  const [activeTrackers, setActiveTrackers] = useState<Set<string>>(new Set());

  // Fetch active trackers on mount and periodically
  useEffect(() => {
    const fetchActiveTrackers = async () => {
      try {
        const response = await fetch('/api/location');
        if (response.ok) {
          const data = await response.json();
          if (data.trackers && data.trackers.length > 0) {
            const active = new Set<string>(
              data.trackers
                .filter((t: ActiveTracker) => !t.stale)
                .map((t: ActiveTracker) => t.trackerId)
            );
            setActiveTrackers(active);
          } else {
            setActiveTrackers(new Set<string>());
          }
        }
      } catch (error) {
        console.error('Failed to fetch active trackers:', error);
      }
    };

    fetchActiveTrackers();
    const interval = setInterval(fetchActiveTrackers, 60000); // Poll every 60 seconds (1 minute)

    return () => clearInterval(interval);
  }, []);

  const handleLaunch = () => {
    if (!navigator.geolocation) {
      setStatus('error');
      setMessage('Geolocation not supported');
      return;
    }

    setStatus('launching');
    setMessage('Acquiring location...');

    const id = navigator.geolocation.watchPosition(
      async (position) => {
        const data = {
          trackerId: selectedTracker,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: Date.now(),
        };

        try {
          const response = await fetch('/api/location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });

          if (response.ok) {
            setStatus('active');
            const trackerLabel = TRACKERS.find(t => t.id === selectedTracker)?.label || selectedTracker;
            setMessage(`Sharing ${trackerLabel}: ${data.latitude.toFixed(6)}, ${data.longitude.toFixed(6)}`);
          } else {
            throw new Error('Failed to share location');
          }
        } catch (error) {
          setStatus('error');
          setMessage('Failed to share location');
          console.error(error);
        }
      },
      (error) => {
        setStatus('error');
        setMessage(`Error: ${error.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    setWatchId(id);
  };

  const handleStop = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setStatus('idle');
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-black px-8 py-10 rounded-lg border-2 border-red-500 shadow-[0_0_50px_rgba(255,0,0,0.4)]">
          <div className="text-3xl font-bold text-red-500 mb-6 tracking-wider font-mono text-center">
            &gt; TELOS_LAUNCH
          </div>

          <div className="mb-8 text-center">
            <div className="text-sm text-red-400 mb-2 font-mono">
              [TRACKER_CONTROL]
            </div>
            <p className="text-xs text-red-300/70 font-mono">
              Share your live location with the tracker
            </p>
          </div>

          {/* Tracker Selection */}
          <div className="mb-6">
            <label className="block text-xs text-red-400 mb-2 font-mono">
              SELECT_TRACKER:
            </label>

            {/* Status Summary */}
            {activeTrackers.size > 0 && (
              <div className="mb-3 p-2 bg-green-500/10 border border-green-500/30 rounded text-[10px] text-green-400 font-mono">
                {Array.from(activeTrackers).map(trackerId => {
                  const tracker = TRACKERS.find(t => t.id === trackerId);
                  return tracker ? `${tracker.label.toUpperCase()}` : trackerId;
                }).join(', ')} currently in use
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {TRACKERS.map((tracker) => {
                const isAlreadyActive = activeTrackers.has(tracker.id) && selectedTracker !== tracker.id;
                const isDisabled = (status === 'active' || status === 'launching') || isAlreadyActive;

                return (
                  <button
                    key={tracker.id}
                    onClick={() => !isAlreadyActive && setSelectedTracker(tracker.id)}
                    disabled={isDisabled}
                    className={`py-3 px-4 rounded border-2 font-mono text-xs transition-all ${
                      selectedTracker === tracker.id
                        ? 'border-red-500 bg-red-500/20 text-red-200 shadow-[0_0_15px_rgba(255,0,0,0.3)]'
                        : isAlreadyActive
                        ? 'border-green-500/30 bg-green-500/5 text-green-400/70 opacity-60'
                        : 'border-red-500/30 bg-red-500/5 text-red-400/70 hover:border-red-500/50 hover:bg-red-500/10'
                    } ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    style={{
                      boxShadow: selectedTracker === tracker.id ? `0 0 15px ${tracker.color}40` : undefined,
                      borderColor: selectedTracker === tracker.id ? tracker.color : isAlreadyActive ? '#10b981' : undefined,
                    }}
                  >
                    <div className="flex flex-col items-center justify-center gap-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${isAlreadyActive ? 'animate-pulse' : ''}`}
                          style={{ backgroundColor: isAlreadyActive ? '#10b981' : tracker.color }}
                        ></span>
                        <span style={{ color: isAlreadyActive ? '#10b981' : tracker.color }}>
                          {tracker.label.toUpperCase()}
                        </span>
                      </div>
                      {isAlreadyActive && (
                        <div className="text-[10px] text-green-400 font-bold">
                          IN USE
                        </div>
                      )}
                      {!isAlreadyActive && selectedTracker !== tracker.id && (
                        <div className="text-[10px] text-red-400/50">
                          AVAILABLE
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded border font-mono text-xs ${
              status === 'error'
                ? 'border-red-500/50 bg-red-500/10 text-red-300'
                : status === 'active'
                ? 'border-green-500/50 bg-green-500/10 text-green-300'
                : 'border-yellow-500/50 bg-yellow-500/10 text-yellow-300'
            }`}>
              {message}
            </div>
          )}

          {status === 'idle' || status === 'error' ? (
            <button
              onClick={handleLaunch}
              className="w-full py-4 bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500 rounded text-red-300 hover:text-red-200 font-bold font-mono tracking-wider transition-all hover:shadow-[0_0_20px_rgba(255,0,0,0.5)] cursor-pointer"
            >
              &gt; LAUNCH_TRACKING
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="w-full py-4 bg-yellow-500/20 hover:bg-yellow-500/30 border-2 border-yellow-500 rounded text-yellow-300 hover:text-yellow-200 font-bold font-mono tracking-wider transition-all cursor-pointer"
            >
              &gt; STOP_TRACKING
            </button>
          )}

          {status === 'active' && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 text-xs text-green-400 font-mono">
                <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                BROADCASTING_LIVE
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-xs text-red-500/50 font-mono">
          <p>&gt; ACCESS_GRANTED</p>
          <p>&gt; SECURE_CHANNEL_ACTIVE</p>
        </div>
      </div>
    </div>
  );
}
