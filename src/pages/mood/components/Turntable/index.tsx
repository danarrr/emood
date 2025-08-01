import Taro from '@tarojs/taro';
import { useRef, useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { View, Image } from '@tarojs/components';
import { useAppSelector } from '@/store';

import { getEmojiMap } from '@/utils/emojiMaps';


import './index.less';

interface TurntableProps {
  onSelect?: (moodType: string) => void;
}

// 定义 EmojiItem 类型
interface EmojiItem {
  key: string;
  src: string;
  text: string;
}

 function Turntable({ onSelect }: TurntableProps, ref) {
  const userInfo = useAppSelector((state) => state.user.userInfo);
  const touchStartX = useRef(0);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const [currentEmojiMap, setCurrentEmojiMap] = useState<EmojiItem[]>([])


  useEffect(() => {
    const currentSkin = userInfo.data?.currentSkin
    const emojiMap = getEmojiMap(currentSkin, 'arr')
    if (emojiMap) {
      setCurrentEmojiMap(emojiMap);
    }
  }, [userInfo.status === 'success'])

  useImperativeHandle(ref, () => ({
    handleTouchStart: (e: any) => {
      touchStartX.current = e.touches[0].clientX;
      setIsAnimating(false);
    },
    handleTouchMove: (e: any) => {
 
      if (isAnimating) return;
      
      const moveX = e.touches[0].clientX - touchStartX.current;
      
      const SWIPE_THRESHOLD = 12; // 推荐10~15之间，越小越灵敏

      if (moveX > SWIPE_THRESHOLD) {
        if (currentIndex > 0) {
          setIsAnimating(true);
          setCurrentIndex((prevIndex) => prevIndex - 1);
          setOffset(prev => prev + (360 / currentEmojiMap.length));
          touchStartX.current = e.touches[0].clientX;
          // 添加震动效果
          Taro.vibrateShort({ type: 'light' });
          setTimeout(() => setIsAnimating(false), 300); // 动画结束后重置状态
        }
      } else if (moveX < -SWIPE_THRESHOLD) {
        if (currentIndex < currentEmojiMap.length - 1) {
          setIsAnimating(true);
          setCurrentIndex((prevIndex) => prevIndex + 1);
          setOffset(prev => prev - (360 / currentEmojiMap.length));
          touchStartX.current = e.touches[0].clientX;
          // 添加震动效果
          Taro.vibrateShort({ type: 'light' });
          setTimeout(() => setIsAnimating(false), 300); // 动画结束后重置状态
        }
      }
    }
  }))

  // 计算表情位置
  const getEmojiPosition = (index: number) => {
    const baseAngle = (index * 360) / currentEmojiMap.length;
    const currentAngle = baseAngle + offset;
    const radius = 100;
    const x = Math.cos((currentAngle * Math.PI) / 180) * radius;
    const y = Math.sin((currentAngle * Math.PI) / 180) * radius;
    return { x, y };
  };

  const handleSelect = (emojiName) => {
    onSelect?.(emojiName);
  };

 

  return (
    <View className="circle-container" >
      <View className="circle" />
      {!!currentEmojiMap.length && currentEmojiMap.map((emoji, index) => {
        const { x, y } = getEmojiPosition(index);
        return (
          <View 
            className="icon" 
            key={index} 
            style={{ 
              transform: `translate(${x}px, ${y}px)`,
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' // 使用更平滑的贝塞尔曲线
            }}
            onClick={() => handleSelect(emoji.key)}
          >
            <Image 
              className="icon-image"
              src={emoji.src}
              mode="aspectFit"
            />
          </View>
        );
      })}
    </View>
  );
} 

export default forwardRef(Turntable)