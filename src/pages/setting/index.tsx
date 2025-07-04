import Taro from '@tarojs/taro';
import { View, Text, Image, Picker } from '@tarojs/components';
import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { getUserInfoAction } from '@/store/user/actions'

import PageHeader from '@components/PageHeader';

import { cloudRequest } from '@/utils/request';

// 导入图标资源
// import IconAI from '@imgs/icon-ai@2x.png';
import IconSkin from '@imgs/icon-cloth@3x.png';
import IconAccount from '@imgs/icon-account@3x.png';
import IconService from '@imgs/icon-service@3x.png';
import IconArrowRight from '@imgs/icon-right@2x.png';

import './index.less';




const skinOptions = {
  'emoji1': '快乐小狗',
  'emoji2': '美丽宝妈',
  'emoji3': '元气少年',
  'emoji4': '元气少年',
  'emoji5': '元气少年',
  'emoji6': '元气少年',
}

// 皮肤选项生成函数
function getSkinRange(hasSkinList: string[], skinOptions: Record<string, string>) {
  if (!Array.isArray(hasSkinList) || hasSkinList.length === 0) return [];
  if (hasSkinList.includes('all')) return Object.values(skinOptions);
  return hasSkinList.map(skin => skinOptions[skin]).filter(Boolean);
}

export default function Setting() {
  const userInfo = (useAppSelector((state) => state.user.userInfo?.data) || {}) as Record<string, any>;
  const dispatch = useAppDispatch();
  const [hasSkinList, setSkinList] = useState<string[]>([])
  const monthList = Array.from({length: 12}, (_, i) => `${i+1}`);
  const [selectedSkin, setSelectedSkin] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('请选择');
  
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
      range: getSkinRange(hasSkinList, skinOptions),
      value: selectedSkin || '请选择',
      onChange: async(e) => {
        const value = getSkinRange(hasSkinList, skinOptions)[e.detail.value];
        setSelectedSkin(value);
        await updateUserInfo({ currentSkin: Object.keys(skinOptions)[e.detail.value] });
        await getUserInfo()
      }
    },
    {
      icon: IconSkin,
      text: '生日月(有彩蛋)',
      range: monthList.map(month => month + '月'),
      value: selectedMonth || '请选择',
      onChange: async (e) => {
        const value = monthList[e.detail.value];
        setSelectedMonth(value+'月');
        await updateUserInfo({ birthdayMonth: value });
        await getUserInfo()
      }
    },
    {
      icon: IconService,
      text: '联系客服',
      onClick: () => {
        Taro.showToast({
          title: '正在施工中，需要添加客服：🌏danarrr',
          icon: 'none', // 不显示图标
          duration: 5000 // 显示时长，单位 ms
        })
       }
    },
  ];

  useEffect(() => {
    getHasSkinList();
  }, [userInfo.userid]);

  useEffect(() => {
    const skinRange = getSkinRange(hasSkinList, skinOptions);
    if (userInfo.currentSkin && skinRange.length > 0) {
      const skinName = skinOptions[userInfo.currentSkin];
      if (skinRange.includes(skinName)) {
        setSelectedSkin(skinName);
      } else {
        setSelectedSkin('');
      }
    }
  }, [hasSkinList, userInfo.currentSkin]);

  // 回填生日月
  useEffect(() => {
    if (userInfo.birthdayMonth) {
      setSelectedMonth(userInfo.birthdayMonth + '月');
    }
  }, [userInfo.birthdayMonth]);

  const getHasSkinList = async() =>{
    if (!userInfo.userid) return;
    const { data } = await cloudRequest({
      path: '/skin/list', // 业务自定义路径和参数
      method: 'GET', // 根据业务选择对应方法
      data: {
        userId: userInfo.userid,
      }
    })
    setSkinList(data)
  }


  const updateUserInfo = async(data) => {
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

  // 皮肤选项 range
  const skinRange = getSkinRange(hasSkinList, skinOptions);
  // 当前皮肤索引
  const selectedSkinIndex = skinRange.findIndex(s => s === selectedSkin);
  // 当前生日月索引
  const selectedMonthIndex = monthList.findIndex(m => selectedMonth.replace('月', '') === m);

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
              value={item.text === '我的皮肤' ? selectedSkinIndex : item.text === '生日月(有彩蛋)' ? selectedMonthIndex : 0}
              onChange={item.onChange}
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