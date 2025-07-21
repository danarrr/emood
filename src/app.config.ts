export default defineAppConfig({
  pages: [
    'pages/mood/index',
    'pages/index/index',
    'pages/animation/index',
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
})
