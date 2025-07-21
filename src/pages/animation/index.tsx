import { useEffect, useRef, useState } from 'react';
import { View, Canvas } from '@tarojs/components';
import Taro, { useReady } from '@tarojs/taro';
import './index.less';

const SPOTS_COUNT = 4; // 光斑数量
const CANVAS_ID = 'moving-spots-bg';
const COLORS = [
  'rgba(255, 210, 80, 0.16)',   // 黄色
  'rgba(0, 230, 180, 0.18)',    // 绿色
  'rgba(120, 115, 245, 0.20)',  // 紫色
  'rgba(54, 162, 235, 0.20)',   // 蓝色
];

function randomSpot(canvasWidth, canvasHeight, idx) {
  const radius = Math.random() * 220 + 260; // 半径更大
  return {
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    r: radius,
    dx: (Math.random() - 0.5) * 8.0, // 速度再提升一倍
    dy: (Math.random() - 0.5) * 8.0, // 速度再提升一倍
    color: COLORS[idx % COLORS.length],
  };
}

const LINES = ['emood', '帮你了解自己'];

export default function AnimationPage() {
  const animationRef = useRef<number | null>(null);
  const spotsRef = useRef<ReturnType<typeof randomSpot>[]>([]);
  const sizeRef = useRef({ width: 375, height: 667 });
  const canvasNodeRef = useRef<any>(null);
  const [typedText, setTypedText] = useState(['', '']);

  useReady(() => {
    Taro.createSelectorQuery()
      .select(`#${CANVAS_ID}`)
      .node()
      .exec(res => {
        const canvas = res[0]?.node;
        if (!canvas) return;
        const sys = Taro.getSystemInfoSync();
        const dpr = sys.pixelRatio || 1;
        const width = sys.windowWidth * dpr;
        const height = sys.windowHeight * dpr;
        canvas.width = width;
        canvas.height = height;
        sizeRef.current = { width, height };
        spotsRef.current = Array.from({ length: SPOTS_COUNT }, (_, i) => randomSpot(width, height, i));
        canvasNodeRef.current = canvas;
        draw(canvas, spotsRef.current, width, height);
        animate();
      });
  });

  useEffect(() => {
    // 打字机动画
    let line = 0;
    let char = 0;
    let timer: any;
    function type() {
      if (line >= LINES.length) return;
      setTypedText(prev => {
        const newArr = [...prev];
        newArr[line] = LINES[line].slice(0, char + 1);
        return newArr;
      });
      if (char < LINES[line].length - 1) {
        char++;
        timer = setTimeout(type, 90);
      } else {
        line++;
        char = 0;
        timer = setTimeout(type, 400);
      }
    }
    type();
    return () => clearTimeout(timer);
  }, []);

  function animate() {
    const { width, height } = sizeRef.current;
    const spots = spotsRef.current;
    for (let spot of spots) {
      spot.x += spot.dx;
      spot.y += spot.dy;
      if (spot.x < spot.r || spot.x > width - spot.r) spot.dx *= -1;
      if (spot.y < spot.r || spot.y > height - spot.r) spot.dy *= -1;
    }
    draw(canvasNodeRef.current, spots, width, height);
    animationRef.current = requestAnimationFrame(animate);
  }

  function draw(canvas, spots, width, height) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);
    for (let spot of spots) {
      // 取出当前色的透明度
      const baseColor = spot.color.replace(/,\s*0\.[0-9]+\)/, ', 0.7)');
      const fadeColor = spot.color.replace(/,\s*0\.[0-9]+\)/, ', 0)');
      const gradient = ctx.createRadialGradient(spot.x, spot.y, 0, spot.x, spot.y, spot.r);
      gradient.addColorStop(0, baseColor);
      gradient.addColorStop(1, fadeColor);
      ctx.beginPath();
      ctx.arc(spot.x, spot.y, spot.r, 0, 2 * Math.PI);
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }

  return (
    <View className="index-page">
      <Canvas
        id={CANVAS_ID}
        type="2d"
        className="moving-spots-canvas"
        style={{ position: 'absolute', left: 0, top: 0, width: '100vw', height: '100vh', zIndex: 1 }}
      />
      <View className="center-guide-text">
        <View className="guide-line1">{typedText[0]}</View>
        <View className="guide-line2">{typedText[1]}</View>
      </View>
    </View>
  );
}

