// @ts-check

const NextFederationPlugin = require("@module-federation/nextjs-mf");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: false,
});
const path = require("path");

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

    //Uncomment for shared package development

    /*
    config.resolve.alias["@artiva/shared"] = path.resolve(
      __dirname,
      "../shared"
    );
    config.resolve.alias["react"] = path.join(__dirname, "node_modules/react");
    config.resolve.alias["react-dom"] = path.join(
      __dirname,
      "node_modules/react-dom"
    );
    config.resolve.alias["wagmi"] = path.join(__dirname, "node_modules/wagmi");
    config.resolve.alias["@zoralabs/nft-hooks"] = path.join(
      __dirname,
      "node_modules/@zoralabs/nft-hooks"
    );
    */

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
            "@heroicons/react": {
              singleton: true,
              requiredVersion: false,
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

module.exports = withBundleAnalyzer(nextConfig);
