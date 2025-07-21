import { View, Button, Image } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import PageHeader from '@components/PageHeader';
import UserProfile from '@components/UserProfile';

import IconMember from '@imgs/pic-member@2x.png' 
import IconSetting from '@imgs/pic-setting@2x.png'

import './index.less'

export default function UserCenter () {
  useLoad(() => {
    console.log('Page loaded.')
  })

  const goTo = (route: string) => {
    Taro.vibrateShort({
      type: 'light'
    });
    Taro.navigateTo({ url: `/pages/${route}/index` })
  }

  const goBack = () => {
    Taro.navigateBack()
  }

  const goToSetting = () => {
    Taro.navigateTo({
      url: '/pages/setting/index'
    });
  };

  const handleProfileChange = (profile) => {
    console.log('Profile updated:', profile);
  };

  const handleEditClick = () => {
    console.log('Edit clicked');
  };

  return (
    <View className='user-center'>
      {/* 顶部导航 */}
      <PageHeader title='我的' />
      {/* 用户信息 */}
      <UserProfile 
        onProfileChange={handleProfileChange}
        onEditClick={handleEditClick}
      />
      {/* 皮肤集市卡片 */}
      <View className='user-center__market'>
        <View className='user-center__market-info'>
          <View className='user-center__market-title'>皮肤集市</View>
          <View className='user-center__market-desc'>焕新实验室</View>
          <Button className='user-center__market-btn' onClick={() => goTo('emoji-list')}>确定</Button>
        </View>
      </View>
      {/* 功能卡片区 */}
      <View className='user-center__features'>
        <View className='user-center__feature' onClick={() => goTo('member-plan')}>
          <Image className='user-center__feature-plan' src={IconMember}></Image>
          <View className='user-center__feature-title' >会员计划</View>
          <View className='user-center__feature-desc'>解锁更多权限</View>
        </View>
        <View className='user-center__feature'  onClick={goToSetting}>
          <Image className='user-center__feature-setting' src={IconSetting}></Image>
          <View className='user-center__feature-title'>设置中心</View>
          <View className='user-center__feature-desc'>系统个性化引擎</View>
        </View>
      </View>
    </View>
  )
}
