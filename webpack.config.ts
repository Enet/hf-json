import 'webpack-dev-server';
import path from 'path';
import webpack from 'webpack';

const configuration: webpack.Configuration = {
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
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[folder]-[hash:base64:2]_[local]',
                                exportLocalsConvention: 'asIs',
                                namedExport: false,
                            },
                        },
                    },
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
        ],
    },
    devServer: {
        hot: true,
        port: 7331,
        open: true,
        static: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            components: path.resolve(__dirname, 'src', 'components'),
            types: path.resolve(__dirname, 'src', 'types'),
            utils: path.resolve(__dirname, 'src', 'utils'),
        },
    },
};

export default configuration;
