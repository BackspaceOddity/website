/**
 * buildScript(config) — the CANONICAL Edit Mode, as a self-contained IIFE string.
 *
 * This is the single source every project consumes (BSO Website route handler,
 * Stape/AI Skills static or React surfaces). It carries the full canonical panel:
 *   - Visual edits → in-place corner PINS on the element (Figma/Miro model)
 *   - Copy + ToV edits → right-margin RAIL markers (Notion model)
 *   - amber inline highlight on commented text; collapsed bubble → hover preview → click card
 *   - each card carries its OWN "Send to Claude" / "Resolve" (per-comment)
 *   - ToV check → posts to inbox /tov-request; the CC session runs tov-lint and
 *     writes the verdict back; the browser polls /tov-poll and renders it
 *   - Tweaks panel (font sizes / line heights / weight+style) — live CSS vars
 *
 * Panel chrome reads `--emc-*` CSS vars, injected at runtime as
 * `var(--<host-var>, <default>)` — so it inherits a host theme (and its day/night
 * toggle) when present, and falls back to the BSO palette everywhere else.
 * Tweaks targets (--fs-*, --lh-*, --w-*, --st-*) are the HOST's typography vars,
 * supplied per-project via `config.tweaks`.
 */
interface EditModeSizeToken {
    k: string;
    l: string;
    d: number;
    min: number;
    max: number;
}
interface EditModeWeightToken {
    l: string;
    w: string;
    s: string;
    wd: number;
    sd: string;
}
interface EditModeTokenRule {
    match: string;
    token: string;
    label?: string;
}
/** Font-family picker row. `k` = CSS var (e.g. '--font-body'), `l` = label, `d` = default value. */
interface EditModeFontToken {
    k: string;
    l: string;
    d?: string;
}
interface EditModeConfig {
    /** localStorage namespace + payload `source`. Usually the client/page slug. */
    slug: string;
    /** Inbox server base URL. Default 'http://localhost:8002'. */
    inboxBase?: string;
    /** Tweaks panel targets (host typography CSS vars). Omit → no Tweaks panel. */
    tweaks?: {
        sizes?: EditModeSizeToken[];
        lineHeights?: EditModeSizeToken[];
        weightStyles?: EditModeWeightToken[];
        /** Override the default weight/style options shown in every Weight & Style dropdown.
         *  Format: [cssWeight|cssStyle, label]. Default: Regular/Medium/Bold/Italic.
         *  Use this to expose all loaded variants of the project's brand font. */
        weightOptions?: Array<[string, string]>;
        /** Font-family pickers — each row controls one CSS var via all system fonts
         *  (loaded via window.queryLocalFonts(); falls back to text input if unavailable). */
        fontFamilies?: EditModeFontToken[];
    };
    /** Declarative block→token map driving the Tweaks-row hover highlight + dialog label. */
    tokenMap?: EditModeTokenRule[];
    /** Panel chrome theme defaults (used when the host doesn't define the matching var). */
    theme?: Partial<{
        ink: string;
        paper: string;
        paperSoft: string;
        rule: string;
        ruleStrong: string;
        ink40: string;
        ink55: string;
        surface: string;
        ring: string;
        mono: string;
        text: string;
        display: string;
    }>;
}
/** Inner IIFE JS only (no <script> wrapper) — for React dangerouslySetInnerHTML. */
declare function buildScriptInner(cfg: EditModeConfig): string;
/** Full <script>…</script> string — for server route handlers / static HTML injection. */
declare function buildScript(cfg: EditModeConfig): string;

export { type EditModeConfig, type EditModeFontToken, type EditModeSizeToken, type EditModeTokenRule, type EditModeWeightToken, buildScript, buildScriptInner };
