/** @type {import('next').NextConfig} */
const nextConfig = {
    // Using default Next.js build directory for Vercel compatibility
    distDir: '.next',
    // Phase 7 import parsers run in Node API routes. pdfjs-dist's legacy build
    // resolves its fake worker with a runtime require() and mammoth ships CJS —
    // keeping both external lets Node load them natively instead of webpack
    // trying (and failing) to statically bundle them.
    // firebase-admin pulls in native/gRPC Node modules that must be loaded by
    // Node at runtime, not statically bundled by webpack.
    serverExternalPackages: ['pdfjs-dist', 'mammoth', 'firebase-admin'],
    webpack: config => {
        config.resolve.alias.canvas = false;
        return config;
    },
};

export default nextConfig;
