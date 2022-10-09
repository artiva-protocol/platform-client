// @ts-check

const NextFederationPlugin = require("@module-federation/nextjs-mf");

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
  reactStrictMode: true,
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
          shared: {
            lodash: {
              eager: true,
              requiredVersion: false,
              singleton: true,
            },
            "@artiva/shared": {
              eager: true,
              requiredVersion: false,
              singleton: true,
            },
            wagmi: {
              eager: true,
              requiredVersion: false,
              singleton: true,
            },
            "@headlessui/react": {
              eager: true,
              requiredVersion: false,
              singleton: true,
            },
            "@rainbow-me/rainbowkit": {
              eager: true,
              requiredVersion: false,
              singleton: true,
            },
            "next/future/image": {
              eager: true,
              requiredVersion: false,
              singleton: true,
            },
          },
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

module.exports = nextConfig;
