import { View, Button, Image, Progress } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import React, { useState, useRef, useEffect } from 'react'
import IconSkin from '../../imgs/icon-cloth@2x.png'
import IconAi from '../../imgs/icon-ai@2x.png'
import IconImage from '../../imgs/icon-pic@2x.png'

import PageHeader from '@components/PageHeader';
import UserProfile from '@components/UserProfile';

import './index.less'

export default function MemberPlan () {
  useLoad(() => {
    console.log('Page loaded.')
  })

  const goBack = () => {
    Taro.navigateBack();
  }

  const [activeIndex, setActiveIndex] = useState(0);
  const cardsContainerRef = useRef<any>(null);
  const cardRefs = useRef<(any)[]>([]);

  useEffect(() => {
    const container = cardsContainerRef.current;
    const cards = cardRefs.current;

    if (!container || cards.length === 0) return;

    const handleScroll = () => {
      console.log('hi比卡u 发阿发')
      const containerVisibleCenter = container.scrollLeft + container.offsetWidth / 2;

      let minDistance = Infinity;
      let closestIndex = -1;

      cards.forEach((card, index) => {
        if (card) {
          const cardCenter = card.offsetLeft + card.offsetWidth / 2;
          const distance = Math.abs(cardCenter - containerVisibleCenter);

          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
          }
        }
      });
      if (closestIndex !== -1 && closestIndex !== activeIndex) {
        setActiveIndex(closestIndex);
      }
    };

    container.addEventListener('scroll', handleScroll);

    const initialCheck = () => {
      const containerVisibleCenter = container.scrollLeft + container.offsetWidth / 2;

      let minDistance = Infinity;
      let closestIndex = -1;

      cards.forEach((card, index) => {
        if (card) {
          const cardCenter = card.offsetLeft + card.offsetWidth / 2;
          const distance = Math.abs(cardCenter - containerVisibleCenter);

          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
          }
        }
      });
       if (closestIndex !== -1) {
           setActiveIndex(closestIndex);
       }
    };

    const timeoutId = setTimeout(initialCheck, 0);

    // return () => {
    //   container.removeEventListener('scroll', handleScroll);
    //   clearTimeout(timeoutId);
    // };
  }, [activeIndex]);

  const handleProfileChange = (profile) => {
    console.log('Profile updated:', profile);
  };

  const handleEditClick = () => {
    console.log('Edit clicked');
  };

  return (
    <View className='member-plan'>
      {/* 顶部导航 */}
      <PageHeader goBack={goBack} title='我的' />
      {/* 用户信息 */}
      <UserProfile 
        onProfileChange={handleProfileChange}
        onEditClick={handleEditClick}
      />
      <View className='member-plan__cards' ref={cardsContainerRef}>
        {[0, 1].map((_, index) => (
            <View
                key={index}
                className={
                    'member-plan__card' +
                    (index === activeIndex ? ' member-plan__card--selected' : '') +
                    (index === 0 ? ' member-plan__card--half' : ' member-plan__card--year')
                }
                ref={el => cardRefs.current[index] = el}
            >
              <View className='member-plan__card-title'>{index === 0 ? '半年会员' : '年度会员'}</View>
              <View className='member-plan__card-price'>{index === 0 ? '￥59.9/半年' : '￥99.9/年'}</View>
            </View>
        ))}
      </View>
      <View className='member-plan__benefits-title'>- 尊享会员3大权益 -</View>
      <View className='member-plan__benefits'>
        <View className='member-plan__benefit'>
          <Image src={IconSkin}></Image>
          <View className='member-plan__benefit-text'>皮肤全解锁<br/>180天有效期</View>
        </View>
        <View className='member-plan__benefit'>
          <Image src={IconAi}></Image>
          <View className='member-plan__benefit-text'>AI聊天<br/>300个量光</View>
        </View>
        <View className='member-plan__benefit'>
          <Image src={IconImage}></Image>
          <View className='member-plan__benefit-text'>上传图片<br/>不限张数</View>
        </View>
      </View>
      <View className='member-plan__guide-title'>商品支付指南</View>
      <View className='member-plan__guide'>
        根据所选选项，这是按月或按年计费的订阅产品。对于应用内支付，订阅将在 App Store 指定的日期处理。<br/>
        当前订阅到期结束前的24小时内，订阅将自动续订。您可以在 Apple帐户设置中管理和取消订阅。<br/>
        当前订阅费用将从您的 Apple帐户扣除。<br/>
        有关付款或退款的查询，请联系 Apple 客服。
      </View>
      <Button className='member-plan__pay-btn'>立即支付</Button>
    </View>
  )
}
