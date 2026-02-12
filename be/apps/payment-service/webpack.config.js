module.exports = function (options, webpack) {
    return {
        ...options,
        entry: {
            main: options.entry,
        },
        output: {
            filename: '[name].js',
            path: options.output.path,
        },
    };
};