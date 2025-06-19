import { useEffect } from 'react'
import Taro from '@tarojs/taro'

// 震动类型
type VibrationType = 'light' | 'medium' | 'heavy'

// 震动反馈Hook
export const useVibration = (type: VibrationType = 'light') => {
  const vibrate = () => {
    Taro.vibrateShort({
      type
    });
  };

  return vibrate;
};

// 全局震动Hook
export const useGlobalVibration = () => {
  useEffect(() => {
    // 创建震动函数
    const handleVibration = () => {
      Taro.vibrateShort({
        type: 'light'
      });
    };

    // 添加全局事件监听
    const addGlobalListeners = () => {
      // 监听点击事件
      document.addEventListener('click', handleVibration, true);
      
      // 监听触摸事件（移动端）
      document.addEventListener('touchstart', handleVibration, true);
    };

    // 移除全局事件监听
    const removeGlobalListeners = () => {
      document.removeEventListener('click', handleVibration, true);
      document.removeEventListener('touchstart', handleVibration, true);
    };

    // 添加监听器
    addGlobalListeners();

    // 清理函数
    return () => {
      removeGlobalListeners();
    };
  }, []);
};

// 带震动的点击处理函数
export const withVibration = (callback?: () => void, type: VibrationType = 'light') => {
  return () => {
    // 先执行震动
    Taro.vibrateShort({
      type
    });
    
    // 再执行回调函数
    if (callback) {
      callback();
    }
  };
};

// 震动工具函数
export const vibrateShort = (type: VibrationType = 'light') => {
  Taro.vibrateShort({
    type
  });
};

export const vibrateLong = () => {
  Taro.vibrateLong();
}; 