module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Ignore all source map warnings (especially from html5-qrcode)
      webpackConfig.ignoreWarnings = [
        /Failed to parse source map/,
      ];

      return webpackConfig;
    },
  },
};

