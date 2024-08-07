/** @type {import('next').NextConfig} */

import path from "path";

const nextConfig = {
    images: {
        unoptimized: true,
    },
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            "@": path.resolve(process.cwd(), "src/"),
            // Можно добавить дополнительные алиасы по мере необходимости
            // '~': path.resolve(process.cwd(), 'src/')
        };
        return config;
    },
};

export default nextConfig;
