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
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const [currentEmojiMap, setCurrentEmojiMap] = useState<EmojiItem[]>([])


  useEffect(() => {
    const currentSkin = userInfo.data?.currentSkin
    const emojiMap = getEmojiMap(currentSkin, 'arr') as EmojiItem[]
    if (emojiMap && emojiMap.length > 0) {
      setCurrentEmojiMap(emojiMap);
      
      // 触发初始化动画
      if (!isInitialized) {
        setIsInitialized(true);
        // 延迟一点时间让组件完全渲染后再开始动画
   
          // 开始散开动画
          setTimeout(() => {
            setIsInitializing(false); // 开始散开到目标位置
            setTimeout(() => {
              setOffset(-(360 / emojiMap.length));  // 然后执行滚动动画
            }, 300); // 等待散开动画完成
          }, 100);
        }
    }
  }, [userInfo.status === 'success', isInitialized])

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
    let baseAngle;
    if (currentEmojiMap.length % 2 === 1) {
      // 单数时，调整起始角度让分布更匀称
      // 通过偏移半个角度间隔，让emoji在视觉上更平衡
      baseAngle = (index * 360) / currentEmojiMap.length + (180 / currentEmojiMap.length);
    } else {
      // 双数时保持原来的计算方式
      baseAngle = (index * 360) / currentEmojiMap.length;
    }
    
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
            className={`icon${isInitializing ? ' icon--initializing' : ''}`}
            key={index} 
            style={{ 
              transform: isInitializing ? 'translate(0, 0)' : `translate(${x}px, ${y}px)`,
              transition: isInitializing ? 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
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