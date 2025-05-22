export default function EncryptedFileIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
    viewBox="0 0 48 48"
    stroke="currentColor"
    fill="none"
    {...props}
    >
      {/* File base */}
      <path
        d="M10 4C8.89543 4 8 4.89543 8 6V42C8 43.1046 8.89543 44 10 44H38C39.1046 44 40 43.1046 40 42V14L30 4H10Z"
        fill="#1F2937"
        stroke="#4B5563"
        strokeWidth="2"
      />
      {/* File folded corner */}
      <path
        d="M30 4V14H40"
        stroke="#4B5563"
        strokeWidth="2"
        fill="none"
      />
      {/* Lock body */}
      <rect
        x="16"
        y="22"
        width="16"
        height="14"
        rx="2"
        fill="#7C3AED"
        stroke="#8B5CF6"
        strokeWidth="1"
      />
      {/* Lock shackle */}
      <path
        d="M18 22V18C18 15.7909 19.7909 14 22 14H26C28.2091 14 30 15.7909 30 18V22"
        stroke="#8B5CF6"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Keyhole */}
      <circle
        cx="24"
        cy="29"
        r="2"
        fill="#1F2937"
      />
      <path
        d="M24 31V33"
        stroke="#1F2937"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Encryption symbols */}
      <circle
        cx="14"
        cy="10"
        r="1.5"
        fill="#9333EA"
        opacity="0.8"
      />
      <circle
        cx="18"
        cy="10"
        r="1.5"
        fill="#9333EA"
        opacity="0.8"
      />
      <circle
        cx="22"
        cy="10"
        r="1.5"
        fill="#9333EA"
        opacity="0.8"
      />
      {/* Binary data on file */}
      <path
        d="M14 39H18"
        stroke="#9333EA"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M20 39H24"
        stroke="#9333EA"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M26 39H30"
        stroke="#9333EA"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M14 36H16"
        stroke="#9333EA"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M18 36H20"
        stroke="#9333EA"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M22 36H28"
        stroke="#9333EA"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M30 36H34"
        stroke="#9333EA"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}