export default function CopyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      stroke="currentColor"
      fill="none"
      {...props}
    >
      {/* Back document (shadow) */}
      <rect
        x="4"
        y="6"
        width="12"
        height="14"
        rx="1"
        strokeWidth="1"
      />

      {/* Front document (main) */}
      <rect
        x="8"
        y="7"
        width="12"
        height="14"
        rx="1"
        strokeWidth="1"
      />

      {/* Text lines on front document */}
      <path
        d="M11 11H17"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M11 14H17"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M11 17H15"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}