const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production' ? '/brush-equip' : '/',
  transpileDependencies: true,
  runtimeCompiler: true,
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "@/assets/base.scss";`,
        //旧版本用prependData，新版比如cli5本用additionalData
        //注意：sass-loader将文件引用写入每个组件，适合全局引入变量，但不适合在单页面应用中添加样式，如果是全局样式（非变量），建议在main.js里引入
      },
    },
  },
});
