/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */


 console.info('=========================')
 console.info(process.env)
 console.info('=========================')

module.exports = {
    // 选项...
    // publicPath:'./',
    // publicPath: '/resources/module/mtp/',
    publicPath: process.env.PUBLIC_URL,
    configureWebpack: {
        devtool: process.env.NODE_ENV !== 'prod' ? 'eval-source-map' : false//'source-map'
    },
    productionSourceMap: false
}