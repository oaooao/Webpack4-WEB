const path = require('path') // 获取绝对路径用

const HtmlWebPackPlugin = require('html-webpack-plugin') // 动态生成html插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 动态生成css插件
const UglifyJsPlugin = require('uglifyjs-webpack-plugin') // 代码压缩插件，webpack本身自带了，引入这个是为了配置参数
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin') // 压缩css插件
const CleanWebpackPlugin = require('clean-webpack-plugin') // 清理dist文件夹插件
const CopyWebpackPlugin = require('copy-webpack-plugin') // 复制文件用
const autoprefixer = require('autoprefixer') // 自动补全前缀
// const FaviconsWebpackPlugin = require('favicons-webpack-plugin') // 自动生成各尺寸的favicon图标
// const HtmlBeautifyPlugin = require('html-beautify-webpack-plugin') // Html文件美化插件

const devMode = (process.env.NODE_ENV === 'development') // 开发环境
// const proMode = (process.env.NODE_ENV === 'production') // 生产环境

module.exports = {
    entry: {
        /* 入口 */
        index: './src/index.js',
        // a: "./src/a.js" 可以多入口
    },

    output: {
        /* 输出 */
        filename: '[name].bundle.js?[hash:5]', // 动态绑定 + hash
        path: path.join(__dirname, 'dist')
    },

    devtool: 'inline-source-map', // 报错的时候在控制台输出哪一行报错

    devServer: {
        contentBase: path.join(__dirname, 'dist'), // 服务于 dist/ 目录
        open: true, // 当open启用时，开发服务器将自动打开浏览器
        compress: true, // 为服务的所有内容启用gzip压缩
        // host: '0.0.0.0', // 指定要使用的主机，默认是localhost，如果希望可以被外部访问，指定成 '0.0.0.0' 即可
        port: 9090, // 监听端口
        proxy: {
            /* 无论任何请求都将转向请求 http://localhost:3000/aaa/users */
            '*': {
                target: 'https://qa01.letzgo.com.cn',
                /**
                 * 参数changeOrigin: true解决了两种使用虚拟主机代理错误的情况，一种是HTTPS握手失败，另一种是404 Not Found
                 * 默认为false,只有当设为true时，才会传给正确的host头,否则http-proxy-middleware会原封不动将本地 HTTP 请求发往后端
                */
                changeOrigin: true,
                secure: false // 默认情况下为true，不接受运行在HTTPS上，且使用了无效证书的后端服务器，改成false即可解决该问题
            },
            /* 请求 /aaa/users 将转向请求 http://localhost:3000/aaa/users */
            '/aaa': 'http://localhost:3000',
            /* 请求 /bbb/users 将转向请求 http://localhost:3000/users */
            '/bbb': {
                target: 'http://localhost:3000',
                pathRewrite: {'^/api': ''}
            }
        },
        overlay: {
            warnings: true, // 显示警告
            errors: true // 显示错误
        },
        // historyApiFallback:true, // 使用HTML5 History API时，index.html可能需要提供该页面来代替404响应
        // openPage:"/test", // 指定浏览器打开的页面
        // allowedHosts: [ // 允许访问开发服务器的服白名单
        //     'host.com',
        //     'host2.com'
        // ],
        // quiet: false, // quiet启用时，除了该初始启动信息将被写入到控制台,意味着来自webpack的错误或警告不可见。
        // inline:true, // 用来支持dev-server自动刷新
        // https: true, // 默认情况下，dev-server 将通过 HTTP 提供服务。它可以通过 HTTPS 通过 HTTP / 2进行服务
        // useLocalIp: true, // 该选项允许浏览器使用本地IP打开
        // clientLogLevel: "none", // 在使用内联模式时，DevTools中的控制台将显示消息，您可以使用此选项阻止显示所有这些消息
    },

    plugins: [
        // 动态生成html插件
        new HtmlWebPackPlugin({
            template: './src/template/index.html', // html模板路径
            filename: './index.html', // 生成的html存放路径，相对于 output.path
            minify: true,
            hash: true, // 防止缓存，在引入的文件后面加hash (PWA就是要缓存，默认为true)
            inject: true, // 是否将 js 放在body的末尾
        }),
        // 生成css插件
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: devMode ? '[name].css' : '[name].css?[hash:5]',
            chunkFilename: devMode ? '[id].css' : '[id].css?[hash:5]',
        }),
        // 清理dist文件夹
        new CleanWebpackPlugin(['dist/*.*']),
        /**
         * 文件复制
         * 这里是用于把manifest.json打包时复制到/build下 （PWA）
         * **/
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, './dist'),
                to: path.resolve(__dirname, './dzcx_h5sp/onePush'),
                force: true,
                toType: 'dir',
                ignore: ['.*']
            }
        ], { copyUnmodified: true }),

        // 开发环境，美化生成的Html文件
        // new HtmlBeautifyPlugin({
        //     config: {
        //       html: {
        //         end_with_newline: true,
        //         indent_size: 2,
        //         indent_inner_html: true,
        //         unformatted: ['p', 'i', 'b', 'span']
        //       }
        //     },
        //     replace: ['type="text/javascript"']
        // })

        /**
         * 自动生成各种类型的favicon
         * 这么做是为了以后各种设备上的扩展功能，比如PWA桌面图标
         * **/
        // new FaviconsWebpackPlugin({
        //     logo: "./src/favicon.png",
        //     prefix: "icons/",
        //     icons: {
        //     appleIcon: true, // 目前只生成苹果的，其他平台都用苹果的图标
        //     android: false,
        //     firefox: false,
        //     appleStartup: false
        //     }
        // })
    ],

    optimization: {
        /* 打包优化 */
        minimizer: [
            /**
             * 压缩代码
             * webpack已经内置了，这里是因为想要配置一些参数
             * **/
            new UglifyJsPlugin({
                cache: true,
                // compress: {
                //     drop_console: true // 是否删除代码中所有的console
                // },
                parallel: true,
                sourceMap: true // set to true if you want JS source maps
            }),
            new OptimizeCSSAssetsPlugin({}), // 压缩css
        ],
        // 公共代码提取
        splitChunks: {
            chunks: 'all',
            name: 'common',
        },
        runtimeChunk: {
            name: 'runtime',
        }
    },

    resolve: {
        extensions: ['.js', '.jsx', '.less', '.css', '.scss', '.styl'] // 后缀名自动补全
    },

    postcss: [autoprefixer({browsers: ['last 2 versions']})],
    module: {
        rules: [
            /* 加载器 */
            {
                // 用 babel 提供ES6语法解析
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                // html加载器
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: { minimize: process.env.NODE_ENV !== 'production' } // 打包的时候自动压缩
                    }
                ]
            },
            {
                // 文件加载器
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name (file) {
                                if (devMode) {
                                    return '[path][name].[ext]'
                                }

                                return '[hash:5].[ext]'
                            },
                            publicPath: 'dist/assets/' // 目标路径
                        }
                    }
                ]
            },
            {
                // 文件解析
                test: /\.(eot|woff|otf|svg|ttf|woff2|appcache|mp3|mp4|pdf)(\?|$)/,
                include: path.resolve(__dirname, 'src'),
                use: ['file-loader?name=dist/assets/[name].[ext]']
            },
            {
                // css加载器
                test: /\.css$/,
                use: [
                    {
                        // fallback to style-loader in development
                        loader: process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                    }
                ]
            },
            {
                // less加载器
                test: /\.less$/,
                use: [
                    {
                        loader: process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'postcss-loader', // 预编译
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                // sass加载器
                test: /\.scss$/,
                use: [
                    {
                        loader: process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            { // .stylus解析
                test: /\.styl$/,
                loader: 'css-loader!stylus-loader?paths=node_modules/bootstrap-stylus/stylus/'
            },
            { // 源码映射，报错时指向源码而不是编译后的代码
                test: /\.js$/,
                use: ['source-map-loader'],
                enforce: 'pre'
            },
            { // Eslint
                enforce: 'pre', // 防止和其他加载器冲突
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
                options: {
                    // eslint options (if necessary)
                }
            },
        ]
    },
}
