export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/mood/index',
    'pages/mood-detail/index',
    'pages/mood-list/index',
    'pages/member-plan/index',
    'pages/user-center/index',
    'pages/emoji-list/index',
    'pages/setting/index',
    'pages/identity/index',
  ],
  subpackages: [
    {
      root: 'subpackages/packageMbook',
      pages: [
        'mood-book/index', // 分包页面
      ]
    }
    // 可以有多个分包
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#f3f3f3',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
    navigationStyle: 'custom'
  }, 
  "plugins": {
    "WechatSI": {
      "version": "0.0.7",
      "provider": "wx069ba97219f66d99"
    }
  }
})
