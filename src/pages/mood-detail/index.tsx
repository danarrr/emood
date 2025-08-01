import { View, Image, Textarea, Text } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { useState, useEffect, useRef } from 'react'
import { useAppSelector, useAppDispatch } from '@/store'
import { getMoodDetailListAction, getMoodListAction } from '@/store/moods/actions'

import PageHeader from '@components/PageHeader'
import { getFestivalBgImage } from '@/utils/festivalSetting'
import { getSkinType, getEmojiMap } from '@/utils/emojiMaps'
import { cloudRequest } from '@/utils/request'
import { getDateInfo, getNowDateInfo } from '@/utils/date'


import IconCamera from '@imgs/icon-camera@2x.png'
// import IconTime from '@imgs/icon-time@2x.png'
import IconPublish from '@imgs/icon-publish@2x.png'

import './index.less'

// @ts-ignore
const plugin = requirePlugin('WechatSI');



export default function MoodDetail () {
  const manager = plugin.getRecordRecognitionManager();
  const dispatch = useAppDispatch();
  const moodlist = useAppSelector((state) => state.mood.moodList);
  const userInfo = useAppSelector((state) => state.user.userInfo);
  const router = useRouter();
  const { id, mood, date } = router.params as { id?: string, mood?: string, date?: string };


// useEffect(() => {
  
//   return () => {
//     manager.onStart = null;
//     manager.onStop = null;
//     manager.onError = null;
//   };
// }, []);

  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'listening' | 'recognizing'>('idle');
  const recordBtnRef = useRef(null);

  function startRecord() {
    setVoiceStatus('listening');
    manager.start({ duration: 30000, lang: 'zh_CN' });
  }

  function stopRecord() {
    manager.stop();
  }

  manager.onStart = function(res) {
    setVoiceStatus('listening');
  };
  
  manager.onStop = function(res) {
    // 识别结果写入Textarea
    if (res.result) {
      setDetailInfo(prev => ({ ...prev, content: prev.content + res.result }));
    }
    setVoiceStatus('idle');
  };

  manager.onError = function(res) {
    console.log('语音识别失败', res);
    if(res.retcode === -30011) {
      setVoiceStatus('recognizing');
    } else {
      setVoiceStatus('idle');
    }
  };

  // 统一 detailInfo 管理所有数据
  const [detailInfo, setDetailInfo] = useState<{
    images: string[];
    content: string;
    mood: string;
    dateInfo: { year: string; month: string; date: string };
  }>(() => {
    
    // 2. 创建场景
    return {
      id: null,
      images: [],
      content: '',
      mood: mood || '',
      dateInfo: date ? JSON.parse(decodeURIComponent(date)) : getNowDateInfo(),
    };
  });

  // 带有id拉取指定数据
  useEffect(() => {
    if (id) {
      cloudRequest({
        path: `/mood?id=${id}`,
        method: 'GET',
      })
      .then((res) => {
        const { data } = res;
        if (data) {
          setDetailInfo({
            images: (data.moodImages || []).map((item) => item.imageUrl),
            content: data.content,
            mood: data?.mood || '',
            dateInfo: getDateInfo(data.dateStr),
          })
        } else {
          Taro.showToast({ title: '心情记录不见了' });
        }
      })
      .catch(() => {
        Taro.showToast({ title: '获取记录失败' });
      })
    }
  }, []);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // emojiConfigMap 用于渲染表情
  const [emojiConfigMap, setEmojiConfigMap] = useState(() => {
    const skinType = getSkinType(detailInfo.mood);
    return getEmojiMap(skinType) || {};
  });

  // 切换表情
  const handleChangeEmoji = () => {
    const emojiKeys = Object.keys(emojiConfigMap);
    if (emojiKeys.length === 0 || !detailInfo.mood) return;
    const currentIndex = emojiKeys.indexOf(detailInfo.mood);
    const nextIndex = (currentIndex + 1) % emojiKeys.length;
    const nextMoodType = emojiKeys[nextIndex];
    setDetailInfo(prev => ({ ...prev, mood: nextMoodType }));
  };

  // 监听 mood 变化，切换皮肤
  useEffect(() => {
    setEmojiConfigMap(getEmojiMap(getSkinType(detailInfo.mood)) || {});
  }, [detailInfo.mood]);

  // 处理文本输入
  const handleContentChange = (e) => {
    setDetailInfo(prev => ({ ...prev, content: e.detail.value }));
  };

  // 选择图片
  const handleChooseImage = async () => {
    if (detailInfo.images.length >= 11) {
      Taro.showToast({ title: '最多只能上传11张图片', icon: 'none' });
      return;
    }
    try {
      await Taro.chooseImage({
        count: 11 - detailInfo.images.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function (chooseResult) {
          var tempFilePaths = chooseResult.tempFilePaths;
          setUploading(true);
          const uploadPromises = tempFilePaths.map((filePath, index) => {
            return new Promise<string>((resolve, reject) => {
              Taro.cloud.uploadFile({
                cloudPath: `mood-images/${userInfo.data?.userid}/tmp/${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}.jpg`,
                filePath: filePath,
                success: res => resolve(res.fileID),
                fail: err => reject(err)
              });
            });
          });
          Promise.all(uploadPromises)
            .then(fileIDs => {
              setDetailInfo(prev => ({ ...prev, images: [...prev.images, ...fileIDs] }));
              setUploading(false);
            })
            .catch(() => {
              Taro.showToast({ title: '部分图片上传失败', icon: 'none' });
              setUploading(false);
            });
        }
      });
    } catch(err){
      if(err.errMsg.includes('cancel')) return;
      Taro.showToast({ title: '选择图片失败', icon: 'none' });
    }
  };

  // 删除图片
  const handleDeleteImage = (index: number) => {
    setDetailInfo(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  // 保存心情记录
  const handleSave = async () => {
    Taro.vibrateShort({ type: 'light' });
    if (!detailInfo.content.trim()) {
      Taro.showToast({ title: '请输入内容', icon: 'none' });
      return;
    }
    setSaving(true);
    try {
      const result = await cloudRequest({
        path: id ? `/mood/update?id=${id}` : '/mood/save',
        method: id ? 'PUT' : 'POST',
        data: {
          year: Number(detailInfo.dateInfo?.year),
          month: Number(detailInfo.dateInfo?.month),
          day: Number(detailInfo.dateInfo?.date),
          mood: detailInfo.mood,
          content: detailInfo.content,
          imgs: detailInfo.images.length ? detailInfo.images.join(',') : ''
        }
      });
      if (result.statusCode === 200) {
        Taro.showToast({ title: '保存成功', icon: 'none' });
        dispatch(getMoodListAction({ data: { year: Number(detailInfo.dateInfo?.year) } }));
        dispatch(getMoodDetailListAction({ data: {year: Number(detailInfo.dateInfo.year), month: Number(detailInfo.dateInfo.month)} }))
        
        setTimeout(() => Taro.navigateBack(), 1500);
      } else {
        throw new Error(`保存失败: ${result.data?.message || '未知错误'}`);
      }
    } catch (error) {
      Taro.showToast({ title: (error as Error).message || '保存失败', icon: 'none' });
    }
    setSaving(false);
  };

  // 格式化日期显示
  const formatDate = () => {
    const { dateInfo } = detailInfo;
    if (!dateInfo?.month || !dateInfo?.date) return null;
    const date = new Date(Number(dateInfo.year), Number(dateInfo.month) - 1, Number(dateInfo.date));
    const dayOfWeek = date.getDay();
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekDay = weekDays[dayOfWeek];
    return { weekDay, dateText: `${dateInfo.month}月${dateInfo.date}日` };
  };

  return (
    <View className='mood-detail' style={{ background: `url(${getFestivalBgImage(userInfo?.data?.birthdayMonth)}) no-repeat center top / cover` }}>
      <PageHeader title='记录' />
      <View className='mood-detail__emojibox'>
        <Image
          className='mood-detail__emojibox-img'
          src={detailInfo.mood ? emojiConfigMap[detailInfo.mood]?.src : ''}
          mode='aspectFit'
          onClick={handleChangeEmoji}
        />
        <View className='mood-detail__emojibox-text'>
          <Text>{detailInfo.mood ? emojiConfigMap[detailInfo.mood]?.text : ''}</Text>
        </View>
      </View>
      <Text className='mood-detail__input-desc'>
        {(() => {
          const dateInfo = formatDate();
          if (!dateInfo) return '';
          return (
            <>
              <Text className='mood-detail__weekday'>{dateInfo.weekDay}</Text>
              <Text>{dateInfo.dateText}</Text>
            </>
          );
        })()}
      </Text>
      <View className='mood-detail__editor'>
        <Textarea
          className='mood-detail__editor-textarea'
          placeholder='今天发生了什么呀~'
          value={detailInfo.content}
          onInput={handleContentChange}
          maxlength={-1}
          autoHeight
          // showConfirmBar={false}
          cursorSpacing={50}
          adjustPosition={true}
          // holdKeyboard={true}
        />
        {/* 图片预览区域 */}
        {detailInfo.images.length > 0 && (
          <View className='mood-detail__images'>
            {detailInfo.images.map((url, index) => (
              <View key={index} className='mood-detail__image-item'>
                <Image
                  className='mood-detail__image'
                  src={url}
                  mode='aspectFill'
                />
                <View
                  className='mood-detail__image-delete'
                  onClick={() => handleDeleteImage(index)}
                >
                  ×
                </View>
              </View>
            ))}
          </View>
        )}
        <View className='mood-detail__editor-footer'>
          <View className='mood-detail__editor-actions'>
            <Image
              className='mood-detail__editor-action-icon'
              src={IconCamera}
              onClick={handleChooseImage}
            />
            <View
              className={`mood-detail__voice-btn${
                voiceStatus === 'listening' ? ' mood-detail__voice-btn--recording' : 
                voiceStatus === 'recognizing' ? ' mood-detail__voice-btn--recognizing' : ''
              }`}
              ref={recordBtnRef}
              onTouchStart={startRecord}
              onTouchEnd={stopRecord}
              onTouchCancel={stopRecord}
            >
              {voiceStatus === 'listening' ? (
                <>
                  <View className='mood-detail__voice-wave'></View>
                  <Text>正在聆听</Text>
                </>
              ) : voiceStatus === 'recognizing' ? (
                <>
                  <View className='mood-detail__voice-processing'></View>
                  <Text>正在解析</Text>
                </>
              ) : (
                <Text>你说我写</Text>
              )}
            </View>
          </View>
          
          <View className='mood-detail__editor-save-status'>
            {uploading ? '上传中...' : saving ? '正在保存中...' : ''}
          </View>
        </View>
      </View>
      <Image
        className={`mood-detail__editor-save-button${uploading || saving ? ' mood-detail__editor-save-button--disabled' : ''}`}
        src={IconPublish}
        onClick={uploading || saving ? undefined : handleSave}
      />
    </View>
  );
}
