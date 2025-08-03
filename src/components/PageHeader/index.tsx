import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useEffect, useState } from 'react';
import './index.less';

interface PageHeaderProps {
  // goBack: () => void;
  title: string;
}

export default function PageHeader({ title }: PageHeaderProps) {
  const [statusBarHeight, setStatusBarHeight] = useState(20);

  useEffect(() => {
    const systemInfo = Taro.getSystemInfoSync();
    if (systemInfo?.statusBarHeight) {
      setStatusBarHeight(systemInfo.statusBarHeight);
    }
  }, []);

  const goBack = () => {
    // 获取当前页面栈
    const pages = Taro.getCurrentPages();
    
    // 如果页面栈长度大于1，说明有上一页，可以返回
    if (pages.length > 1) {
      Taro.navigateBack();
    } else {
      // 如果没有上一页，跳转到首页
      Taro.redirectTo({ url: '/pages/mood/index' });
    }
  }

  return (
    <View className='page-header' style={{ padding: `${statusBarHeight}px 16px 12px 16px` }}>
      <View className='page-header__back' onClick={goBack}>←</View>
      {/* <View className='page-header__title'>{title}</View> */}
    </View>
  );
} 