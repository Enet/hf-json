import 'webpack-dev-server';

import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import path from 'path';
import ReactRefreshTypeScript from 'react-refresh-typescript';
import webpack from 'webpack';

const isProduction = process.env.NODE_ENV === 'production';

const configuration: webpack.Configuration = {
    mode: isProduction ? 'production' : 'development',
    entry: {
        bundle: path.resolve(__dirname, 'src', 'index.tsx'),
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.(?:j|t)s(?:x)?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            getCustomTransformers: () => ({
                                before: isProduction ? [] : [ReactRefreshTypeScript()],
                            }),
                        },
                    },
                ],
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
                                include: [path.join(__dirname, 'src')],
                            },
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            components: path.resolve(__dirname, 'src', 'components'),
            types: path.resolve(__dirname, 'src', 'types'),
            utils: path.resolve(__dirname, 'src', 'utils'),
        },
    },
    devServer: isProduction
        ? undefined
        : {
              hot: true,
              port: 7331,
              open: true,
              static: path.resolve(__dirname, 'dist'),
          },
    plugins: isProduction
        ? [
              new webpack.DefinePlugin({
                  'process.env': {
                      NODE_ENV: JSON.stringify('production'),
                  },
              }),
          ]
        : [new ReactRefreshWebpackPlugin()],
};

export default configuration;
