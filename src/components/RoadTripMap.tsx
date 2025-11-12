'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';

interface Location {
  name: string;
  coords: [number, number];
  type: 'waypoint' | 'destination';
}

export default function RoadTripMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState('Waiting for tracker to launch...');
  const [liveCoords, setLiveCoords] = useState<[number, number] | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [timeSinceUpdate, setTimeSinceUpdate] = useState<string>('');
  const [countdown, setCountdown] = useState<string>('');
  const [countdownExpired, setCountdownExpired] = useState(false);
  const [showCodeEntry, setShowCodeEntry] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [code, setCode] = useState(['', '', '', '']);
  const [isStale, setIsStale] = useState(false);
  const [isRouteExpanded, setIsRouteExpanded] = useState(false);
  const currentMarkerRef = useRef<maplibregl.Marker | null>(null);
  const lastAddressLookupTime = useRef(0);
  const lastAddressCoords = useRef<[number, number] | null>(null);

  const departureDate = new Date('2025-11-12T19:00:00');

  const routeLocations: Location[] = [
    { name: 'Brussels, Belgium', coords: [4.3517, 50.8503], type: 'waypoint' },
    { name: 'Zurich, Switzerland', coords: [8.5417, 47.3769], type: 'waypoint' },
    { name: 'Vaduz, Liechtenstein', coords: [9.5215, 47.1410], type: 'waypoint' },
    { name: 'Munich, Germany', coords: [11.5820, 48.1351], type: 'waypoint' },
    { name: 'Berlin, Germany', coords: [13.4050, 52.5200], type: 'waypoint' },
    { name: 'Stockholm, Sweden', coords: [18.0686, 59.3293], type: 'waypoint' },
    { name: 'Helsinki, Finland', coords: [24.9384, 60.1699], type: 'destination' },
  ];

  useEffect(() => {
    const fetchSharedLocation = async () => {
      try {
        const response = await fetch('/api/location');

        if (response.ok) {
          const data = await response.json();
          if (data.location) {
            const coords: [number, number] = [
              data.location.longitude,
              data.location.latitude,
            ];
            setLiveCoords(coords);
            setLastUpdate(new Date(data.location.timestamp));
            setIsStale(data.stale || false);
            updateCurrentLocation(coords);
          }
        } else {
          setCurrentLocation('Waiting for tracker to launch...');
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
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

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
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap contributors',
          },
        },
        layers: [{ id: 'base', type: 'raster', source: 'raster-tiles' }],
      },
      center: [13, 54],
      zoom: 4.5,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      map.current!.setPaintProperty('base', 'raster-saturation', -0.9);
      map.current!.setPaintProperty('base', 'raster-brightness-max', 0.15);
      addRoute();
      addMarkers();
      setIsLoading(false);
    });

    return () => {
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
    if (!map.current || !liveCoords) return;

    currentMarkerRef.current?.remove();

    const container = document.createElement('div');
    container.style.position = 'relative';
    container.style.width = '20px';
    container.style.height = '20px';

    const outerRing = document.createElement('div');
    outerRing.style.position = 'absolute';
    outerRing.style.top = '50%';
    outerRing.style.left = '50%';
    outerRing.style.width = '40px';
    outerRing.style.height = '40px';
    outerRing.style.marginLeft = '-20px';
    outerRing.style.marginTop = '-20px';
    outerRing.style.border = '2px solid #ff0000';
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
    middleRing.style.border = '2px solid #ff0000';
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
    dot.style.background = '#ff0000';
    dot.style.borderRadius = '50%';
    dot.style.boxShadow = '0 0 40px #ff0000, 0 0 20px #ff0000, 0 0 10px #ff0000';
    dot.style.border = '2px solid #ffffff';
    dot.style.animation = 'blink 1s step-end infinite';

    container.appendChild(outerRing);
    container.appendChild(middleRing);
    container.appendChild(dot);

    const marker = new maplibregl.Marker({ element: container, anchor: 'center' })
      .setLngLat(liveCoords)
      .addTo(map.current);

    currentMarkerRef.current = marker;

    if (map.current.getSource('route')) {
      const coords = [liveCoords, ...routeLocations.map((r) => r.coords)];
      (map.current.getSource('route') as maplibregl.GeoJSONSource).setData({
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: coords },
        properties: {},
      });
    }
  }, [liveCoords]);

  const updateCurrentLocation = async (coords: [number, number]) => {
    const now = Date.now();
    if (now - lastAddressLookupTime.current < 1000) return;

    if (lastAddressCoords.current) {
      const [lastLon, lastLat] = lastAddressCoords.current;
      const distanceChange = Math.hypot(coords[0] - lastLon, coords[1] - lastLat);
      if (distanceChange < 0.001) return;
    }

    lastAddressLookupTime.current = now;
    lastAddressCoords.current = coords;

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

          // Add neighborhood/suburb if available and different from city
          if (data.address.suburb || data.address.neighbourhood) {
            const area = data.address.suburb || data.address.neighbourhood;
            parts.push(area);
          }

          // Add city/town
          if (data.address.city || data.address.town || data.address.village) {
            parts.push(data.address.city || data.address.town || data.address.village);
          }

          // Add country (shortened)
          if (data.address.country) {
            // Shorten common long country names
            const country = data.address.country
              .replace('United Kingdom of Great Britain and Northern Ireland (the)', 'United Kingdom')
              .replace('United Kingdom', 'UK');
            parts.push(country);
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
        // Try to build a detailed address
        if (data.localityInfo?.administrative?.[0]?.name) {
          parts.push(data.localityInfo.administrative[0].name);
        }
        if (data.locality) parts.push(data.locality);
        if (data.city && data.city !== data.locality) parts.push(data.city);
        if (data.principalSubdivision) parts.push(data.principalSubdivision);
        if (data.countryName) parts.push(data.countryName === 'United Kingdom' ? 'UK' : data.countryName);

        if (parts.length > 0) return parts.join(', ');
        return null;
      },
      async () => {
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${coords[1]},${coords[0]}&key=demo&language=en&pretty=1&no_annotations=1`
        );
        const data = await response.json();
        if (data.results && data.results[0]) {
          // Clean up the formatted address
          let address = data.results[0].formatted;
          address = address
            .replace('United Kingdom of Great Britain and Northern Ireland (the)', 'UK')
            .replace('United Kingdom', 'UK');
          return address;
        }
        return null;
      },
    ];

    for (const service of services) {
      try {
        const address = await service();
        if (address) {
          setCurrentLocation(address);
          return;
        }
      } catch (error) {
        console.warn('Geocoding service failed, trying next...', error);
        continue;
      }
    }

    setCurrentLocation(`${coords[1].toFixed(6)}, ${coords[0].toFixed(6)}`);
  };

  const focusOnCurrentLocation = () => {
    if (!map.current || !liveCoords) return;
    map.current.flyTo({ center: liveCoords, zoom: 12, duration: 1200, essential: true });
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
    'ROUTE: Brussels → Zurich → Vaduz → Munich → Berlin → Stockholm → Helsinki',
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

      <div className="absolute top-12 sm:top-14 right-2 sm:right-4 z-40 pointer-events-auto">
        <div className="bg-black/95 px-3 py-2 sm:px-6 sm:py-4 rounded-lg border-2 border-red-500 shadow-[0_0_30px_rgba(255,0,0,0.3)] font-mono">
          {!countdownExpired && (
            <>
              <div className="text-[10px] sm:text-xs text-red-500 mb-1 tracking-wider">[DEPARTURE]</div>
              <div className="text-base sm:text-2xl font-bold text-red-500 tracking-wider">{countdown}</div>
            </>
          )}
          <button
            onClick={() => setShowCodeEntry(true)}
            className={`${!countdownExpired ? 'mt-2 sm:mt-3' : ''} w-full px-2 py-1.5 sm:px-4 sm:py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded text-[10px] sm:text-xs text-red-300 hover:text-red-200 transition-colors cursor-pointer font-bold whitespace-nowrap`}
          >
            &gt; JOIN_WAITLIST
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute top-28 sm:top-14 left-2 sm:left-4 right-2 sm:right-auto sm:max-w-md">
        <div className="pointer-events-auto bg-black/95 px-3 py-3 sm:px-6 sm:py-4 rounded-lg border-2 border-red-500 shadow-[0_0_30px_rgba(255,0,0,0.3)] font-mono">
          <div className="text-lg sm:text-2xl font-bold text-red-500 mb-2 sm:mb-3 tracking-wider">&gt; TO SLUSH</div>

          <div className="text-xs sm:text-sm text-red-400 mb-3 sm:mb-4">
            <span className="text-red-500 text-[10px] sm:text-xs">[TRACKED_LOCATION]</span>
            <br />
            <span className="text-red-300 text-xs sm:text-sm wrap-break-word">{currentLocation}</span>
            {isStale && (
              <span className="text-yellow-400 text-[10px] sm:text-xs ml-1">(Last seen 5+ minutes ago)</span>
            )}
            {liveCoords && (
              <>
                <div className="text-[10px] sm:text-xs text-red-500/70 mt-1">
                  {liveCoords[1].toFixed(6)}, {liveCoords[0].toFixed(6)}
                </div>
                {lastUpdate && !isStale && (
                  <div className="text-[10px] sm:text-xs text-green-400 mt-1 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <span>LIVE - {timeSinceUpdate}</span>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <button
                    onClick={focusOnCurrentLocation}
                    className="inline-flex items-center justify-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded text-[10px] sm:text-xs text-red-300 hover:text-red-200 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    &gt; ZOOM_TO_TARGET
                  </button>
                  <a
                    href={`https://www.google.com/maps?q=${liveCoords[1]},${liveCoords[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded text-[10px] sm:text-xs text-red-300 hover:text-red-200 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    &gt; OPEN_GOOGLE_MAPS
                  </a>
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

        .ticker-content {
          display: inline-block;
          animation: ticker 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
