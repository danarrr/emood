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

export default function MemberPlan () {
  const [activeIndex, setActiveIndex] = useState(0);
  const userInfo = useAppSelector(state => state.user.userInfo.data);

  const vipStatus = userInfo?.isMember ? '已是会员' : '还未加入会员';

  useEffect(() => {
  }, [activeIndex.toString()]);

  const handleProfileChange = (profile) => {
    console.log('Profile updated:', profile);
  };

  // const handleEditClick = () => {
  //   console.log('Edit clicked');
  // };

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
      title: '正在施工中，需要添加客服：🌏danarrr',
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
              <View className='member-plan__card-price'>{index === 0 ? '￥59.9/半年' : '￥99.9/年'}</View>
            </View>
          </SwiperItem>
        ))}
      </Swiper>
      <View className='member-plan__benefits-title'>- 尊享会员3大权益 -</View>
      <View className='member-plan__benefits'>
        <View className='member-plan__benefit'>
          <Image src={IconSkin}></Image>
          <View className='member-plan__benefit-text'>
            皮肤全解锁
            <View className='member-plan__benefit-tip'>180天有效期</View>
          </View>
        </View>
        <View className='member-plan__benefit'>
          <Image src={IconAi}></Image>
          <View className='member-plan__benefit-text'>
            AI聊天
            <View className='member-plan__benefit-tip'>300个星光</View>
          </View>
        </View>
        <View className='member-plan__benefit'>
          <Image src={IconImage}></Image>
          <View className='member-plan__benefit-text'>上传图片
            <View className='member-plan__benefit-tip'>不限张数</View>
          </View>
        </View>
      </View>
      <View className='member-plan__guide-title'>商品支付指南</View>
      <View className='member-plan__guide'>
        根据所选选项，这是按月或按年计费的订阅产品。对于应用内支付，订阅将在 App Store 指定的日期处理。<br/>
        当前订阅到期结束前的24小时内，订阅将自动续订。您可以在 Apple帐户设置中管理和取消订阅。<br/>
        当前订阅费用将从您的 Apple帐户扣除。<br/>
        有关付款或退款的查询，请联系 Apple 客服。
      </View>
      <Button className='member-plan__pay-btn' onClick={handlePayClick}>立即支付</Button>
    </View>
  )
}
