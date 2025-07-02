import { View, Text, Image, Picker } from '@tarojs/components';
import PageHeader from '@components/PageHeader';
import { useState } from 'react';

// 导入图标资源
// import IconAI from '@imgs/icon-ai@2x.png';
import IconSkin from '@imgs/icon-cloth@3x.png';
import IconAccount from '@imgs/icon-account@3x.png';
import IconService from '@imgs/icon-service@3x.png';
import IconArrowRight from '../../imgs/icon-right@2x.png';

import './index.less';
//  // 假设有右箭头图标

const skinOptions = ['快乐小狗', '美丽宝妈', '元气少年', '可爱宝宝']; // 可自行扩展
const monthOptions = Array.from({ length: 12 }, (_, i) => `${i + 1}月`);

export default function Setting() {
  const [birthdayMonth, setBirthdayMonth] = useState<number | null>(null);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showSkinPicker, setShowSkinPicker] = useState(false);
  const monthList = Array.from({length: 12}, (_, i) => `${i+1}月`);
  const [selectedSkin, setSelectedSkin] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  const settingItems = [
    // {
    //   icon: IconAI,
    //   text: 'AI 设置',
    //   extraText: '慈祥老爷爷',
    //   onClick: () => { /* TODO: Navigate to AI settings */ }
    // },
    {
      icon: IconSkin,
      text: '我的皮肤',
      range: skinOptions,
      value: selectedSkin || '请选择',
      onClick: () => {
        console.log('点击了')
        setShowSkinPicker(true)
      }
    },
    {
      icon: IconSkin,
      text: '生日月',
      range: monthOptions,
      value: selectedMonth || '请选择',
      onClick: () => setShowMonthPicker(true)
    },
    {
      icon: IconService,
      text: '联系客服',
      onClick: () => { /* TODO: Navigate to Contact Service */ }
    },
  ];

  const updateUserInfo = () => {
    // 调用接口保存用户信息
  }
  return (
    <View className='setting-page'>
      <PageHeader title='设置' />
      <View className='setting-list'>
        {settingItems.map((item, index) => (
          <View className='setting-item' key={index} onClick={item.onClick}>
            <View className='setting-item__left'>
              <Image src={item.icon} className='setting-item__icon' mode='aspectFit' />
              <Text className='setting-item__text'>{item.text}</Text>
            </View>
           
            {item.range ? 
            <Picker
              mode="selector"
              range={item.range}
              onChange={e => {
                const value = skinOptions[e.detail.value];
                setSelectedSkin(value);
                setShowSkinPicker(false);
                // updateUserInfo({ skin: value });
              }}
              onCancel={() => setShowSkinPicker(false)}
            >
            <View className='setting-item__right'>
              {item.value && <Text className='setting-item__extra-text'>{item.value}</Text>}
              <Image src={IconArrowRight} className='setting-item__arrow' mode='aspectFit' />
            </View>
            </Picker> : <></>}
          </View>
        ))}
      </View>
    </View>
  );
} 