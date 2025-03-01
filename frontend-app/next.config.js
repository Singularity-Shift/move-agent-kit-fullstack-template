//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  env: {
    API_BACKEND_URL: process.env.API_BACKEND_URL,
    APTOS_NETWORK: process.env.APTOS_NETWORK,
    PANORA_API_KEY: process.env.PANORA_API_KEY,
  }
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
