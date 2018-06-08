

# Webpack4配置备忘录

>+ ##### 版本 : webpack 4.10.2 
>
>+ ##### 入口文件 ：`./src/index.js`
>
>+ ##### 输出目录 ：`./dist`
>
>+ ##### 支持 ：ES6语法、代码压缩、代码分割、Eslint语法检查、Less、Sass、Stylus、自动补全浏览器兼容css代码、源代码映射、本地服务器、热更新、热模块加载、文件清理、静态文件拷贝



#### 用到的命令行：

```
npm init -y		// 初始化

npm i webpack webpack-cli -D	// webpack 核心

npm i html-webpack-plugin html-loader -D	// 动态生成html插件

npm i mini-css-extract-plugin -D 	// 动态生成css文件插件

npm i style-loader css-loader less-loader sass-loader node-sass stylus-loader stylus -D	// 样式相关

npm i  optimize-css-assets-webpack-plugin -D	// 压缩css

npm i clean-webpack-plugin -D 	 // 清理dis文件夹

npm i webpack-dev-server -D		// 本地服务器

npm i eslint eslint-config-standard eslint-loader eslint-plugin-import eslint-plugin-node eslint-plugin-promise eslint-plugin-standard -D 	// ESlint代码规范

npm i babel-core babel-loader babel-preset-env -D // Babel相关

npm i uglifyjs-webpack-plugin	 // 代码压缩插件

npm i source-map-loader 	// 源码映射

npm i autoprefixer postcss-loader -D	// css预处理 自动补全css前缀 解决浏览器兼容

npm i copy-webpack-plugin -D	// 拷贝静态文件，但是和清理插件有冲突
```



#### 使用方法:  (先下载或者clone)

```
npm install		# 安装依赖模块
```

```
npm run start		# 运行开发环境，默认监听9090端口
```

```
npm run build		# 正式打包，用于生产环境
```



#### 配置过程：

###### 1. 初始化

```
npm init -y
```



###### 2. 安装 webpack 和 webpack-cli

```
npm i webpack webpack-cli -D
```



###### 3. 完善项目目录

- ###### 根目录下添加入口文件 `./src/index.js`

		![1528266954717](C:\Users\陆伟\AppData\Local\Temp\1528266954717.png)



- ###### 创建模板Html  `./src/tempalte/index.html`

		![1528267158993](C:\Users\陆伟\AppData\Local\Temp\1528267158993.png)

![](C:\Users\陆伟\Pictures\代码\carbon.png)



###### 4. 添加Html支持

- ###### 安装自动生成Html文件的插件，该Html文件能够自动绑定打包好的 `./dist/main.js`

```
npm i html-webpack-plugin -D
```

- ###### 添加 html 加载器，用来控制生成的 html

```
npm i html-loader -D
```

- ###### 添加 `webpack.config.js` 并配置html插件

```javascript
const HtmlWebPackPlugin = require("html-webpack-plugin")

module.exports = {
    module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true } // 打包的时候自动压缩
          }
        ]
      }
    ]
  },
    plugins: [
        new HtmlWebPackPlugin({
          template: "./src/template/index.html", // 原型
          filename: "./index.html" // 生成的文件名（默认在./dist目录下）
        })
      ]
  }
```



###### 5. 配置脚本

- ###### `package.json` 里面添加打包的脚本 ：

```
"scripts": {
    "dev": "webpack --mode development",
    "build": "webpack --mode production",
    "start": "webpack-dev-server --mode development --colors --profile"
  },
```

- ###### 测试：

```
npm run build
```



###### 6. 添加CSS支持

- ###### 安装 CSS 加载器 和 CSS打包插件

```
npm i mini-css-extract-plugin css-loader -D
```

- ###### 更新 `webpack.config.js`

```javascript
const HtmlWebPackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = {
    module: {
        rules: [
            {   // html加载器
                test: /\.html$/,
                use: [
                  {
                    loader: "html-loader",
                    options: { minimize: true } // 打包的时候自动压缩
                  }
                ]
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
          template: "./src/template/index.html", // 原型
          filename: "./index.html", // 生成的文件名（默认在./dist目录下）
          minify : true
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css",
        })
    ]
}
```

- ###### 添加 `./src/main.css`

```css
/* main.css */
#css {
    color: palevioletred;
}
```

- ######   更新 `./src/index.js` 用来测试 css 加载器和打包插件是否可以正常工作

```javascript
// index.js

// 引入css文件
import './main.css' 

console.log('I am index.js')

// 测试css
const obj1 = document.createElement('h1')
obj1.id = 'css'
obj1.innerHTML = '测试css'

document.body.appendChild(obj1)
```

- ###### 测试： 打包完成后，观察 `./dist` 文件夹的变化，并打开 `index.html `

```
npm run build
```

###### 

7. ###### 配置本地服务器 webpack-dev-server

- ###### 安装 webpack-dev-server

```
npm i webpack-dev-server -D
```

- ###### 在 `webpack.config.js` 里面配置 devServer 选项   

```javascript
// webpack.config.js

module.exports = {

...

    devServer: {
            contentBase: path.join(__dirname, 'dist'), // 服务于 dist/ 目录
            open: true, // 当open启用时，开发服务器将自动打开浏览器
            compress: true, // 为服务的所有内容启用gzip压缩
            host: '192.168.16.13', // 指定要使用的主机，默认是localhost，如果希望可以被外部访问，指定成 '0.0.0.0' 即可
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

...

}
    
```



###### 8. 清理每次打包生成的dist文件夹 

- ###### 安装 clean-webpack-plugin  插件

```
npm i clean-webpack-plugin -D
```

- ###### 更新  `webpack.config.js` 文件配置

```javascript
// webpack.config.js

const CleanWebpackPlugin = require('clean-webpack-plugin') // 清理dist文件夹插件

module.exports = {

...

    plugins: [
    	...
    	
        // 清理dist文件夹
        new CleanWebpackPlugin(['dist'])
        
        ...
    ]

...

}
```



###### 9. ESLint语法检查

- ###### 安装依赖项

```
npm i eslint eslint-config-standard eslint-loader eslint-plugin-import eslint-plugin-node eslint-plugin-promise eslint-plugin-standard -D
```

- ###### 添加配置文件 `.eslintrc.json`

```json
{
    "extends": "standard",
    "plugins": [
        "standard",
        "promise"
    ],
    "rules": {
        "indent": ["error", 4],
        "no-invalid-regexp": 0,
        "no-useless-escape": 0,
        "comma-dangle": 0
    }
}
```

- 更新 `webpack.config.js` 配置

```javascript
// webpack.config.js

const CleanWebpackPlugin = require('clean-webpack-plugin') // 清理dist文件夹插件

module.exports = {

...

    module: {
        rules: [
        	...
        
        	{ // Eslint
                enforce: 'pre', // 防止和其他加载器冲突
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
                options: {
                    // eslint options (if necessary)
                }
            }
            
            ...
	   ]
    },
...

}

```



10. ###### 更多配置详见 `webpack.config.js` 文件



11. ###### 参考文档

>[陈三的webpack4教程]: https://blog.zfanw.com/webpack-tutorial/
>[Webpack 4 Tutorial]: https://www.valentinog.com/blog/webpack-4-tutorial
>[webpack4配置笔记]: https://www.my-fe.pub/post/webpack-4-basic-config-note.html#copy-webpack-plugin
>[webpack4 升级与使用]: https://zhuanlan.zhihu.com/p/34421707
>
>

### 更多配置参考官方文档 

> **基本概念** : <https://webpack.docschina.org/concepts/>
> **配置示例** : <https://webpack.docschina.org/configuration/>
> **API** : <https://webpack.docschina.org/api/>
> **loaders** : <https://webpack.docschina.org/loaders//>
> **plugins** : <https://webpack.docschina.org/plugins/>