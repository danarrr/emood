import { View, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import PageHeader from '@components/PageHeader';
import UserProfile from '@components/UserProfile';

import IconMember from '@imgs/pic-member@2x.png' 
import IconSetting from '@imgs/pic-setting@2x.png'

import { cloudRequest } from '@/utils/request';

import './index.less'

export default function UserCenter () {
  // 添加状态管理
  const [configData, setConfigData] = useState(null)
  const [loading, setLoading] = useState(true)

  // 页面加载时调用全局配置接口
  useEffect(() => {
    fetchGlobalConfig()
  }, [])

  // 获取全局配置
  const fetchGlobalConfig = async () => {
    try {
      setLoading(true)
      const result = await cloudRequest({
        path: '/global-config/all',
        method: 'GET'
      })
      
      if (result.statusCode === 200 && result.data) {
        setConfigData(result.data?.data)
      } else {
        console.error('获取全局配置失败:', result)
      }
    } catch (error) {
      console.error('获取全局配置出错:', error)
    } finally {
      setLoading(false)
    }
  }

  // 判断模块是否展示
  const shouldShowModule = (moduleKey: string) => {
    console.log('configData', configData)
    if (!configData) return true // 如果配置未加载，默认展示
    return configData[moduleKey] // 根据配置决定是否展示
  }

  const goTo = (route: string) => {
    Taro.vibrateShort({
      type: 'light'
    });
    Taro.navigateTo({ url: `/pages/${route}/index` })
  }

  const goToSetting = () => {
    Taro.navigateTo({
      url: '/pages/setting/index'
    });
  };

  const handleProfileChange = async(result) => {
    await updateUserInfo(result)
  };

  const handleEditClick = () => {
    console.log('Edit clicked');
  };

  const updateUserInfo = async(data) => {
    // 校验特殊字符
    // const specialCharRegex = /[^\u4e00-\u9fa5a-zA-Z0-9\s]/;
    // if (specialCharRegex.test(data.newNickName)) {
    //   Taro.showToast({
    //     title: '不支持特殊字符',
    //     icon: 'none',
    //     duration: 2000
    //   });
    //   return;
    // }
    
    if(!data.nickName || !data.avatarUrl) {return false;}
    const result = await cloudRequest({
      path: '/account/user-info',
      method: 'PUT',
      data: {
        nickname: data.nickName,
        avatar: data.avatarUrl
      },
    })
    if (result.statusCode === 200) {
      Taro.showToast({
        title: '保存成功',
        icon: 'none',
        duration: 2000
      });
    } else {
      Taro.showToast({
        title: '保存失败',
        icon: 'none',
        duration: 2000
      });
    }
    // 返回成功。再次请求用户信息
  }

  // 如果正在加载，显示加载状态
  if (loading) {
    return (
      <View className='user-center'>
        <PageHeader title='我的' />
        <View style={{ textAlign: 'center', padding: '50px 0' }}>
          加载中...
        </View>
      </View>
    )
  }

  return (
    <View className='user-center'>
      {/* 顶部导航 */}
      <PageHeader title='我的' />
      {/* 用户信息 */}
      <UserProfile 
        onProfileChange={handleProfileChange}
        onEditClick={handleEditClick}
      />
      {shouldShowModule('show_skin_market') && (
      <>
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
      </>
      )}
    </View>
  )
}
