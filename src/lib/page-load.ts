// Astro's ClientRouter swaps the page DOM on every transition while bundled
// module scripts run only once per session. Component setup must therefore
// re-run on every astro:page-load (which also fires on the initial load).

/** Run `init` on every astro:page-load, aborting the previous run first. */
export function onPageLoad(init: (signal: AbortSignal) => void): void {
    let ac: AbortController | null = null;
    document.addEventListener("astro:page-load", () => {
        ac?.abort();
        ac = new AbortController();
        init(ac.signal);
    });
}

/**
 * Run `fn` once per session, guarded by a globalThis flag. For
 * document-level listeners that must stay single even when several page
 * bundles include the same module.
 */
export function once(key: string, fn: () => void): void {
    const g = globalThis as unknown as Record<string, boolean | undefined>;
    if (g[key]) return;
    g[key] = true;
    fn();
}
