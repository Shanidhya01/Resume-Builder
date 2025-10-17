/** @type {import('next').NextConfig} */
const nextConfig = {
    // Using default Next.js build directory for Vercel compatibility
    distDir: '.next',
    webpack: config => {
        config.resolve.alias.canvas = false;
        return config;
    },
};

export default nextConfig;
