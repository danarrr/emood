import { useRef, useState } from 'react';
import { View, Image } from '@tarojs/components';
import { getEmojiMap } from '@/utils/constants';


import './index.less';


// // 表情配置
// const emojiConfig = [
//   { src: domin + '/emoji2/a.png?' + sign, name: 'hao', text: '好' },
//   { src: domin + '/emoji2/b.png?' + sign, name: 'henbang', text: '很棒' },
//   { src: domin + '/emoji2/c.png?' + sign, name: 'yiban', text: '一般' },
//   { src: domin + '/emoji2/d.png?' + sign, name: 'lei', text: '累' },
//   { src: domin + '/emoji2/e.png?' + sign, name: 'xindong', text: '心动' },
//   { src: domin + '/emoji2/f.png?' + sign, name: 'youyu', text: '忧郁' },
//   { src: domin + '/emoji2/g.png?' + sign, name: 'shengqi', text: '生气' },
//   { src: domin + '/emoji2/h.png?' + sign, name: 'pingjing', text: '平静' },
//   { src: domin + '/emoji2/i.png?' + sign, name: 'jiaolv', text: '焦虑' },
// ];

interface TurntableProps {
  onSelect?: (moodType: string) => void;
}

export default function Turntable({ onSelect }: TurntableProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const [offset, setOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const emojiConfig = Object.values(getEmojiMap('emoji1') || {})

  const handleTouchStart = (e: any) => {
    touchStartX.current = e.touches[0].clientX;
    setIsAnimating(false);
  };



  const handleTouchMove = (e: any) => {
 
    if (isAnimating) return;
    
    const moveX = e.touches[0].clientX - touchStartX.current;
    
    if (moveX > 30) { // 降低触发阈值
      if (currentIndex > 0) {
        setIsAnimating(true);
        setCurrentIndex((prevIndex) => prevIndex - 1);
        setOffset(prev => prev + (360 / emojiConfig.length));
        touchStartX.current = e.touches[0].clientX;
        setTimeout(() => setIsAnimating(false), 300); // 动画结束后重置状态
      }
    } else if (moveX < -30) { // 降低触发阈值
      if (currentIndex < emojiConfig.length - 1) {
        setIsAnimating(true);
        setCurrentIndex((prevIndex) => prevIndex + 1);
        setOffset(prev => prev - (360 / emojiConfig.length));
        touchStartX.current = e.touches[0].clientX;
        setTimeout(() => setIsAnimating(false), 300); // 动画结束后重置状态
      }
    }
  };

  const handleSelect = (emojiName) => {
    onSelect?.(emojiName);
  };

  // 计算表情位置
  const getEmojiPosition = (index: number) => {
    const baseAngle = (index * 360) / emojiConfig.length;
    const currentAngle = baseAngle + offset;
    const radius = 100;
    const x = Math.cos((currentAngle * Math.PI) / 180) * radius;
    const y = Math.sin((currentAngle * Math.PI) / 180) * radius;
    return { x, y };
  };

  return (
    <View
      className="circle-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <View className="circle" />
      {emojiConfig.map((emoji, index) => {
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