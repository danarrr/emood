// 表情图片全局常量
export const domin = 'https://prod-6glre6n1cad02d9f-1363336642.tcloudbaseapp.com';
export const sign = 'sign=9cc7b625eb436649b8a821c039d404a9&t=1750909934'; 

const emoji1Config = {
  'emoji1a': { key: 'emoji1a', src: domin + '/emoji3/a.png?' + sign, text: '好' },
  'emoji1b': { key: 'emoji1b', src: domin + '/emoji3/b.png?' + sign, text: '很棒' },
  'emoji1c': { key: 'emoji1c', src: domin + '/emoji3/c.png?' + sign, text: '一般' },
  'emoji1d': { key: 'emoji1d', src: domin + '/emoji3/d.png?' + sign, text: '累' },
  'emoji1e': { key: 'emoji1e', src: domin + '/emoji3/e.png?' + sign, text: '心动' },
  'emoji1f': { key: 'emoji1f', src: domin + '/emoji3/f.png?' + sign, text: '忧郁' },
  'emoji1g': { key: 'emoji1g', src: domin + '/emoji3/g.png?' + sign, text: '生气' },
  'emoji1h': { key: 'emoji1h', src: domin + '/emoji3/h.png?' + sign, text: '平静' },
  'emoji1i': { key: 'emoji1i', src: domin + '/emoji3/i.png?' + sign, text: '焦虑' },
};

// // 创建从 MOOD_TYPE 到表情配置的映射
// export const emojiConfigMap = {
//   hao: { src: domin + '/emoji2/a.png?' + sign, text: '好' },
//   henbang: { src: domin + '/emoji2/b.png?' + sign, text: '很棒' },
//   yiban: { src: domin + '/emoji2/c.png?' + sign, text: '一般' },
//   lei: { src: domin + '/emoji2/d.png?' + sign, text: '累' },
//   xindong: { src: domin + '/emoji2/e.png?' + sign, text: '心动' },
//   youyu: { src: domin + '/emoji2/f.png?' + sign, text: '忧郁' },
//   shengqi: { src: domin + '/emoji2/g.png?' + sign, text: '生气' },
//   pingjing: { src: domin + '/emoji2/h.png?' + sign, text: '平静' },
//   jiaolv: { src: domin + '/emoji2/i.png?' + sign, text: '焦虑' },
// };

export const getEmojiMap = (emojiIdx) => {
  if(emojiIdx === 'emoji1') {
    return emoji1Config
  }
}