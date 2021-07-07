const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
// const EsmWebpackPlugin = require('@purtuga/esm-webpack-plugin');
module.exports = (env) => {
    return {
        mode: 'development',
        entry: {
            xntree: {
                import: './src/xnTree.js',
            }
        },
        // devtool:'eval-source-map',//追踪错误源码
        devtool: env.production ? 'source-map' : 'eval-source-map',//追踪错误源码
        devServer: {
            contentBase: './dist',
            port:8083
        },
        plugins: [
            new CleanWebpackPlugin({cleanStaleWebpackAssets: true}),
            // new MiniCssExtractPlugin({
            //     filename: '[name].css',
            //     chunkFilename: '[id].css',
            // }),
            new HtmlWebpackPlugin({
                template: './index.html',
            }),
            new UglifyJsPlugin(),
            new CopyPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, './static'),
                        to: 'static',
                    },
                ],
            }),
            // new EsmWebpackPlugin()
        ],
        output: {
            filename: '[name].min.js',
            path: path.resolve(__dirname, 'dist'),
            // library:"[name].min",
            // libraryTarget:"var",
            // publicPath: '/',
            environment: {//输出es5的语法，用于兼容ie
                // The environment supports arrow functions ('() => { ... }').
                arrowFunction: false,
                // The environment supports BigInt as literal (123n).
                bigIntLiteral: false,
                // The environment supports const and let for variable declarations.
                const: false,
                // The environment supports destructuring ('{ a, b } = obj').
                destructuring: false,
                // The environment supports an async import() function to import EcmaScript modules.
                dynamicImport: false,
                // The environment supports 'for of' iteration ('for (const x of array) { ... }').
                forOf: false,
                // The environment supports ECMAScript Module syntax to import ECMAScript modules (import ... from '...').
                module: true,
            }
        },
        optimization: {},
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: "babel-loader",
                    options: {
                        presets: [
                            ['babel-preset-env', {
                                targets: {
                                    browsers: ['> 1%']
                                },
                                debug: true
                            }]
                        ],
                        "plugins": ["transform-object-rest-spread"]
                    }
                },
                {
                    test: /\.css$/i,
                    use: ['style-loader', 'css-loader'],
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif|json)$/i,
                    use: {
                        loader: 'file-loader',
                        options: {
                            name: 'img/[name].[ext]'
                        }
                    }

                },
                {
                    test: /\.(eot|svg|ttf|woff|woff2)$/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'fonts/'
                        }
                    }
                },
                // {
                //     test: /\.(jpg|png|gif)$/i,  //i表示忽略图片格式大小写，例如.PNG
                //     use: [{
                //         loader: 'url-loader',  // url-loader依赖于file-loader所以这两个包都需要下载
                //         options:{
                //             limit: 10*1024, //如果图片小于10k，就使用base64处理，
                //         }
                //     }]
                // }
            ],
        },
    }
};
