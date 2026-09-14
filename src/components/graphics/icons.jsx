// Small line-art icons, monochrome and stroke-only, without filled illustration
// per DESIGN.md's no-icon-set rule, used sparingly inside product mockups.

export function PlaneIcon({ size = 20, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2.5v8.2M12 10.7l9 4.3v2L12 14.8m0-4.1L3 15v2l9-2.2M12 14.8v5l2.4 1.7v1.3L12 21.9l-2.4.9v-1.3L12 19.8" />
    </svg>
  );
}

export function PinIcon({ size = 14, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22s7-7.58 7-12.5A7 7 0 0 0 5 9.5C5 14.42 12 22 12 22Z" />
      <circle cx="12" cy="9.5" r="2.4" />
    </svg>
  );
}

export function CheckIcon({ size = 12, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 12.5 9.5 18 20 6" />
    </svg>
  );
}
