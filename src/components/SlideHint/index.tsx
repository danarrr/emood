import React from 'react';
import { View } from '@tarojs/components';
import './index.less';

interface SlideHintProps {
  show?: boolean;
  position?: 'left' | 'right';
  className?: string;
}

const SlideHint: React.FC<SlideHintProps> = ({ 
  show = true, 
  position = 'right',
  className = ''
}) => {
  if (!show) return null;

  return (
    <View className={`slide-hint slide-hint--${position} ${className}`}>
      <View className="slide-hint__slider"></View>
    </View>
  );
};

export default SlideHint; 