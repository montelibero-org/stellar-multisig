const isGithubActions = process.env.GITHUB_ACTIONS || false;

let assetPrefix = "";
let basePath = "";

if (isGithubActions) {
    const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, "");

    assetPrefix = `/${repo}/`;
    basePath = `/${repo}`;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        disableStaticImages: true, // Disable Image Optimization API for export mode
    },
    trailingSlash: false,   // Ensure that each exported page has a trailing slash
};

export default nextConfig;
