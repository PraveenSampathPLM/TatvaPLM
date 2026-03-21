import logoUrl from "@/assets/tatva-logo.svg";

interface TatvaLogoProps {
  compact?: boolean;
}

export function TatvaLogo({ compact = false }: TatvaLogoProps): JSX.Element {
  if (compact) {
    // Tricolor chemistry atom — icon only for collapsed sidebar
    return (
      <svg width="36" height="36" viewBox="-56 -56 112 112" aria-label="Tatva">
        {/* Saffron orbit */}
        <ellipse cx="0" cy="0" rx="44" ry="15" stroke="#FF9933" strokeWidth="2.5" fill="none" transform="rotate(0)"/>
        {/* Green orbit */}
        <ellipse cx="0" cy="0" rx="44" ry="15" stroke="#138808" strokeWidth="2.5" fill="none" transform="rotate(60)"/>
        {/* Navy orbit */}
        <ellipse cx="0" cy="0" rx="44" ry="15" stroke="#1A237E" strokeWidth="2.5" fill="none" transform="rotate(-60)"/>
        {/* Electrons */}
        <circle cx="44"  cy="0"   r="7" fill="#FF9933"/>
        <circle cx="44"  cy="0"   r="3.5" fill="white" opacity="0.8"/>
        <circle cx="22"  cy="38"  r="7" fill="#138808"/>
        <circle cx="22"  cy="38"  r="3.5" fill="white" opacity="0.8"/>
        <circle cx="22"  cy="-38" r="7" fill="#1A237E"/>
        <circle cx="22"  cy="-38" r="3.5" fill="white" opacity="0.8"/>
        {/* Nucleus */}
        <circle cx="0" cy="0" r="13" fill="#1A237E"/>
        <circle cx="0" cy="0" r="8"  fill="white"/>
        <circle cx="0" cy="0" r="4"  fill="#1A237E"/>
      </svg>
    );
  }

  return (
    <img src={logoUrl} alt="Tatva — Product Lifecycle Management" className="h-12 w-auto" />
  );
}
