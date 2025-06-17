import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import PageHeader from '../../components/PageHeader';
import './index.less';

// 导入图标资源
import IconAI from '../../imgs/icon-ai@2x.png';
import IconSkin from '../../imgs/icon-cloth@2x.png';
import IconAccount from '../../imgs/icon-account@3x.png';
import IconService from '../../imgs/icon-service@3x.png';
// import IconArrowRight from '../../imgs/icon-arrow-right.png'; // 假设有右箭头图标

export default function Setting() {
  const goBack = () => {
    Taro.navigateBack();
  };

  const settingItems = [
    {
      icon: IconAI,
      text: 'AI 设置',
      extraText: '慈祥老爷爷',
      onClick: () => { /* TODO: Navigate to AI settings */ }
    },
    {
      icon: IconSkin,
      text: '我的皮肤',
      onClick: () => { /* TODO: Navigate to My Skin */ }
    },
    {
      icon: IconAccount,
      text: '账户设置',
      onClick: () => { /* TODO: Navigate to Account Settings */ }
    },
    {
      icon: IconService,
      text: '联系客服',
      onClick: () => { /* TODO: Navigate to Contact Service */ }
    },
  ];

  return (
    <View className='setting-page'>
      <PageHeader goBack={goBack} title='设置' />
      <View className='setting-list'>
        {settingItems.map((item, index) => (
          <View className='setting-item' key={index} onClick={item.onClick}>
            <View className='setting-item__left'>
              <Image src={item.icon} className='setting-item__icon' mode='aspectFit' />
              <Text className='setting-item__text'>{item.text}</Text>
            </View>
            <View className='setting-item__right'>
              {item.extraText && <Text className='setting-item__extra-text'>{item.extraText}</Text>}
              {/* <Image src={IconArrowRight} className='setting-item__arrow' mode='aspectFit' /> */}
              >
            </View>
          </View>
        ))}
      </View>
    </View>
  );
} 