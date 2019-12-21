const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const webpack = require('webpack')

module.exports = {
    mode: 'development',
    entry: {
        main: './resources/game/js/main.js',
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
            Components: path.resolve(__dirname, 'resources/game/components/'),
            Views: path.resolve(__dirname, 'resources/game/views/'),
            Js: path.resolve(__dirname, 'resources/game/js/'),
            Prototypes: path.resolve(__dirname, 'resources/game/prototypes/'),
            Lang: path.resolve(__dirname, 'resources/game/lang/'),
            Sass: path.resolve(__dirname, 'resources/game/sass/'),
            Stores: path.resolve(__dirname, 'resources/game/stores/'),
            Img: path.resolve(__dirname, 'resources/game/img/')
        }
    },
    plugins:[
        new VueLoaderPlugin(),
    ]
}