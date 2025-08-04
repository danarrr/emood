import { View, Text } from '@tarojs/components';
import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { useAppDispatch } from '@/store';
import { getUserInfoAction } from '@/store/user/actions';
import { getMoodListAction } from '@/store/moods/actions';
import { isLoginValid } from '@/utils/login';
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

const HAPPY_LINES = [
  '开心时记得记录',
  '人生不过短短三万天，每一天都是不可复制的回忆。'
];

export default function Index() {
  const dispatch = useAppDispatch();
  const [displayed, setDisplayed] = useState(['', '', '']);
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [hasAuth, setHasAuth] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [activeScene, setActiveScene] = useState(0); // 当前激活的场景：0, 1, 2
  const [sceneStates, setSceneStates] = useState({
    0: 'active', // 第一屏：active, exit
    1: 'hidden', // 第二屏：hidden, active, exit  
    2: 'hidden'  // 第三屏：hidden, active, exit
  });

  useEffect(() => {
    // 检查是否有鉴权缓存
    const authValid = isLoginValid();
    setHasAuth(authValid);
    
    // 开始请求数据
    const fetchData = async () => {
      try {
        // 获取用户信息
        await dispatch(getUserInfoAction());
        
        // 获取当前年份的心情列表
        const currentYear = new Date().getFullYear();
        await dispatch(getMoodListAction({ data: { year: currentYear } }));
        
        console.log('数据预加载完成');
      } catch (error) {
        console.error('数据预加载失败:', error);
      }
    };
    
    fetchData();
    
    if (authValid) {
      // 有鉴权缓存，直接显示第一屏，然后跳转
      setTimeout(() => {
        setShowIntro(false);
        Taro.redirectTo({ url: '/pages/mood/index' });
      }, 2000);
    } else {
      // 无鉴权缓存，开始三屏动画
      startIntroAnimation();
    }
  }, [dispatch]);

  const startIntroAnimation = () => {
    // 第一屏显示2秒后，切换到第二屏
    setTimeout(() => {
      setSceneStates(prev => ({ ...prev, 0: 'exit', 1: 'active' }));
      setActiveScene(1);
      setLineIdx(0);
      setCharIdx(0);
      setDisplayed(['', '', '']);
    }, 2000);

    // 第二屏显示8秒后，切换到第三屏
    setTimeout(() => {
      setSceneStates(prev => ({ ...prev, 1: 'exit', 2: 'active' }));
      setActiveScene(2);
      setLineIdx(0);
      setCharIdx(0);
      setDisplayed(['', '', '']);
    }, 10000);

    // 第三屏显示4秒后跳转
    setTimeout(() => {
      setSceneStates(prev => ({ ...prev, 2: 'exit' }));
      setTimeout(() => {
        setShowIntro(false);
        Taro.redirectTo({ url: '/pages/mood/index' });
      }, 800);
    }, 14000);
  };

  // 打字机效果
  useEffect(() => {
    if (activeScene === 0) {
      // 第一屏：emood, 帮你了解自己 - 直接显示
      // setDisplayed(['emood', '帮你了解自己', '']);
    } else if (activeScene === 1) {
      // 第二屏：不开心的时候
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
    } else if (activeScene === 2) {
      // 第三屏：开心的时候
      if (lineIdx >= HAPPY_LINES.length) return;
      if (charIdx <= HAPPY_LINES[lineIdx].length) {
        const newDisplayed = [...displayed];
        newDisplayed[lineIdx] = HAPPY_LINES[lineIdx].slice(0, charIdx);
        setDisplayed(newDisplayed);
        if (charIdx < HAPPY_LINES[lineIdx].length) {
          const delay = lineIdx === 0 ? 60 : 32;
          setTimeout(() => setCharIdx(charIdx + 1), delay);
        } else {
          setTimeout(() => {
            setLineIdx(lineIdx + 1);
            setCharIdx(0);
          }, 700);
        }
      }
    }
  }, [charIdx, lineIdx, activeScene]);

  const handleSkip = () => {
    setShowIntro(false);
    Taro.redirectTo({ url: '/pages/mood/index' });
  };

  if (!showIntro) {
    return null;
  }

  return (
    <View className="index-page">
      {/* 第一屏：emood, 帮你了解自己 */}
      <View className={`intro-scene intro-scene--${sceneStates[0]}`}>
        <View className='action__text'>
          <Text>emood </Text>
          <Text>帮你了解自己</Text>
        </View>
      </View>

      {/* 第二屏：不开心的时候 */}
      <View className={`intro-scene intro-scene--${sceneStates[1]}`}>
        <View className="intro-letter">
          <Text className="intro-title">{displayed[0]}</Text>
          <Text className="intro-desc">{displayed[1]}</Text>
          <Text className="intro-desc">{displayed[2]}</Text>
        </View>
        <View className="rainy-bg" />
      </View>

      {/* 第三屏：开心的时候 */}
      <View className={`intro-scene intro-scene--${sceneStates[2]}`}>
        <View className="intro-letter">
          <Text className="intro-title">{displayed[0]}</Text>
          <Text className="intro-desc">{displayed[1]}</Text>
        </View>
        <View className="sunny-bg" />
      </View>

      {/* 背景装饰 - 固定显示 */}
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

      {/* 跳过按钮 - 只在无鉴权时显示 */}
      {!hasAuth && (
        <View className="skip-button" onClick={handleSkip}>
          <Text>跳过</Text>
        </View>
      )}
    </View>
  );
}

