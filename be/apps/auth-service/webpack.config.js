const path = require('node:path');

module.exports = (options) => ({
  ...options,
  resolve: {
    ...(options.resolve || {}),
    symlinks: false,
    alias: {
      ...((options.resolve && options.resolve.alias) || {}),
      '@app/common': path.resolve(__dirname, '../../libs/common/dist'),
      '@app/core': path.resolve(__dirname, '../../libs/core/dist'),
      '@app/email-template': path.resolve(__dirname, '../../libs/email-template'),
    },
  },
});
