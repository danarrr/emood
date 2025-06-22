import { View, Button, Image, Textarea, Text, Progress } from '@tarojs/components'
import Taro, { useLoad, useRouter } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import PageHeader from '../../components/PageHeader'
import IconCamera from '@imgs/icon-camera@2x.png'
import IconTime from '@imgs/icon-time@2x.png'
import IconPublish from '@imgs/icon-publish@2x.png'
import './index.less'

// 导入表情图片
// import test from '@imgs/emoji/happy.gif';
import { emoji1Map } from '@imgs/emoji1/emoji1Map';
import { MOOD_TYPE } from '@/store/moods'
import { useAppDispatch } from '@/store'
import { getMoodListAction } from '@/store/moods/actions'

// 表情文字映射
const emojiTextMap = {
  hao: '好',
  henbang: '很棒',
  yiban: '一般',
  lei: '累',
  xindong: '心动',
  youyu: '忧郁',
  shengqi: '生气',
  pingjing: '平静',
  jiaolv: '焦虑',
};
interface DateInfo {
  year: string;
  month: string;
  date: string;
}

export default function MoodDetail () {
    const dispatch = useAppDispatch();
  
  const router = useRouter();
  const { mood: MOOD_TYPE = '', date } = router.params as { 
    mood: MOOD_TYPE; 
    date: string;
  };

  // 状态管理
  const [moodState, setMoodState] = useState<{
    type: MOOD_TYPE;
    dateInfo: DateInfo | null;
  }>({
    type: MOOD_TYPE,
    dateInfo: null
  });

  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [content, setContent] = useState(''); // 添加内容状态

  // 初始化数据
  useEffect(() => {
    if (date) {
      try {
        const dateInfo = JSON.parse(decodeURIComponent(date));
        setMoodState(prev => ({
          ...prev,
          dateInfo
        }));
      } catch (error) {
        console.error('Failed to parse date:', error);
      }
    }
  }, [date]);

  useLoad(() => {
    console.log('Page loaded with state:', moodState);
  });

  const goBack = () => {
    Taro.navigateBack();
  };

  // 格式化日期显示
  const formatDate = () => {
    const { dateInfo } = moodState;
    if (!dateInfo?.month || !dateInfo?.date) return null;
    
    // 创建日期对象来计算周几
    const date = new Date(Number(dateInfo.year), Number(dateInfo.month) - 1, Number(dateInfo.date));
    const dayOfWeek = date.getDay();
    
    // 周几的英文数组
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekDay = weekDays[dayOfWeek];
    
    return { weekDay, dateText: `${dateInfo.month}月${dateInfo.date}日` };
  };

  // 选择图片
  const handleChooseImage = async () => {
    // 检查是否已达到最大图片数量
    if (images.length >= 11) {
      Taro.showToast({
        title: '最多只能上传11张图片',
        icon: 'none'
      });
      return;
    }

    try {
      const res = await Taro.chooseImage({
        count: 11 - images.length, // 最多可以选择的图片张数
        sizeType: ['compressed'], // 所选的图片的尺寸
        sourceType: ['album', 'camera'], // 选择图片的来源
        success: function (chooseResult) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = chooseResult.tempFilePaths
          
          // 批量上传图片
          setUploading(true);
          const uploadPromises = tempFilePaths.map((filePath, index) => {
            return new Promise<string>((resolve, reject) => {
              Taro.cloud.uploadFile({
                cloudPath: `mood-images/${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}.jpg`,
                filePath: filePath,
                success: res => {
                  console.log(`第${index + 1}张图片上传成功`, res);
                  resolve(res.fileID);
                },
                fail: err => {
                  console.log(`第${index + 1}张图片上传失败`, err);
                  reject(err);
                }
              });
            });
          });

          // 等待所有图片上传完成
          Promise.all(uploadPromises)
            .then(fileIDs => {
              console.log('所有图片上传成功', fileIDs);
              setImages(prev => [...prev, ...fileIDs]);
              setUploading(false);
            })
            .catch(error => {
              console.error('部分图片上传失败', error);
              Taro.showToast({
                title: '部分图片上传失败',
                icon: 'none'
              });
              setUploading(false);
            });
        }
      });
    } catch (error) {
      console.error('选择图片失败:', error);
      Taro.showToast({
        title: '选择图片失败',
        icon: 'none'
      });
    }
  };

  // 处理文本输入
  const handleContentChange = (e) => {
    setContent(e.detail.value);
    
    // 延迟执行滚动，确保内容更新后再滚动
    setTimeout(() => {
      const textarea = document.querySelector('.mood-detail__editor-textarea');
      if (textarea) {
        textarea.scrollTop = textarea.scrollHeight;
      }
    }, 100);
  };

  // 保存心情记录
  const handleSave = async () => {
    if (!content.trim()) {
      Taro.showToast({
        title: '请输入内容',
        icon: 'none'
      });
      return;
    }

    try {
      const token = Taro.getStorageSync('authorization')?.token
      const result = await Taro.cloud.callContainer({
        path: '/mood/save', // 业务自定义路径和参数
        method: 'POST', // 根据业务选择对应方法
        header: {
          'X-WX-SERVICE': 'emh-platform-server',
          'authorization': token
        },
        data: {
          year: Number(moodState.dateInfo?.year),
          month: Number(moodState.dateInfo?.month),
          day: Number(moodState.dateInfo?.date),
          mood: moodState.type,
          content,
        }
      });

      if (result.statusCode === 200) {
        Taro.showToast({
          title: '保存成功',
          icon: 'success'
        });

        dispatch(getMoodListAction({data: {year: Number(moodState.dateInfo?.year)}, token}));
        setTimeout(() => {
          Taro.navigateBack();
        }, 1500);
      } else {
        throw new Error(`保存失败: ${result.data?.message || '未知错误'}`);
      }
    } catch (error) {
      console.error('保存失败:', error);
      Taro.showToast({
        title: (error as Error).message || '保存失败',
        icon: 'none'
      });
    }
  };

  // 删除图片
  const handleDeleteImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <View className='mood-detail'>
      <PageHeader goBack={goBack} title='记录' />
      <View className='mood-detail__emojibox'>
        <Image 
          className='mood-detail__emojibox-img'
          src={emoji1Map[moodState.type]} 
          // src={test} 
          mode='aspectFit'
        />
        <View className='mood-detail__emojibox-text'>
          <Text>{emojiTextMap[moodState.type]}</Text>
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
          value={content} 
          onInput={handleContentChange}
          onFocus={() => {
            // 聚焦时滚动到底部
            setTimeout(() => {
              const textarea = document.querySelector('.mood-detail__editor-textarea');
              if (textarea) {
                textarea.scrollTop = textarea.scrollHeight;
              }
            }, 300);
          }}
          maxlength={-1}
          autoHeight
          showConfirmBar={false}
          cursorSpacing={50}
          adjustPosition={true}
          holdKeyboard={true}
        />
         {/* 图片预览区域 */}
         {images.length > 0 && (
          <View className='mood-detail__images'>
            {images.map((url, index) => (
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
            <Image className='mood-detail__editor-action-icon' src={IconTime} />
          </View>
          <View className='mood-detail__editor-save-status'>
            {uploading ? '上传中...' : '草稿自动保存'}
          </View>
        </View>
      </View>
      <Image 
        className='mood-detail__editor-save-button'
        src={IconPublish}
        onClick={handleSave}
      />
    </View>
  )
}
