<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
  </defs>
  
  <!-- Background Rounded Square for App Icon -->
  <rect width="512" height="512" rx="112" fill="url(#bg)" />
  
  <!-- Subtle Border -->
  <rect x="8" y="8" width="496" height="496" rx="104" fill="none" stroke="#334155" stroke-width="8"/>

  <!-- Guitar Pick / Emblem Background -->
  <path d="M256 64 C140 64 80 130 80 240 C80 340 200 440 256 460 C312 440 432 340 432 240 C432 130 372 64 256 64 Z" fill="url(#gold)" opacity="0.15"/>
  <path d="M256 76 C150 76 96 136 96 238 C96 330 206 422 256 440 C306 422 416 330 416 238 C416 136 362 76 256 76 Z" fill="none" stroke="url(#gold)" stroke-width="8" opacity="0.6"/>

  <!-- Fretboard Neck Graphic -->
  <rect x="200" y="100" width="112" height="312" rx="12" fill="#1e293b" stroke="#f59e0b" stroke-width="8"/>

  <!-- Frets (horizontal lines) -->
  <line x1="200" y1="160" x2="312" y2="160" stroke="#94a3b8" stroke-width="6"/>
  <line x1="200" y1="220" x2="312" y2="220" stroke="#94a3b8" stroke-width="6"/>
  <line x1="200" y1="280" x2="312" y2="280" stroke="#94a3b8" stroke-width="6"/>
  <line x1="200" y1="340" x2="312" y2="340" stroke="#94a3b8" stroke-width="6"/>

  <!-- Strings (vertical lines) -->
  <line x1="216" y1="100" x2="216" y2="412" stroke="#e2e8f0" stroke-width="3" opacity="0.8"/>
  <line x1="235" y1="100" x2="235" y2="412" stroke="#e2e8f0" stroke-width="3" opacity="0.8"/>
  <line x1="256" y1="100" x2="256" y2="412" stroke="#e2e8f0" stroke-width="4" opacity="0.9"/>
  <line x1="277" y1="100" x2="277" y2="412" stroke="#e2e8f0" stroke-width="4" opacity="0.9"/>
  <line x1="296" y1="100" x2="296" y2="412" stroke="#e2e8f0" stroke-width="5" opacity="0.9"/>

  <!-- Glowing Note Marker (Root note dot on fretboard) -->
  <circle cx="256" cy="250" r="18" fill="#f59e0b" stroke="#ffffff" stroke-width="4"/>
  <circle cx="256" cy="250" r="8" fill="#ffffff"/>
</svg>
