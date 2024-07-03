/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        disableStaticImages: true, // Disable Image Optimization API for export mode
    },
    output: 'export'
};

export default nextConfig;
