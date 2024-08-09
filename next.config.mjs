import path from "path";
import getCommitHash from "./getCommitHash.mjs";

const nextConfig = {
    images: {
        unoptimized: true,
    },
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            "@": path.resolve(process.cwd(), "src/"),
            // Можно добавить дополнительные алиасы по мере необходимости
        };
        return config;
    },
    env: {
        NEXT_PUBLIC_COMMIT_HASH: getCommitHash(),
    },
};

export default nextConfig;
