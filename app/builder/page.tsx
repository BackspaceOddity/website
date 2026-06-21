import './builder.css';
import BuilderApp from './BuilderApp';

export const metadata = {
  title: 'Landing Builder — Backspace Oddity',
  robots: { index: false, follow: false },
};

// Ported Claude Design prototype (BSO-658). Client-only builder shell.
export default function BuilderPage() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <BuilderApp />
    </>
  );
}
