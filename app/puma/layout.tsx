// Puma Runbook route — scoped CSS for the KOS base screen.
// Order matters: fonts/vars → KOS component layer → tana-skin palette (last,
// so the dark theme tokens win) → shell layout.
import "./puma.css";
import "./vendor/kos-v11.css";
import "./vendor/tana-skin.css";
import "./shell.css";

export const metadata = {
  title: "Puma Runbook — Cascade",
};

export default function PumaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
