import { View, Button, Image, Swiper, SwiperItem  } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { useAppSelector } from '@/store'

import PageHeader from '@components/PageHeader';
import UserProfile from '@components/UserProfile';

import IconSkin from '@imgs/icon-cloth@2x.png'
import IconAi from '@imgs/icon-ai@2x.png'
import IconImage from '@imgs/icon-pic@2x.png'

import './index.less'

const MEMBER_BENEFITS = {
  // 半年
  0: [
    {
      icon: IconSkin,
      title: "皮肤全解锁",
      tip: "180天有效期"
    },
    {
      icon: IconAi,
      title: "AI功能",
      tip: "6个月月度总结、语音自动识别功能"
    },
    {
      icon: IconImage,
      title: "上传图片",
      tip: "180天不限张数"
    }
  ],
  // 一年
  1: [
    {
      icon: IconSkin,
      title: "皮肤全解锁",
      tip: "365天有效期"
    },
    {
      icon: IconAi,
      title: "AI总结",
      tip: "12个月月度总结、语音自动识别功能"
    },
    {
      icon: IconImage,
      title: "上传图片",
      tip: "365天不限张数"
    }
  ]
};

export default function MemberPlan () {
  const [activeIndex, setActiveIndex] = useState(0);
  const userInfo = useAppSelector(state => state.user.userInfo.data);

  const vipStatus = userInfo?.isMember ? '已是会员' : '还未加入会员';

  useEffect(() => {
  }, [activeIndex.toString()]);

  const handleProfileChange = (profile) => {
    console.log('Profile updated:', profile);
  };

  const handleEditClick = () => {
    console.log('Edit clicked');
  };

  const handlePayClick = async() => {
    // const result = await cloudRequest({
    //   path: '/member/save', // 业务自定义路径和参数
    //   method: 'POST', // 根据业务选择对应方法
    //   data: {
    //     duration: 'half_year',
    //     userId: userinfo.userid
    //   }
    // })
   
    Taro.showToast({
      title: '正在施工中，需要添加客服🌏：13417008504',
      icon: 'none', // 不显示图标
      duration: 5000 // 显示时长，单位 ms
    })
  }

  return (
    <View className='member-plan'>
      {/* 顶部导航 */}
      <PageHeader title='会员计划' />
      {/* 用户信息 */}
      <UserProfile 
        onProfileChange={handleProfileChange}
        onEditClick={handleEditClick}
        vipStatus={vipStatus}
      />
      <Swiper
        className='member-plan__cards'
        circular
        nextMargin={'40px'}
        indicatorDots={false}
        current={activeIndex}
        onChange={e => setActiveIndex(e.detail.current)}
      >
        {[0, 1].map((_, index) => (
          <SwiperItem key={index} >
            <View
              className={
                'member-plan__card' +
                (index !== activeIndex ? ' member-plan__card--not-selected' : '') +
                (index === 0 ? ' member-plan__card--half' : ' member-plan__card--year')
              }
            >
              <View className='member-plan__card-title'>{index === 0 ? '半年会员' : '年度会员'}</View>
              <View className='member-plan__card-price'>{index === 0 ? '￥39.9/半年' : '￥59.9/年'}</View>
            </View>
          </SwiperItem>
        ))}
      </Swiper>
      <View className='member-plan__benefits-title'>- 尊享会员3大权益 -</View>
      <View className='member-plan__benefits'>
        {MEMBER_BENEFITS[activeIndex].map(ben => (
          <View className='member-plan__benefit'>
            <Image src={ben.icon}></Image>
            <View className='member-plan__benefit-text'>
              {ben.title}
              <View className='member-plan__benefit-tip'>{ben.tip}</View>
            </View>
          </View>
        ))}
      </View>
      <View className='member-plan__guide-title'>商品支付指南</View>
      <View className='member-plan__guide'>
        微信支付功能未上线，如有诉求请添加客服🌏：13417008504 即可开通。
      </View>
      <Button className='member-plan__pay-btn' onClick={handlePayClick}>立即支付</Button>
    </View>
  )
}
