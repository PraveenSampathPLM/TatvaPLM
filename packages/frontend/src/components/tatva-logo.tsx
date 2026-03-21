import logoUrl from "@/assets/tatva-logo.svg";

interface TatvaLogoProps {
  compact?: boolean;
}

export function TatvaLogo({ compact = false }: TatvaLogoProps): JSX.Element {
  if (compact) {
    // Icon only — circular swirl matching the Tatva brand mark
    return (
      <svg width="32" height="32" viewBox="0 0 100 100" aria-label="Tatva">
        <g transform="translate(50,50)">
          {/* Green sweep */}
          <path d="M 0,36 C -30,30 -42,4 -28,-18 C -18,-34 2,-40 18,-34 C 6,-16 -2,8 0,36 Z" fill="#2E7D32"/>
          <path d="M 0,36 C -18,46 -36,40 -38,26 C -32,16 -16,18 0,36 Z" fill="#388E3C"/>
          {/* Orange arc */}
          <path d="M 18,-34 C 30,-54 54,-56 64,-40 C 72,-26 68,-8 56,2 C 42,-14 22,-30 18,-34 Z" fill="#E65100"/>
          <path d="M 18,-34 L 6,-54 L 26,-44 Z" fill="#EF6C00"/>
          {/* Gray arc */}
          <path d="M 56,2 C 72,14 74,38 58,50 C 46,58 28,56 16,48 C 32,36 48,20 56,2 Z" fill="#9E9E9E"/>
          {/* Navy centre */}
          <circle cx="10" cy="10" r="18" fill="#1A237E"/>
          <circle cx="10" cy="10" r="11" fill="white"/>
          <circle cx="10" cy="10" r="6" fill="#1A237E"/>
          {/* Blue dot */}
          <circle cx="62" cy="-18" r="7" fill="#1565C0"/>
        </g>
      </svg>
    );
  }

  return (
    <img src={logoUrl} alt="Tatva" className="h-10 w-auto" />
  );
}
