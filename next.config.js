const withCSS = require('@zeit/next-css');

module.exports = withCSS({
  poweredByHeader: false,
  publicRuntimeConfig: {
    API_URL: process.env.API_URL || 'http://localhost:3000/api',
  },
});
