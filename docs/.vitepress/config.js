// module.exports = {
//     title:"前端随笔",
//     description:"一个学习、记录、分享的前端个人博客"
// };
// vitepress/config.js
module.exports = {
    title:"前端随笔",
    description:"一个学习、记录、分享的前端个人博客",
    base: '/', //  部署时的路径 默认 /  可以使用二级地址 /base/
    // lang: 'en-US', //语言
    // 网页头部配置，引入需要图标，css，js
    head: [
      // 改变title的图标
      [
        'link',
        {
          rel: 'icon',
          href: '/img/linktolink.png',//图片放在public文件夹下
        },
      ],
    ],
    // 主题配置
    themeConfig: {
      repo: 'vuejs/vitepress', // 你的 github 仓库地址，网页的右上角会跳转
      //   头部导航
      nav: [
        { text: '首页', link: '/' },
        { text: '关于', link: '/about/' },
      ],
      //   侧边导航
      sidebar: [
        { text: '我的', link: '/mine/' }
      ]
    }
  }