// 表情图片全局常量
export const domin = 'https://prod-6glre6n1cad02d9f-1363336642.tcloudbaseapp.com';
export const sign = 'sign=9cc7b625eb436649b8a821c039d404a9&t=1750909934'; 


const skinOptions = {
  
}

export const emoji1Config = {
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

export const emoji5Config = {
  'emoji5a': { key: 'emoji5a', src: domin + '/emoji5/a.png?' + sign, text: '好' },
  'emoji5b': { key: 'emoji5b', src: domin + '/emoji5/b.png?' + sign, text: '很棒' },
  'emoji5c': { key: 'emoji5c', src: domin + '/emoji5/c.png?' + sign, text: '一般' },
  'emoji5d': { key: 'emoji5d', src: domin + '/emoji5/d.png?' + sign, text: '累' },
  'emoji5e': { key: 'emoji5e', src: domin + '/emoji5/e.png?' + sign, text: '心动' },
  'emoji5f': { key: 'emoji5f', src: domin + '/emoji5/f.png?' + sign, text: '忧郁' },
  'emoji5g': { key: 'emoji5g', src: domin + '/emoji5/g.png?' + sign, text: '生气' },
  'emoji5h': { key: 'emoji5h', src: domin + '/emoji5/h.png?' + sign, text: '平静' },
  'emoji5i': { key: 'emoji5i', src: domin + '/emoji5/i.png?' + sign, text: '焦虑' },
};

export const getEmojiMap = (emojiIdx, type = 'obj' as 'obj' | 'arr') => {
  if(emojiIdx === 'emoji1') {
    return type === 'arr' ? Object.values(emoji1Config) : emoji1Config
  }

  if(emojiIdx === 'emoji2') {
    return type === 'arr' ? Object.values(emoji1Config) : emoji1Config
  }

  if(emojiIdx === 'emoji3') {
    return type === 'arr' ? Object.values(emoji1Config) : emoji1Config
  }

  if(emojiIdx === 'emoji4') {
    return type === 'arr' ? Object.values(emoji1Config) : emoji1Config
  }

  if(emojiIdx === 'emoji5'){
    return type === 'arr' ? Object.values(emoji5Config) : emoji5Config
  }

  if(emojiIdx === 'emoji6'){
    return type === 'arr' ? Object.values(emoji1Config) : emoji1Config
  }
}

export const getSkinType = (emojiName) => {
  return emojiName ? emojiName.replace(/([a-zA-Z0-9]+)[a-z]$/, '$1') : ''
}