import path from 'path';

export default {
    mode: 'development',
    entry: path.resolve(__dirname, 'src', 'index.tsx'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.(?:j|t)s(?:x)?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.styl$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'stylus-loader',
                        options: {
                            stylusOptions: {
                                use: ['nib'],
                                import: ['nib'],
                            },
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    devServer: {
        hot: true,
        static: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            components: path.resolve(__dirname, 'src', 'components'),
            constants: path.resolve(__dirname, 'src', 'constants'),
            types: path.resolve(__dirname, 'src', 'types'),
            utils: path.resolve(__dirname, 'src', 'utils'),
        },
    },
};
