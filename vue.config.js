module.exports = {
  publicPath: './',
  pages: {
    danmaku: {
      entry: 'src/renderer/views/board-danmaku/main.ts',
      template: 'public/index.html',
      filename: 'danmaku.html',
      title: '弹幕看板',
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ['chunk-vendors', 'chunk-common', 'danmaku'],
    },
  },
  devServer: {
    host: '0.0.0.0',
    port: 8080,
  },
};
