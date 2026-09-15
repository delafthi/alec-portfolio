// Astro's ClientRouter swaps the page DOM on every transition while bundled
// module scripts run only once per session. Component setup must therefore
// re-run on every astro:page-load (which also fires on the initial load).

/**
 * Run `init` on every astro:page-load. The cleanup returned by the previous
 * run is called before the next one, so listeners attached to the persistent
 * document (scoped via an AbortController) do not accumulate.
 */
export function onPageLoad(init: () => undefined | (() => void)): void {
    let teardown: (() => void) | null = null;
    document.addEventListener("astro:page-load", () => {
        teardown?.();
        teardown = null;
        teardown = init() ?? null;
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
