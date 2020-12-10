const path = require('path')
const appname = 'dist' // 项目文件名
const appPort = 8110 // 真机同步端口,浏览器打开端口。
module.exports = {
	publicPath: process.env.NODE_ENV === 'production' ? './' : './',
  outputDir: './' + appname, // 运行时生成的生产环境构建文件的目录(默认""dist""，构建之前会被清除)
  indexPath: 'index.html', // 指定生成的 index.html 的输出路径(相对于 outputDir)也可以是一个绝对路径。
  filenameHashing: process.env.NODE_ENV === 'production', /** 开发环境关闭文件哈希值 */
  productionSourceMap: false,
  pages: {
    // pages 里配置的路径和文件名在你的文档目录必须存在 否则启动服务会报错
    index: {
      // 除了 entry 之外都是可选的
      entry: 'src/main.js', // page 的入口,每个“page”应该有一个对应的 JavaScript 入口文件
      template: 'public/index.html', // 模板来源
      filename: 'index.html', // 在 apiCloud/index.html 的输出
      title: '美好生活' // 当使用 title 选项时,在 template 中使用：<title><%= htmlWebpackPlugin.options.title %></title>
    }
  },
  lintOnSave: false, // 是否在保存的时候检查
  css: {
    loaderOptions: {
      less: {
        // 若使用 less-loader@5，请移除 lessOptions 这一级，直接配置选项。
        modifyVars: {
          // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
          hack: `true; @import "${path.join(__dirname, 'src/styles/var.less')}";`
        }
      }
    }
  },
  // webpack配置
  chainWebpack: config => {
    config.entry('index').add('@babel/polyfill') // 添加babel-poiyfill
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type =>
      addStyleResource(config.module.rule('less').oneOf(type))
    )
    // 清除css，js版本号
    config.output.filename('static/[name].js').end()
    config.output.chunkFilename('static/[name].js').end()
    // 为生产环境修改配置...
    if (process.env.NODE_ENV === 'production') {
      config.plugin('extract-css').tap(args => [{
        filename: 'static/[name].css',
        chunkFilename: 'static/[name].css'
      }])
    }
  },
  // webpack-dev-server配置
  devServer: {
    // 环境配置
    host: 'localhost',
    // host: '192.168.1.158',
    hot: false,
    port: appPort,
    https: false,
    hotOnly: false,
    open: true,
    proxy: {
      /** 解决本地测试跨域问题 */
      '/api': {
        target: 'https://live.tosolomo.com/app/api/v1',
        // target: 'http://192.168.1.103/app/api/v1',
        // target: 'https://test.mhshjy.com/app/api/v1',
        // target: 'https://www.fastmock.site/mock/c30751817f92f0a4855537591d860a97/app/api/v1',
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  transpileDependencies: ['swiper', 'dom7', 'ssr-window'],
  // 第三方插件配置
  pluginOptions: {}
}
function addStyleResource (rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.join(__dirname, 'src/styles/var.less') // 需要全局导入的less
      ]
    })
}
