const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: path.resolve(__dirname, './src/index.ts'),
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.[hash].js',
        path: path.resolve(__dirname, 'build'),
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                {from: path.resolve(__dirname, "./public")},
            ],
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "./src/templates/index.html"),
            favicon: path.resolve(__dirname, "./src/templates/favicon.ico"),
            title: "Hi 👋",
            scriptLoading: "defer"
        }),
        new MiniCssExtractPlugin({filename: "styles.[hash].css"}),
    ]
};
