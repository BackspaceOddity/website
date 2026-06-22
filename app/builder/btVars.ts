/* btVars.ts — shared type-style → CSS-variable plumbing for the bt section (BSO-658, Phase A).
   Pure, DOM-free, importable by both client and server components.

   ROLE_VARS maps each text role to the CSS custom-property names that the per-page
   stylesheets (public/builder-css/pbt.css, p8fig.css) consume. The var NAMES are
   identical across both stylesheets; only their default VALUES differ per design.
   A later phase overrides these vars inline on .bt-page to drive a live type editor —
   .bt-page beats :root, so an inline override wins over the stylesheet defaults. */

/** The CSS-property fields a role can override. */
export type StyleField = 'fontSize' | 'lineHeight' | 'fontWeight' | 'letterSpacing' | 'fontFamily';

/** Maps each role's overridable fields to the CSS custom-property name backing it. */
export const ROLE_VARS: Record<string, Partial<Record<StyleField, string>>> = {
  h1:      { fontSize: '--fs-h1',      lineHeight: '--lh-h1',   fontWeight: '--fw-display', fontFamily: '--ff-display' },
  h2:      { fontSize: '--fs-h2',      lineHeight: '--lh-h2',   fontWeight: '--fw-display' },
  lead:    { fontSize: '--fs-lead',    lineHeight: '--lh-lead' },
  card:    { fontSize: '--fs-card' },
  body:    { fontSize: '--fs-body',    lineHeight: '--lh-body', fontWeight: '--fw-body' },
  eyebrow: { fontSize: '--fs-eyebrow', letterSpacing: '--ls-eyebrow' },
  button:  { fontSize: '--fs-btn',     fontWeight: '--fw-btn' },
};

/** One role's override values; any subset of the role's overridable fields. */
export type RoleOverride = Partial<Record<StyleField, string | number>>;

/** Override map keyed by role name (matching ROLE_VARS keys). */
export type BtStyles = Record<string, RoleOverride | null | undefined> | null | undefined;

/**
 * Build a React style object of ONLY the CSS custom properties that are actually set.
 * Unset fields are omitted, so they fall through to the stylesheet default (= no visual change).
 * Pure: no DOM access. Safe to call during SSR.
 *
 * @example btVarStyle({ h2: { fontSize: '54px' } }) // => { '--fs-h2': '54px' }
 */
export function btVarStyle(btStyles: BtStyles): Record<string, string> {
  const out: Record<string, string> = {};
  if (!btStyles) return out;

  for (const role of Object.keys(btStyles)) {
    const override = btStyles[role];
    const varMap = ROLE_VARS[role];
    if (!override || !varMap) continue;

    for (const field of Object.keys(override) as StyleField[]) {
      const cssVar = varMap[field];
      const value = override[field];
      if (cssVar && value !== undefined && value !== null && value !== '') {
        out[cssVar] = String(value);
      }
    }
  }

  return out;
}
