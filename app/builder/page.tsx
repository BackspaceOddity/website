import './builder.css';
import BuilderApp from './BuilderApp';

export const metadata = {
  title: 'Landing Builder — Backspace Oddity',
  robots: { index: false, follow: false },
};

// Ported Claude Design prototype (BSO-658). Client-only builder shell.
export default async function BuilderPage() {
  // Canonical Edit Mode — dev only. Dynamic import inside the dev branch so the
  // production build never resolves the dev tool (per the EditModeShell prod-decouple fix).
  let editPanel = '';
  if (process.env.NODE_ENV !== 'production') {
    const { buildScriptInner } = await import('@backspace-oddity/edit-mode/build-script');
    editPanel = buildScriptInner({ slug: 'landing-builder', inboxBase: 'http://localhost:8014' });
  }

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <BuilderApp />
      {editPanel && <script dangerouslySetInnerHTML={{ __html: editPanel }} />}
    </>
  );
}
