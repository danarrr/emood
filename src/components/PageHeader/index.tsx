import { View } from '@tarojs/components';
import './index.less';

interface PageHeaderProps {
  goBack: () => void;
  title: string;
}

export default function PageHeader({ goBack, title }: PageHeaderProps) {
  return (
    <View className='page-header'>
      <View className='page-header__back' onClick={goBack}>←</View>
      <View className='page-header__title'>{title}</View>
    </View>
  );
} 