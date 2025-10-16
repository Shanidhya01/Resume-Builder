/** @type {import('next').NextConfig} */
const nextConfig = {
    // Use a custom build output directory to avoid OneDrive/symlink issues
    // Also, avoid aggressive dist cleaning that can trigger readlink errors on some FS providers
    distDir: '.next-build',
    cleanDistDir: false,
    webpack: config => {
        config.resolve.alias.canvas = false;
        return config;
    },
};

export default nextConfig;
