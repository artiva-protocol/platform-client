// @ts-check

const NextFederationPlugin = require("@module-federation/nextjs-mf");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: false,
});

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  experimental: {
    externalDir: true,
    images: {
      allowFutureImage: true,
    },
  },
  output: "standalone",
  images: {
    domains: [
      "arweave.net",
      "infura-ipfs.io",
      "ipfs.io",
      "d1dues304i0c30.cloudfront.net",
    ],
  },
  reactStrictMode: false,
  webpack: (config, options) => {
    config.experiments.topLevelAwait = true;

    if (!options.isServer) {
      config.resolve.fallback = {
        fs: false,
      };

      config.plugins.push(
        new NextFederationPlugin({
          name: "host",
          filename: "static/chunks/remoteEntry.js",
          remotes: {},
        })
      );
    }
    return config;
  },
  async redirects() {
    return [
      {
        source: "/artiva",
        destination: "/artiva/site",
        permanent: true,
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
