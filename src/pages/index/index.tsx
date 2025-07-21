import { View, Text } from '@tarojs/components';
import { useState, useEffect } from 'react';
import './index.less';

const BLUR_SPOTS = [
  {
    style: {
      width: '700rpx',
      height: '700rpx',
      background: 'radial-gradient(circle, #4D96FF 0%, #4D96FF00 80%)', // 蓝色
      animationName: 'move1',
    },
  },
  {
    style: {
      width: '600rpx',
      height: '600rpx',
      background: 'radial-gradient(circle, #A66CFF 0%, #A66CFF00 80%)', // 紫色
      animationName: 'move2',
    },
  },
  {
    style: {
      width: '500rpx',
      height: '500rpx',
      background: 'radial-gradient(circle, #6BCB77 0%, #6BCB7700 80%)', // 绿色
      animationName: 'move3',
    },
  },
  {
    style: {
      width: '650rpx',
      height: '650rpx',
      background: 'radial-gradient(circle,rgb(250, 173, 41) 0%, #FFD93D00 80%)', // 黄色
      animationName: 'move4',
    },
  },
];

const LINES = [
  '不开心的时候多记录',
  '心理学研究表明：情感能够通过书写能降低杏仁核活跃度（情绪中枢），激活大脑前额叶的理性思考功能，同时提升心率变异性（HRV），这是身体压力降低的生理标志。',
  '书写能帮我们以观察者视角看待情绪，而非沉浸其中让身心更平静。',
];

export default function Index() {
  const [displayed, setDisplayed] = useState(['', '', '']);
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    if (lineIdx >= LINES.length) return;
    if (charIdx <= LINES[lineIdx].length) {
      const newDisplayed = [...displayed];
      newDisplayed[lineIdx] = LINES[lineIdx].slice(0, charIdx);
      setDisplayed(newDisplayed);
      if (charIdx < LINES[lineIdx].length) {
        const delay = lineIdx === 0 ? 60 : 32;
        setTimeout(() => setCharIdx(charIdx + 1), delay);
      } else {
        setTimeout(() => {
          setLineIdx(lineIdx + 1);
          setCharIdx(0);
        }, 700);
      }

    }
  }, [charIdx, lineIdx]);

  return (
    <View className="index-page">
      {/* <View className="intro-letter">
        <Text className="intro-title">{displayed[0]}</Text>
        <Text className="intro-desc">{displayed[1]}</Text>
        <Text className="intro-desc">{displayed[2]}</Text>
      </View> */}
      <View className='action__text'>
        <Text>emood </Text>
        <Text>帮你了解自己</Text>
      </View>
      {BLUR_SPOTS.map((item, idx) => (
        <View
          key={idx}
          className="blur-spot"
          style={{
            ...item.style,
            animationName: item.style.animationName,
            animationDuration: '12s',
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
          }}
        />
      ))}
      {/* <View className="rainy-bg" /> */}
    </View>
  );
}

