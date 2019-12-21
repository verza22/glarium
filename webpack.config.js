const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const webpack = require('webpack')

module.exports = {
    mode: 'development',
    entry: {
        main: './resources/js/test.js',
    },
    output: {
        path: path.resolve(__dirname, 'public/dist'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/i,
                use: [
                  'style-loader',
                  'css-loader',
                  'sass-loader',
                ],
             },
             {
                test: /\.(png|jpg|gif)$/i,
                use: [
                  {
                    loader: 'url-loader',
                  },
                ],
            },
        ]
    },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.js',
            Components: path.resolve(__dirname, 'resources/components/'),
            Img: path.resolve(__dirname, 'resources/img/'),
        }
    },
    plugins:[
        new VueLoaderPlugin(),
    ]
}