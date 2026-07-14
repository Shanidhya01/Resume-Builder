/** @type {import('next').NextConfig} */
const nextConfig = {
    // Using default Next.js build directory for Vercel compatibility
    distDir: '.next',
    // Phase 7 import parsers run in Node API routes. pdfjs-dist's legacy build
    // resolves its fake worker with a runtime require() and mammoth ships CJS —
    // keeping both external lets Node load them natively instead of webpack
    // trying (and failing) to statically bundle them.
    serverExternalPackages: ['pdfjs-dist', 'mammoth'],
    webpack: config => {
        config.resolve.alias.canvas = false;
        return config;
    },
};

export default nextConfig;
