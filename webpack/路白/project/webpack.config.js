module.exports = {
    mode: 'production',
    entry: {
        // index: './src/index.js'
        // index: ['./src/index.js', './src/add.js']
        index: './src/index.js',
        other: './src/multiply.js'
    },
    output: {
        filename: '[name].js'
    },
    // devtool: 'source-map'
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                commons: {
                    chunks: 'initial',
                    minChunks: 2,
                    minSize: 0
                },
                vendor: {
                    test: '/node_modules/',
                    chunks: 'initial',
                    name: 'vendor',
                    enforce: true
                }
            }
        }
    }
}