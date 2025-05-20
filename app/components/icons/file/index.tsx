export default function FileIcon(props: React.SVGProps<SVGSVGElement>) {
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