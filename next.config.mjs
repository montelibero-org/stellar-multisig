/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        disableStaticImages: true, // Disable Image Optimization API for export mode
    }
};

export default nextConfig;
