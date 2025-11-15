'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import Image from 'next/image';
import slush from "../../assets/slush.svg"
import { TRACKERS, getTrackerColor } from '../config/trackers';

interface Location {
  name: string;
  coords: [number, number];
  type: 'waypoint' | 'destination';
}

interface TrackerLocation {
  trackerId: string;
  location: {
    latitude: number;
    longitude: number;
    timestamp: number;
  };
  stale: boolean;
}

export default function RoadTripMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState('Waiting for trackers to launch...');
  const [trackerLocations, setTrackerLocations] = useState<TrackerLocation[]>([]);
  const [trackerAddresses, setTrackerAddresses] = useState<Map<string, string>>(new Map());
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [timeSinceUpdate, setTimeSinceUpdate] = useState<string>('');
  const [countdown, setCountdown] = useState<string>('');
  const [countdownExpired, setCountdownExpired] = useState(false);
  const [finalCountdown, setFinalCountdown] = useState<number | null>(null);
  const [showCodeEntry, setShowCodeEntry] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [code, setCode] = useState(['', '', '', '']);
  const [isStale, setIsStale] = useState(false);
  const [isRouteExpanded, setIsRouteExpanded] = useState(false);
  const [isTrackerExpanded, setIsTrackerExpanded] = useState(false);
  const trackerMarkersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  const lastAddressLookup = useRef<Map<string, number>>(new Map());
  const lastAddressCoords = useRef<Map<string, [number, number]>>(new Map());

  const departureDate = new Date('2025-11-15T02:00:00')

  const routeLocations: Location[] = [
    { name: 'Antwerp, Belgium', coords: [4.4025, 51.2194], type: 'waypoint' },
    { name: 'Berlin, Germany', coords: [13.4050, 52.5200], type: 'waypoint' },
    { name: 'Copenhagen, Denmark', coords: [12.5683, 55.6761], type: 'waypoint' },
    { name: 'Stockholm, Sweden', coords: [18.0686, 59.3293], type: 'waypoint' },
    { name: 'Helsinki, Finland', coords: [24.9384, 60.1699], type: 'destination' },
  ];

  useEffect(() => {
    const fetchSharedLocation = async () => {
      try {
        const response = await fetch('/api/location');

        if (response.ok) {
          const data = await response.json();
          if (data.trackers && data.trackers.length > 0) {
            setTrackerLocations(data.trackers);
            // Update last update time from the most recent tracker
            const mostRecent = data.trackers.reduce((latest: TrackerLocation, current: TrackerLocation) =>
              current.location.timestamp > latest.location.timestamp ? current : latest
            );
            setLastUpdate(new Date(mostRecent.location.timestamp));
            setIsStale(data.trackers.some((t: TrackerLocation) => t.stale));

            // Update location status
            const activeCount = data.trackers.filter((t: TrackerLocation) => !t.stale).length;
            setCurrentLocation(`${activeCount} of ${TRACKERS.length} trackers active`);
          } else {
            setTrackerLocations([]);
            setCurrentLocation('Waiting for trackers to launch...');
            setIsStale(false);
          }
        } else {
          setTrackerLocations([]);
          setCurrentLocation('Waiting for trackers to launch...');
          setIsStale(false);
        }
      } catch (error) {
        console.error('Failed to fetch location:', error);
        setCurrentLocation('Unable to fetch location');
        setIsStale(false);
      }
    };

    fetchSharedLocation();

    const interval = setInterval(fetchSharedLocation, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!lastUpdate) return;

    const updateTimeAgo = () => {
      const seconds = Math.floor((Date.now() - lastUpdate.getTime()) / 1000);
      if (seconds < 5) {
        setTimeSinceUpdate('just now');
      } else if (seconds < 60) {
        setTimeSinceUpdate(`${seconds}s ago`);
      } else {
        const minutes = Math.floor(seconds / 60);
        setTimeSinceUpdate(`${minutes}m ago`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 1000);

    return () => clearInterval(interval);
  }, [lastUpdate]);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = departureDate.getTime() - now;

      if (distance < 0) {
        setCountdownExpired(true);
        setFinalCountdown(null);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Show 3-2-1 countdown when 3 seconds or less remain
      if (days === 0 && hours === 0 && minutes === 0 && seconds <= 3 && seconds > 0) {
        setFinalCountdown(seconds);
      } else {
        setFinalCountdown(null);
      }

      setCountdown(`${days}D ${hours}H ${minutes}M ${seconds}S`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [departureDate]);

  useEffect(() => {
    let css: HTMLLinkElement | null = null;
    if (!document.querySelector('link[data-maplibre-css]')) {
      css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = 'https://unpkg.com/maplibre-gl/dist/maplibre-gl.css';
      css.setAttribute('data-maplibre-css', 'true');
      document.head.appendChild(css);
    }

    map.current = new maplibregl.Map({
      container: mapContainer.current!,
      style: {
        version: 8,
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: [
              'https://a.tile.opentopomap.org/{z}/{x}/{y}.png',
              'https://b.tile.opentopomap.org/{z}/{x}/{y}.png',
              'https://c.tile.opentopomap.org/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap',
          },
        },
        layers: [
          {
            id: 'base',
            type: 'raster',
            source: 'raster-tiles',
            paint: {
              'raster-saturation': -1,
              'raster-brightness-min': 0.5,
              'raster-brightness-max': 0.3,
              'raster-contrast': 0.8,
            },
          },
        ],
      },
      center: [13, 54],
      zoom: 4.5,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      addRoute();
      addMarkers();
      setIsLoading(false);
    });

    map.current.on('error', (e) => {
      console.error('Map error:', e);
      setIsLoading(false);
    });

    // Fallback timeout in case load event never fires
    const loadTimeout = setTimeout(() => {
      if (map.current && isLoading) {
        console.warn('Map load timeout, forcing initialization');
        addRoute();
        addMarkers();
        setIsLoading(false);
      }
    }, 5000);

    return () => {
      clearTimeout(loadTimeout);
      map.current?.remove();
      if (css && css.parentNode) css.parentNode.removeChild(css);
    };
  }, []);

  const addRoute = () => {
    if (!map.current) return;
    const coords = routeLocations.map((r) => r.coords);

    map.current.addSource('route', {
      type: 'geojson',
      data: { type: 'Feature', geometry: { type: 'LineString', coordinates: coords }, properties: {} },
    });

    map.current.addLayer({
      id: 'route-line',
      type: 'line',
      source: 'route',
      paint: {
        'line-color': '#ef4444',
        'line-width': 2,
        'line-dasharray': [4, 4],
        'line-opacity': 0.7,
      },
    });
  };

  const addMarkers = () => {
    if (!map.current) return;

    routeLocations.forEach((loc) => {
      const container = document.createElement('div');
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.alignItems = 'center';
      container.style.gap = '4px';

      const label = document.createElement('div');
      label.textContent = loc.name;
      label.style.fontSize = '10px';
      label.style.fontWeight = 'bold';
      label.style.color = '#ff0000';
      label.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      label.style.padding = '2px 6px';
      label.style.borderRadius = '4px';
      label.style.border = '1px solid #ff0000';
      label.style.whiteSpace = 'nowrap';
      label.style.fontFamily = 'monospace';
      label.style.textShadow = '0 0 10px #ff0000';

      const dot = document.createElement('div');
      dot.style.width = loc.type === 'destination' ? '22px' : '16px';
      dot.style.height = loc.type === 'destination' ? '22px' : '16px';
      dot.style.background = '#ff0000';
      dot.style.borderRadius = '50%';
      dot.style.boxShadow = '0 0 15px #ff0000';
      dot.style.border = '2px solid #000';

      container.appendChild(label);
      container.appendChild(dot);

      new maplibregl.Marker({ element: container, anchor: 'bottom' })
        .setLngLat(loc.coords)
        .setPopup(new maplibregl.Popup().setText(loc.name))
        .addTo(map.current!);
    });
  };

  useEffect(() => {
    if (!map.current || trackerLocations.length === 0) return;

    // Remove markers for trackers that no longer exist
    trackerMarkersRef.current.forEach((marker, trackerId) => {
      if (!trackerLocations.some(t => t.trackerId === trackerId)) {
        marker.remove();
        trackerMarkersRef.current.delete(trackerId);
      }
    });

    // Update or create markers for each tracker
    trackerLocations.forEach((tracker) => {
      const coords: [number, number] = [
        tracker.location.longitude,
        tracker.location.latitude,
      ];

      const color = getTrackerColor(tracker.trackerId);
      const trackerConfig = TRACKERS.find(t => t.id === tracker.trackerId);
      const label = trackerConfig?.label || tracker.trackerId;

      // Remove existing marker if it exists
      const existingMarker = trackerMarkersRef.current.get(tracker.trackerId);
      if (existingMarker) {
        existingMarker.remove();
      }

      // Create marker container with label
      const container = document.createElement('div');
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.alignItems = 'center';
      container.style.gap = '4px';

      // Add tracker label above the marker
      const labelDiv = document.createElement('div');
      labelDiv.textContent = label;
      labelDiv.style.fontSize = '10px';
      labelDiv.style.fontWeight = 'bold';
      labelDiv.style.color = color;
      labelDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      labelDiv.style.padding = '2px 6px';
      labelDiv.style.borderRadius = '4px';
      labelDiv.style.border = `1px solid ${color}`;
      labelDiv.style.whiteSpace = 'nowrap';
      labelDiv.style.fontFamily = 'monospace';
      labelDiv.style.textShadow = `0 0 10px ${color}`;

      // Create marker with animated rings
      const markerContainer = document.createElement('div');
      markerContainer.style.position = 'relative';
      markerContainer.style.width = '20px';
      markerContainer.style.height = '20px';

      const outerRing = document.createElement('div');
      outerRing.style.position = 'absolute';
      outerRing.style.top = '50%';
      outerRing.style.left = '50%';
      outerRing.style.width = '40px';
      outerRing.style.height = '40px';
      outerRing.style.marginLeft = '-20px';
      outerRing.style.marginTop = '-20px';
      outerRing.style.border = `2px solid ${color}`;
      outerRing.style.borderRadius = '50%';
      outerRing.style.animation = 'ripple 2s cubic-bezier(0, 0.2, 0.8, 1) infinite';

      const middleRing = document.createElement('div');
      middleRing.style.position = 'absolute';
      middleRing.style.top = '50%';
      middleRing.style.left = '50%';
      middleRing.style.width = '30px';
      middleRing.style.height = '30px';
      middleRing.style.marginLeft = '-15px';
      middleRing.style.marginTop = '-15px';
      middleRing.style.border = `2px solid ${color}`;
      middleRing.style.borderRadius = '50%';
      middleRing.style.animation = 'ripple 2s cubic-bezier(0, 0.2, 0.8, 1) 0.5s infinite';

      const dot = document.createElement('div');
      dot.style.position = 'absolute';
      dot.style.top = '50%';
      dot.style.left = '50%';
      dot.style.width = '20px';
      dot.style.height = '20px';
      dot.style.marginLeft = '-10px';
      dot.style.marginTop = '-10px';
      dot.style.background = color;
      dot.style.borderRadius = '50%';
      dot.style.boxShadow = `0 0 40px ${color}, 0 0 20px ${color}, 0 0 10px ${color}`;
      dot.style.border = '2px solid #ffffff';
      dot.style.animation = tracker.stale ? 'none' : 'blink 1s step-end infinite';
      dot.style.opacity = tracker.stale ? '0.5' : '1';

      markerContainer.appendChild(outerRing);
      markerContainer.appendChild(middleRing);
      markerContainer.appendChild(dot);

      container.appendChild(labelDiv);
      container.appendChild(markerContainer);

      const marker = new maplibregl.Marker({ element: container, anchor: 'bottom' })
        .setLngLat(coords)
        .addTo(map.current!);

      trackerMarkersRef.current.set(tracker.trackerId, marker);
    });

    // Update route to connect tracker locations to waypoints
    if (map.current.getSource('route')) {
      const trackerCoords = trackerLocations.map(tracker => [
        tracker.location.longitude,
        tracker.location.latitude,
      ]);
      const waypointCoords = routeLocations.map((r) => r.coords);
      const allCoords = [...trackerCoords, ...waypointCoords];

      (map.current.getSource('route') as maplibregl.GeoJSONSource).setData({
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: allCoords },
        properties: {},
      });
    }
  }, [trackerLocations]);

  // Fetch addresses for trackers
  useEffect(() => {
    const fetchAddressForTracker = async (trackerId: string, coords: [number, number]) => {
      const now = Date.now();
      const lastLookup = lastAddressLookup.current.get(trackerId) || 0;

      // Rate limiting: don't lookup more than once per second
      if (now - lastLookup < 1000) return;

      // Check if coordinates changed significantly
      const lastCoords = lastAddressCoords.current.get(trackerId);
      if (lastCoords) {
        const [lastLon, lastLat] = lastCoords;
        const distanceChange = Math.hypot(coords[0] - lastLon, coords[1] - lastLat);
        if (distanceChange < 0.001) return;
      }

      lastAddressLookup.current.set(trackerId, now);
      lastAddressCoords.current.set(trackerId, coords);

      // Try geocoding services
      const services = [
        async () => {
          const response = await fetch(
            `https://corsproxy.io/?${encodeURIComponent(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords[1]}&lon=${coords[0]}&zoom=18&addressdetails=1`
            )}`
          );
          const data = await response.json();

          if (data.address) {
            const parts = [];
            // Build detailed street address
            if (data.address.house_number && data.address.road) {
              parts.push(`${data.address.house_number} ${data.address.road}`);
            } else if (data.address.road) {
              parts.push(data.address.road);
            }

            // Add neighborhood/suburb if available
            if (data.address.suburb || data.address.neighbourhood) {
              const area = data.address.suburb || data.address.neighbourhood;
              parts.push(area);
            }

            // Add city/town
            if (data.address.city || data.address.town || data.address.village) {
              parts.push(data.address.city || data.address.town || data.address.village);
            }

            // Add country
            if (data.address.country) {
              parts.push(data.address.country);
            }

            return parts.join(', ') || data.display_name;
          }
          return data.display_name;
        },
        async () => {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords[1]}&longitude=${coords[0]}&localityLanguage=en`
          );
          const data = await response.json();

          const parts = [];
          if (data.localityInfo?.administrative?.[0]?.name) {
            parts.push(data.localityInfo.administrative[0].name);
          }
          if (data.locality) parts.push(data.locality);
          if (data.city && data.city !== data.locality) parts.push(data.city);
          if (data.principalSubdivision) parts.push(data.principalSubdivision);
          if (data.countryName) parts.push(data.countryName);

          if (parts.length > 0) return parts.join(', ');
          return null;
        },
      ];

      for (const service of services) {
        try {
          const address = await service();
          if (address) {
            setTrackerAddresses(prev => new Map(prev).set(trackerId, address));
            return;
          }
        } catch (error) {
          console.warn('Geocoding failed for tracker:', trackerId, error);
        }
      }

      // Fallback to coordinates
      setTrackerAddresses(prev => new Map(prev).set(trackerId, `${coords[1].toFixed(6)}, ${coords[0].toFixed(6)}`));
    };

    trackerLocations.forEach(tracker => {
      const coords: [number, number] = [tracker.location.longitude, tracker.location.latitude];
      fetchAddressForTracker(tracker.trackerId, coords);
    });
  }, [trackerLocations]);

  const focusOnAllTrackers = () => {
    if (!map.current || trackerLocations.length === 0) return;

    // If there's only one tracker, focus on it
    if (trackerLocations.length === 1) {
      const coords: [number, number] = [
        trackerLocations[0].location.longitude,
        trackerLocations[0].location.latitude,
      ];
      map.current.flyTo({ center: coords, zoom: 12, duration: 1200, essential: true });
      return;
    }

    // Otherwise, fit bounds to show all trackers
    const bounds = new maplibregl.LngLatBounds();
    trackerLocations.forEach(tracker => {
      bounds.extend([tracker.location.longitude, tracker.location.latitude]);
    });
    map.current.fitBounds(bounds, { padding: 100, duration: 1200 });
  };

  const handleCodeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const correctCode = '2030';
    const enteredCode = code.join('');

    if (enteredCode === correctCode) {
      setShowCodeEntry(false);
      setShowWaitlist(true);
      setCode(['', '', '', '']);
    } else {
      alert('Access Denied. Try again!');
      setCode(['', '', '', '']);
    }
  };

  const handleCodeInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 3) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleWaitlistSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Thanks ${name}! You're #${data.position} on the waitlist. We'll be in touch soon!`);
        setShowWaitlist(false);
      } else {
        alert(data.error || 'Failed to join waitlist');
      }
    } catch (error) {
      console.error('Waitlist error:', error);
      alert('Failed to join waitlist. Please try again.');
    }
  };

  const tickerMessages = [
    'CARAVAN TO SLUSH 2025',
    'ROUTE: London → Antwerp → Berlin → Copenhagen → Stockholm → Helsinki',
    'DESTINATION: SLUSH Conference Finland',
    'LIVE TRACKING ACTIVE',
    'Join the adventure of a lifetime',
    'Real-time location updates',
    'Network with founders and innovators',
    'Epic stops along the way',
    'Limited spots available',
  ];

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <div className="absolute top-0 left-0 right-0 bg-red-500 text-black font-mono text-xs sm:text-sm font-bold py-1.5 sm:py-2 overflow-hidden z-50">
        <div className="ticker-content whitespace-nowrap">
          {tickerMessages.map((msg, idx) => (
            <span key={idx} className="inline-block px-4 sm:px-8">
              {msg}
            </span>
          ))}
          {tickerMessages.map((msg, idx) => (
            <span key={`repeat-${idx}`} className="inline-block px-4 sm:px-8">
              {msg}
            </span>
          ))}
        </div>
      </div>

      <div ref={mapContainer} className="w-full h-full" />

      {!countdownExpired && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/95 backdrop-blur-md z-50 pointer-events-none overflow-y-auto py-4">
          <div className="relative w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 my-auto">
            {/* Scanline effect */}
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-red-500/5 to-transparent animate-scanline pointer-events-none"></div>

            {/* Main countdown container */}
            <div className="relative">
              {/* Glitch borders */}
              <div className="absolute -inset-1 bg-linear-to-rrom-red-500 via-red-600 to-red-500 opacity-75 blur-xl animate-pulse"></div>

              <div className="relative bg-black border-2 sm:border-4 border-red-500 shadow-[0_0_30px_rgba(255,0,0,0.4),inset_0_0_30px_rgba(255,0,0,0.1)] sm:shadow-[0_0_50px_rgba(255,0,0,0.5),inset_0_0_50px_rgba(255,0,0,0.1)] p-4 sm:p-8 md:p-12 lg:p-16">
                {/* Header */}
                <div className="text-center mb-4 sm:mb-8 md:mb-12">
                  <div className="text-red-500 font-mono text-[10px] sm:text-xs md:text-sm lg:text-base tracking-[0.2em] sm:tracking-[0.3em] mb-1 sm:mb-2 md:mb-4 animate-pulse">
                    [MISSION BRIEFING]
                  </div>

                  {/* SLUSH Logo */}
                  <div className="flex justify-center mb-3 sm:mb-6 md:mb-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-red-500/20 blur-xl animate-pulse"></div>
                      <Image
                        src={slush}
                        alt="SLUSH"
                        className="relative w-28 sm:w-40 md:w-48 lg:w-52 xl:w-64 h-auto drop-shadow-[0_0_20px_rgba(255,0,0,0.8)] animate-glow"
                      />
                    </div>
                  </div>

                  <div className="text-white font-mono text-base sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl tracking-wide sm:tracking-wider mb-1 sm:mb-2 md:mb-4 drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]">
                    &gt; CARAVAN DEPARTURE
                  </div>
                  <div className="text-red-400 font-mono text-[9px] sm:text-xs md:text-sm lg:text-base tracking-wider sm:tracking-widest wrap-break-word px-2">
                    LONDON → ANTWERP → BERLIN → COPENHAGEN → STOCKHOLM → HELSINKI
                  </div>
                </div>

                {/* Countdown Display */}
                <div className="grid grid-cols-4 gap-1.5 sm:gap-3 md:gap-4 lg:gap-6 xl:gap-8 mb-4 sm:mb-8 md:mb-12">
                  {countdown && [
                    { label: 'DAYS', value: countdown.split(' ')[0]?.replace('D', '') || '00' },
                    { label: 'HOURS', value: countdown.split(' ')[1]?.replace('H', '') || '00' },
                    { label: 'MINUTES', value: countdown.split(' ')[2]?.replace('M', '') || '00' },
                    { label: 'SECONDS', value: countdown.split(' ')[3]?.replace('S', '') || '00' },
                  ].map((unit, idx) => (
                    <div key={idx} className="relative group">
                      {/* Glowing background */}
                      <div className="absolute inset-0 bg-red-500/10 group-hover:bg-red-500/20 transition-all duration-300"></div>

                      {/* Border effect */}
                      <div className="relative border border-red-500 sm:border-2 bg-black/80 p-2 sm:p-4 md:p-6 lg:p-8 shadow-[0_0_15px_rgba(255,0,0,0.3)] sm:shadow-[0_0_30px_rgba(255,0,0,0.3)] group-hover:shadow-[0_0_30px_rgba(255,0,0,0.5)] sm:group-hover:shadow-[0_0_50px_rgba(255,0,0,0.5)] transition-all duration-300">
                        {/* Corner accents */}
                        <div className="absolute top-0 left-0 w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 border-t-2 border-l-2 sm:border-t-4 sm:border-l-4 border-white"></div>
                        <div className="absolute top-0 right-0 w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 border-t-2 border-r-2 sm:border-t-4 sm:border-r-4 border-white"></div>
                        <div className="absolute bottom-0 left-0 w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 border-b-2 border-l-2 sm:border-b-4 sm:border-l-4 border-white"></div>
                        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 border-b-2 border-r-2 sm:border-b-4 sm:border-r-4 border-white"></div>

                        {/* Number */}
                        <div className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-red-500 font-mono text-center mb-1 sm:mb-2 md:mb-3 tracking-tight sm:tracking-wider drop-shadow-[0_0_10px_rgba(255,0,0,1)] sm:drop-shadow-[0_0_20px_rgba(255,0,0,1)] animate-glow">
                          {unit.value.padStart(2, '0')}
                        </div>

                        {/* Label */}
                        <div className="text-[6px] xs:text-[7px] sm:text-[10px] md:text-xs lg:text-sm text-red-400 font-mono text-center tracking-widest sm:tracking-[0.2em] md:tracking-[0.3em]">
                          {unit.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Status Messages */}
                <div className="space-y-1 sm:space-y-2 md:space-y-3 mb-4 sm:mb-6 md:mb-8">
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 bg-red-500 rounded-full animate-ping"></div>
                    <span className="text-red-500 font-mono text-[9px] sm:text-xs md:text-sm lg:text-base tracking-wide sm:tracking-wider">
                      MISSION STATUS: STANDBY
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 font-mono text-[9px] sm:text-xs md:text-sm lg:text-base tracking-wide sm:tracking-wider">
                      SYSTEMS: OPERATIONAL
                    </span>
                  </div>
                  <div className="text-center text-yellow-400 font-mono text-[9px] sm:text-xs md:text-sm lg:text-base tracking-wide sm:tracking-wider animate-pulse px-2">
                    AWAITING DEPARTURE SEQUENCE
                  </div>
                </div>

                {/* Join Button */}
                <div className="flex justify-center pointer-events-auto">
                  <button
                    onClick={() => setShowCodeEntry(true)}
                    className="group relative px-4 sm:px-6 md:px-8 lg:px-12 py-2 sm:py-3 md:py-4 lg:py-5 bg-red-500/20 hover:bg-red-500/30 border border-red-500 sm:border-2 font-mono text-xs sm:text-sm md:text-base lg:text-xl text-red-300 hover:text-red-100 tracking-wider sm:tracking-widest transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(255,0,0,0.3)] sm:shadow-[0_0_30px_rgba(255,0,0,0.3)] hover:shadow-[0_0_40px_rgba(255,0,0,0.6)] sm:hover:shadow-[0_0_50px_rgba(255,0,0,0.6)] overflow-hidden"
                  >
                    <span className="relative z-10">&gt; JOIN_CARAVAN</span>
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-red-500/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Matrix-style falling characters effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-red-500 font-mono text-xs opacity-50 animate-fall"
                  style={{
                    left: `${i * 5}%`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: `${3 + (i % 3)}s`,
                  }}
                >
                  {String.fromCharCode(33 + Math.random() * 94)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {finalCountdown !== null && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/95 z-60 pointer-events-none">
          <div className="relative">
            {/* Pulsing rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-64 h-64 sm:w-96 sm:h-96 md:w-lg md:h-128 rounded-full border-4 border-red-500 animate-ping opacity-75"
                style={{ animationDuration: '1s' }}
              ></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full border-4 border-red-400 animate-ping opacity-50"
                style={{ animationDuration: '1s', animationDelay: '0.2s' }}
              ></div>
            </div>

            {/* Main countdown number */}
            <div className="relative flex items-center justify-center">
              <div
                className="text-[12rem] sm:text-[16rem] md:text-[20rem] lg:text-[24rem] font-black text-red-500 font-mono animate-pulse drop-shadow-[0_0_60px_rgba(255,0,0,1)]"
                style={{
                  textShadow: '0 0 80px rgba(255,0,0,1), 0 0 120px rgba(255,0,0,0.8), 0 0 160px rgba(255,0,0,0.6)',
                  animation: 'countdownPulse 1s ease-in-out'
                }}
              >
                {finalCountdown}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-12 sm:top-14 right-2 sm:right-4 z-40 pointer-events-auto">
        <button
          onClick={() => setShowCodeEntry(true)}
          className={`${countdownExpired ? '' : 'hidden'} relative px-4 py-2.5 sm:px-6 sm:py-3 bg-black/90 hover:bg-black border-2 border-red-500 rounded text-sm sm:text-base text-red-100 hover:text-white transition-all cursor-pointer font-bold whitespace-nowrap font-mono shadow-[0_0_20px_rgba(255,0,0,0.4)] hover:shadow-[0_0_30px_rgba(255,0,0,0.6)] backdrop-blur-sm`}
        >
          <span className="relative z-10">&gt; JOIN THE CARAVAN</span>
        </button>
      </div>

      <div className="pointer-events-none absolute top-28 sm:top-14 left-2 sm:left-4 right-2 sm:right-auto sm:max-w-md">
        <div className="pointer-events-auto bg-black/95 px-3 py-3 sm:px-6 sm:py-4 rounded-lg border-2 border-red-500 shadow-[0_0_30px_rgba(255,0,0,0.3)] font-mono">
          <div className="text-lg sm:text-2xl font-bold text-red-500 mb-2 sm:mb-3 tracking-wider">&gt; TO SLUSH</div>

          <div className="text-xs sm:text-sm text-red-400 mb-3 sm:mb-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-red-500 text-[10px] sm:text-xs">[TRACKED_LOCATIONS]</span>
                <br />
                <span className="text-red-300 text-xs sm:text-sm wrap-break-word">{currentLocation}</span>
                {isStale && (
                  <span className="text-yellow-400 text-[10px] sm:text-xs ml-1">(Some trackers offline)</span>
                )}
              </div>
              {trackerLocations.length > 0 && (
                <button
                  onClick={() => setIsTrackerExpanded(!isTrackerExpanded)}
                  className="sm:hidden text-red-500 transition-transform duration-200"
                  style={{ transform: isTrackerExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  aria-label="Toggle trackers"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </div>
            {trackerLocations.length > 0 && (
              <>
                {/* Display active trackers */}
                <div className={`mt-2 space-y-3 ${isTrackerExpanded ? 'block' : 'hidden sm:block'}`}>
                  {trackerLocations.map(tracker => {
                    const trackerConfig = TRACKERS.find(t => t.id === tracker.trackerId);
                    const label = trackerConfig?.label || tracker.trackerId;
                    const color = trackerConfig?.color || '#ff0000';
                    const address = trackerAddresses.get(tracker.trackerId) || 'Loading address...';
                    const googleMapsUrl = `https://www.google.com/maps?q=${tracker.location.latitude},${tracker.location.longitude}`;

                    return (
                      <div key={tracker.trackerId} className="border border-red-500/20 rounded-md p-2 bg-black/50">
                        <div className="text-[10px] sm:text-xs text-red-500/70 flex items-center gap-2 mb-1">
                          <span
                            className="inline-block w-2 h-2 rounded-full"
                            style={{ backgroundColor: color }}
                          ></span>
                          <span style={{ color }} className="font-bold">{label.toUpperCase()}</span>
                          {tracker.stale && (
                            <span className="text-yellow-400 text-[10px]">(offline)</span>
                          )}
                        </div>
                        <div className="text-[10px] sm:text-xs text-red-300/90 mb-1 ml-4">
                          {address}
                        </div>
                        <div className="text-[9px] sm:text-[10px] text-red-300/50 mb-2 ml-4">
                          {tracker.location.latitude.toFixed(6)}, {tracker.location.longitude.toFixed(6)}
                        </div>
                        <div className="ml-4">
                          <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded text-[9px] sm:text-[10px] text-red-300 hover:text-red-200 transition-colors whitespace-nowrap"
                          >
                            &gt; OPEN_GOOGLE_MAPS
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {lastUpdate && !isStale && (
                  <div className="text-[10px] sm:text-xs text-green-400 mt-1 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <span>LIVE - {timeSinceUpdate}</span>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <button
                    onClick={focusOnAllTrackers}
                    className="inline-flex items-center justify-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded text-[10px] sm:text-xs text-red-300 hover:text-red-200 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    &gt; VIEW_ALL_TRACKERS
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] sm:text-xs text-red-500 tracking-wider">[ROUTE]</div>
            <button
              onClick={() => setIsRouteExpanded(!isRouteExpanded)}
              className="sm:hidden text-red-500 transition-transform duration-200"
              style={{ transform: isRouteExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
              aria-label="Toggle route"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          <div className={`flex-col gap-1.5 text-[10px] sm:text-xs text-red-400 max-h-40 sm:max-h-64 overflow-y-auto ${isRouteExpanded ? 'flex' : 'hidden sm:flex'}`}>
            {routeLocations.map((loc, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full bg-red-500 shrink-0"
                  style={{ boxShadow: '0 0 10px #ff0000' }}
                />
                <span className="truncate">
                  {loc.type === 'destination' ? '> END: ' : '> '}
                  {loc.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm z-50 px-4">
          <div className="bg-black px-4 py-4 sm:px-8 sm:py-6 rounded-lg border-2 border-red-500 shadow-[0_0_40px_rgba(255,0,0,0.4)]">
            <div className="text-sm sm:text-lg font-bold text-red-500 font-mono tracking-wider animate-pulse">
              &gt; INITIALIZING_MAP...
            </div>
          </div>
        </div>
      )}

      {showCodeEntry && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm z-50 p-4">
          <div className="bg-black px-4 py-6 sm:px-8 sm:py-8 rounded-lg border-2 border-red-500 shadow-[0_0_50px_rgba(255,0,0,0.5)] max-w-md w-full">
            <div className="text-lg sm:text-2xl font-bold text-red-500 mb-2 tracking-wider font-mono text-center">
              &gt; ACCESS_CODE
            </div>
            <p className="text-[10px] sm:text-xs text-red-400 mb-4 sm:mb-6 font-mono text-center">
              Enter the 4-digit access code to continue
            </p>

            <form onSubmit={handleCodeSubmit} className="space-y-4 sm:space-y-6">
              <div className="flex justify-center gap-2 sm:gap-3">
                {[0, 1, 2, 3].map((index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={code[index]}
                    onChange={(e) => handleCodeInput(index, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(index, e)}
                    className="w-12 h-12 sm:w-16 sm:h-16 bg-black border-2 border-red-500/50 rounded-lg text-red-300 font-mono text-2xl sm:text-3xl font-bold text-center focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:shadow-[0_0_20px_rgba(255,0,0,0.3)] transition-all"
                    required
                  />
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 sm:py-3 bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500 rounded text-xs sm:text-sm text-red-300 hover:text-red-200 font-bold font-mono tracking-wider transition-all cursor-pointer"
                >
                  &gt; UNLOCK
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCodeEntry(false);
                    setCode(['', '', '', '']);
                  }}
                  className="flex-1 px-4 py-2 sm:py-3 bg-transparent hover:bg-red-500/10 border-2 border-red-500/50 rounded text-xs sm:text-sm text-red-400 hover:text-red-300 font-bold font-mono tracking-wider transition-all cursor-pointer"
                >
                  &gt; CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showWaitlist && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm z-50 p-4 overflow-y-auto">
          <div className="bg-black px-4 py-6 sm:px-8 sm:py-8 rounded-lg border-2 border-red-500 shadow-[0_0_50px_rgba(255,0,0,0.5)] max-w-md w-full my-auto">
            <div className="text-lg sm:text-2xl font-bold text-red-500 mb-2 tracking-wider font-mono text-center">
              &gt; JOIN_CARAVAN
            </div>
            <p className="text-[10px] sm:text-xs text-red-400 mb-4 sm:mb-6 font-mono text-center">
              Sign up to join us on this epic journey to Slush 2025
            </p>

            <form onSubmit={handleWaitlistSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-[10px] sm:text-xs text-red-500 mb-1 font-mono tracking-wider">
                  [NAME]
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-3 py-2 sm:px-4 text-xs sm:text-sm bg-black border border-red-500/50 rounded text-red-300 font-mono focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs text-red-500 mb-1 font-mono tracking-wider">
                  [PHONE_NUMBER]
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full px-3 py-2 sm:px-4 text-xs sm:text-sm bg-black border border-red-500/50 rounded text-red-300 font-mono focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 sm:py-3 bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500 rounded text-xs sm:text-sm text-red-300 hover:text-red-200 font-bold font-mono tracking-wider transition-all cursor-pointer"
                >
                  &gt; SUBMIT
                </button>
                <button
                  type="button"
                  onClick={() => setShowWaitlist(false)}
                  className="flex-1 px-4 py-2 sm:py-3 bg-transparent hover:bg-red-500/10 border-2 border-red-500/50 rounded text-xs sm:text-sm text-red-400 hover:text-red-300 font-bold font-mono tracking-wider transition-all cursor-pointer"
                >
                  &gt; CANCEL
                </button>
              </div>
            </form>

            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-red-500/30">
              <div className="flex justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <a
                  href="https://www.instagram.com/teloshouse/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="https://x.com/TelosHouse"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded transition-colors"
                  aria-label="Twitter"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/company/teloshouse/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
              <div className="text-center">
                <a
                  href="mailto:team@telousehouse.com"
                  className="text-[10px] sm:text-xs text-red-400 hover:text-red-300 font-mono transition-colors break-all"
                >
                  team@telousehouse.com
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes ripple {
          0% {
            opacity: 1;
            transform: scale(0.8);
          }
          100% {
            opacity: 0;
            transform: scale(2);
          }
        }

        @keyframes blink {
          0%, 49% {
            opacity: 1;
            box-shadow: 0 0 40px #ff0000, 0 0 20px #ff0000, 0 0 10px #ff0000;
          }
          50%, 99% {
            opacity: 0.3;
            box-shadow: 0 0 10px #ff0000;
          }
        }

        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes scanline {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }

        @keyframes glow {
          0%, 100% {
            text-shadow: 0 0 20px rgba(255, 0, 0, 1), 0 0 40px rgba(255, 0, 0, 0.8);
          }
          50% {
            text-shadow: 0 0 30px rgba(255, 0, 0, 1), 0 0 60px rgba(255, 0, 0, 1);
          }
        }

        @keyframes countdownPulse {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes fall {
          0% {
            transform: translateY(-100vh);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }

        .ticker-content {
          display: inline-block;
          animation: ticker 30s linear infinite;
        }

        .animate-scanline {
          animation: scanline 8s linear infinite;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .animate-fall {
          animation: fall 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
