import { View, Button, Image, Textarea, Text, Progress } from '@tarojs/components'
import Taro, { useLoad, useRouter } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import PageHeader from '../../components/PageHeader'
import IconCamera from '@imgs/icon-camera@2x.png'
import IconTime from '@imgs/icon-time@2x.png'
import './index.less'

// 导入表情图片
import happyEmoji from '@imgs/emoji/happy.png';
import sadEmoji from '@imgs/emoji/sad.png';

// 表情映射表
const emojiMap = {
  'happy': happyEmoji,
  'sad': sadEmoji
};

// 表情文字映射
const emojiTextMap = {
  'happy': '非常好！',
  'sad': '有点难过'
};

type MoodType = 'happy' | 'sad';

interface DateInfo {
  year: string;
  month: string;
  date: string;
}

export default function MoodDetail () {
  const router = useRouter();
  const { mood: moodType = '', date } = router.params as { 
    mood: MoodType; 
    date: string;
  };

  // 状态管理
  const [moodState, setMoodState] = useState<{
    type: MoodType;
    dateInfo: DateInfo | null;
  }>({
    type: moodType,
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
    if (!dateInfo?.month || !dateInfo?.date) return '';
    return `${dateInfo.month}月${dateInfo.date}日`;
  };

  // 选择图片
  const handleChooseImage = async () => {
    // try {
      const res = await Taro.chooseImage({
        count: 9, // 最多可以选择的图片张数
        sizeType: ['compressed'], // 所选的图片的尺寸
        sourceType: ['album', 'camera'], // 选择图片的来源
        success: function (chooseResult) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths
          console.log('上传结果122321', tempFilePaths)
          // 将图片上传至云存储空间
          Taro.cloud.uploadFile({
            // 指定上传到的云路径
            // cloudPath: 'my-photo.png', // @anitato 上传到统一路径
            // 指定要上传的文件的小程序临时文件路径
            filePath: chooseResult.tempFilePaths[0],
            // 成功回调
            success: res => {
              console.log('上传成功', res)
            },
          })
        }
      });

    //   // 上传图片
    //   setUploading(true);
    //   const uploadTasks = res.tempFilePaths.map(filePath => uploadImage(filePath));
    //   const uploadResults = await Promise.all(uploadTasks);
    //   setImages(prev => [...prev, ...uploadResults]);
    //   setUploading(false);
    // } catch (error) {
    //   console.error('选择图片失败:', error);
    //   Taro.showToast({
    //     title: '选择图片失败',
    //     icon: 'none'
    //   });
    // }
  };

  // 处理文本输入
  const handleContentChange = (e) => {
    setContent(e.detail.value);
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
      const result = await Taro.cloud.callContainer({
        path: '/mood/save', // 业务自定义路径和参数
        method: 'POST', // 根据业务选择对应方法
        header: {
          'X-WX-SERVICE': 'emh-platform-server',
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
          src={emojiMap[moodState.type]} 
          mode='aspectFit'
        />
        <View className='mood-detail__emojibox-text'>
          <Text>{emojiTextMap[moodState.type]}</Text>
        </View>
      </View>
      <Text className='mood-detail__input-desc'>{formatDate()}</Text>
      <View className='mood-detail__editor'>
        <Textarea className='mood-detail__editor-textarea' placeholder='今天发生了什么呀~' value={content} onInput={handleContentChange} />
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
        <View onClick={handleSave}>保存</View>
      </View>
    </View>
  )
}
