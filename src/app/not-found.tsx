import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-bg-deep px-6 text-center">
      <p className="font-mono text-[0.75rem] font-medium uppercase tracking-[0.14em] text-accent-1 mb-4">
        404
      </p>
      <h1
        className="font-display font-[800] leading-[1.15] text-text-primary mb-4"
        style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
      >
        Page not found
      </h1>
      <p className="text-text-secondary text-lg mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center px-8 py-3 font-display font-semibold text-sm uppercase tracking-widest rounded-sm bg-accent-1 text-white transition-colors hover:bg-accent-1/90"
      >
        Back to Home
      </Link>
    </main>
  );
}
