/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/perfil',
        permanent: false,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        hostname: 'pontoja.s3.amazonaws.com',
      },
    ],
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    config.optimization.minimize = true;

    return config;
  },
};

export default nextConfig;
