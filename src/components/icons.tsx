type IconProps = { className?: string };

const crisp = { shapeRendering: "crispEdges" as const };

export function CoinIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true" {...crisp}>
      <g fill="currentColor">
        <rect x="5" y="1" width="6" height="1" />
        <rect x="3" y="2" width="10" height="2" />
        <rect x="2" y="4" width="12" height="8" />
        <rect x="3" y="12" width="10" height="2" />
        <rect x="5" y="14" width="6" height="1" />
      </g>
      <rect x="5" y="5" width="6" height="6" fill="rgba(20,10,0,0.4)" />
      <rect x="7" y="4" width="2" height="8" fill="rgba(255,255,255,0.35)" />
    </svg>
  );
}

export function ShipIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true" {...crisp}>
      <g fill="currentColor">
        <rect x="7" y="1" width="2" height="3" />
        <rect x="6" y="4" width="4" height="3" />
        <rect x="4" y="7" width="8" height="3" />
        <rect x="2" y="10" width="12" height="3" />
        <rect x="1" y="13" width="4" height="2" />
        <rect x="11" y="13" width="4" height="2" />
      </g>
    </svg>
  );
}

export function KeyIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true" {...crisp}>
      <g fill="currentColor">
        <rect x="1" y="5" width="14" height="9" />
        <rect x="6" y="2" width="4" height="3" />
      </g>
      <rect x="3" y="7" width="10" height="5" fill="rgba(6,9,19,0.85)" />
      <rect x="7" y="8" width="2" height="2" fill="currentColor" opacity="0.55" />
    </svg>
  );
}

export function StickIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true" {...crisp}>
      <g fill="currentColor">
        <rect x="6" y="1" width="4" height="4" />
        <rect x="7" y="5" width="2" height="6" />
        <rect x="3" y="11" width="10" height="2" />
        <rect x="5" y="13" width="6" height="2" />
      </g>
    </svg>
  );
}

export function PadIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true" {...crisp}>
      <g fill="currentColor">
        <rect x="4" y="2" width="8" height="2" />
        <rect x="3" y="4" width="10" height="5" />
        <rect x="4" y="9" width="8" height="2" />
      </g>
      <rect x="2" y="12" width="12" height="3" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

export function SpeakerOnIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <path d="M2 6h3l4-4v12L5 10H2z" fill="currentColor" />
      <g fill="currentColor" shapeRendering="crispEdges">
        <rect x="11" y="6" width="2" height="4" />
        <rect x="14" y="4" width="2" height="8" />
      </g>
    </svg>
  );
}

export function SpeakerOffIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <path d="M2 6h3l4-4v12L5 10H2z" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="square">
        <line x1="10.5" y1="5" x2="15.5" y2="11" />
        <line x1="15.5" y1="5" x2="10.5" y2="11" />
      </g>
    </svg>
  );
}

export function TrophyIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true" {...crisp}>
      <g fill="currentColor">
        <rect x="4" y="1" width="8" height="2" />
        <rect x="1" y="2" width="2" height="4" />
        <rect x="13" y="2" width="2" height="4" />
        <rect x="3" y="3" width="10" height="4" />
        <rect x="4" y="7" width="8" height="2" />
        <rect x="7" y="9" width="2" height="3" />
        <rect x="4" y="12" width="8" height="2" />
      </g>
    </svg>
  );
}

export function MixerIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true" {...crisp}>
      <g fill="currentColor">
        <rect x="1" y="3" width="14" height="2" />
        <rect x="9" y="1" width="3" height="6" />
        <rect x="1" y="8" width="14" height="2" />
        <rect x="3" y="6" width="3" height="6" />
        <rect x="1" y="13" width="14" height="2" />
        <rect x="10" y="11" width="3" height="5" />
      </g>
    </svg>
  );
}

export function BoltIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <path d="M9 1L3 9h4l-1 6 7-9H8l1-5z" fill="currentColor" />
    </svg>
  );
}

export function ArrowUpIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <path d="M8 3l6 7H2z" fill="currentColor" />
    </svg>
  );
}

export function ArrowDownIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <path d="M8 13L2 6h12z" fill="currentColor" />
    </svg>
  );
}

export function SaveIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true" {...crisp}>
      <rect x="1" y="3" width="14" height="10" fill="currentColor" />
      <rect x="3" y="5" width="10" height="4" fill="rgba(6,9,19,0.85)" />
      <rect x="4.5" y="6" width="2" height="2" fill="currentColor" />
      <rect x="9.5" y="6" width="2" height="2" fill="currentColor" />
      <rect x="4" y="10.5" width="8" height="1.5" fill="rgba(6,9,19,0.85)" />
    </svg>
  );
}
