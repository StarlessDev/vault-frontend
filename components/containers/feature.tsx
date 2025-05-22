export default function FeatureSquare({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="hover:-translate-y-1 bg-[var(--sidebar)] rounded p-8 border border-[var(--border)] hover:border-[var(--primary)] transition">
      {children}
    </div>
  );
}