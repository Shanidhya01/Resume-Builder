import { TEMPLATE_IDS } from '@/config/templates';

// Plain dynamic `import()` calls — not next/dynamic/React.lazy — because the
// resolved component is fed straight into react-pdf's `usePDF({ document })`,
// which uses its own reconciler and doesn't support React Suspense boundaries.
// Webpack still code-splits each of these into its own chunk, so a template's
// JS is only fetched the first time it's actually selected.
const loaders = {
    [TEMPLATE_IDS.ATS]: () => import('./ATS'),
    [TEMPLATE_IDS.MODERN]: () => import('./Modern'),
    [TEMPLATE_IDS.CREATIVE]: () => import('./Creative'),
    [TEMPLATE_IDS.MINIMAL]: () => import('./Minimal'),
    [TEMPLATE_IDS.EXECUTIVE]: () => import('./Executive'),
    [TEMPLATE_IDS.TWO_COLUMN]: () => import('./TwoColumn'),
};

const componentCache = new Map();

// Resolves (and caches) the PDF document component for a template id.
export async function loadTemplateComponent(id) {
    const loader = loaders[id] ?? loaders[TEMPLATE_IDS.ATS];

    if (componentCache.has(loader)) return componentCache.get(loader);

    const mod = await loader();
    componentCache.set(loader, mod.default);
    return mod.default;
}
