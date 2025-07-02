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
    Taro.navigateBack()
  }

  return (
    <View className='page-header' style={{ padding: `${statusBarHeight}px 16px 12px 16px` }}>
      <View className='page-header__back' onClick={goBack}>←</View>
      {/* <View className='page-header__title'>{title}</View> */}
    </View>
  );
} 