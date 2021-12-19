
module.exports = {
    title:"前端随笔",
    // description:"一个学习、记录、分享的前端个人博客",
    base: '/', //  部署时的路径 默认 /  可以使用二级地址 /base/
    // lang: 'en-US', //语言
    // 网页头部配置，引入需要图标，css，js
    head: [
      // 改变title的图标
      [
        'link',
        {
          rel: 'icon',
          href: '/mzy.png',
        },
      ],
    ],
    // 主题配置
    themeConfig: {
      repo: 'https://github.com/Mzyyyyy', 
      //   头部导航
      nav: [
        { text: '首页', link: '/' },
      ],
      //   侧边导航
      sidebar: [
        { text: '介绍', link: '/mine/' },
        { text: 'CLI 和 Node scripts', link: '/cli/' },
        { text: 'JS', link: '/js/' },
        { text: 'Vue', link: '/vue/' },
        { text: 'TS', link: '/ts/' },
        { text: 'HTTP', link: '/http/' },
        { text: 'CSS', link: '/css/' },
        { text: '算法', link: '/leetcode/' }
      ]
    }
  }