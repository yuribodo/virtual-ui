import React from 'react';

export type IconOfficialProps = React.ComponentProps<'svg'>;

export function IconOfficial(props: IconOfficialProps) {
  return (
    <svg
      width={64}
      height={64}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="64" height="64" rx="12" fill="#8B4513" />
      <circle cx="20" cy="20" r="4" fill="white" />
      <circle cx="44" cy="20" r="4" fill="white" />
      <circle cx="32" cy="44" r="4" fill="white" />
      <line x1="24" y1="20" x2="40" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="22" y1="23" x2="30" y2="41" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="42" y1="23" x2="34" y2="41" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
} 