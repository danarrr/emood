import { View, Text, Image, Picker } from '@tarojs/components';
import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { getUserInfoAction } from '@/store/user/actions'
import { current } from '@reduxjs/toolkit';

import PageHeader from '@components/PageHeader';

import { cloudRequest } from '@/utils/request';

// 导入图标资源
// import IconAI from '@imgs/icon-ai@2x.png';
import IconSkin from '@imgs/icon-cloth@3x.png';
import IconAccount from '@imgs/icon-account@3x.png';
import IconService from '@imgs/icon-service@3x.png';
import IconArrowRight from '../../imgs/icon-right@2x.png';

import './index.less';

//  // 假设有右箭头图标


const skinOptions = {
  'emoji1': '快乐小狗',
  'emoji2': '美丽宝妈',
  'emoji3': '元气少年',
  'emoji4': '元气少年',
  'emoji5': '元气少年',
  'emoji6': '元气少年',
}

export default function Setting() {
  const userInfo = useAppSelector((state) => state.user.userInfo?.data);
  const dispatch = useAppDispatch();
  const [birthdayMonth, setBirthdayMonth] = useState<number | null>(null);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showSkinPicker, setShowSkinPicker] = useState(false);
  const [hasSkinList, setSkinList] = useState(null)
  const monthList = Array.from({length: 12}, (_, i) => `${i+1}`);
  const [selectedSkin, setSelectedSkin] = useState(skinOptions[userInfo?.currentSkin]);
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
      range: hasSkinList?.includes('all') ? Object.values(skinOptions): hasSkinList?.map(skin => {return skinOptions[skin]}),
      value: selectedSkin || '请选择',
      onClick: () => {
        setShowSkinPicker(true)
      },
      onChange: async(e) => {
        const value = Object.values(skinOptions)[e.detail.value];
        setSelectedSkin(value);
        setShowSkinPicker(false);
        await updateUserInfo({ currentSkin: Object.keys(skinOptions)[e.detail.value] });
        await getUserInfo()
      }
    },
    {
      icon: IconSkin,
      text: '生日月(有彩蛋)',
      range: monthList.map(month => month + '月'),
      value: selectedMonth || '请选择',
      onClick: () => setShowMonthPicker(true),
      onChange: async (e) => {
        const value = monthList[e.detail.value];
        setSelectedMonth(value+'月');
        setShowMonthPicker(false);
        await updateUserInfo({ birthdayMonth: value });
        await getUserInfo()
      }
    },
    {
      icon: IconService,
      text: '联系客服',
      onClick: () => { /* TODO: Navigate to Contact Service */ }
    },
  ];

  useEffect(() => {
    getHasSkinList();
  }, [userInfo.userid])

  const getHasSkinList = async() =>{
    const { data } = await cloudRequest({
      path: '/skin/list', // 业务自定义路径和参数
      method: 'GET', // 根据业务选择对应方法
      data: {
        userId: userInfo.userid,
      }
    })
    setSkinList(data.data)
  }


  const updateUserInfo = async(data) => {
    // 您不是会员。您当前没有这套皮肤 都不可购买 @anitatodo 皮肤列表里得有这套皮肤
    await cloudRequest({
      path: '/account/user-info',
      method: 'PUT',
      data,
    })
    // 返回成功。再次请求用户信息
  }

  const getUserInfo = () => {
    dispatch(getUserInfoAction())
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
                item.onChange(e)
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