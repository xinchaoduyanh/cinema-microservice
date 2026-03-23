module.exports = (options) => ({
  ...options,
  resolve: {
    ...(options.resolve || {}),
    symlinks: false,
  },
});
