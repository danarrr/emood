import { View, Button, Image, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useCallback, useRef } from 'react'
import { useAppSelector } from '@/store'
import './index.less'

interface UserProfileProps {
  defaultAvatar?: string;
  defaultNickname?: string;
  showVipStatus?: boolean;
  onProfileChange?: (profile: { avatarUrl: string; nickName: string }) => void;
  onEditClick?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  defaultAvatar = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
  defaultNickname = '用户昵称',
  showVipStatus = true,
  onProfileChange,
  onEditClick
}) => {
  const userInfo = useAppSelector(state => state.user.userInfo.data);
  const vipStatus = showVipStatus ? (userInfo?.isMember ? '尊贵会员' : '还未加入会员') : '';
  const [avatarUrl, setAvatarUrl] = useState(userInfo?.avatar || defaultAvatar);
  const [nickName, setNickName] = useState(userInfo?.nickname || defaultNickname);

  const onChooseAvatar = async (e) => {
    const { avatarUrl } = e.detail;
    
    // 显示上传中提示
    Taro.showLoading({ title: '上传中...' });

    try {
      // 上传头像到云存储
      const uploadResult = await new Promise<string>((resolve, reject) => {
        Taro.cloud.uploadFile({
          cloudPath: `avatars/${userInfo?.userid}.jpg`,
          filePath: avatarUrl,
          success: res => resolve(res.fileID),
          fail: err => reject(err)
        });
      });
      
      // 更新本地状态
      setAvatarUrl(uploadResult);
      
      // 通知父组件，传递永久链接
      onProfileChange?.({ avatarUrl: uploadResult, nickName });
      
      Taro.hideLoading();
      Taro.showToast({ title: '头像上传成功', icon: 'success' });
    } catch (error) {
      Taro.hideLoading();
      Taro.showToast({ title: '头像上传失败', icon: 'none' });
      console.error('头像上传失败:', error);
    }
  }

  // 节流：记录上次触发时间
  const lastInvokeRef = useRef<number>(0);

  const onNickNameChange = useCallback((e) => {
    let newNickName = e.detail.value;
    const now = Date.now();
    if (now - lastInvokeRef.current >= 500) {
      lastInvokeRef.current = now;
      // 删除 emoji 表情符号
      const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]|[\u{238C}-\u{2454}]|[\u{20D0}-\u{20FF}]|[\u{FE00}-\u{FE0F}]|[\u{1FAB0}-\u{1FABF}]|[\u{1F600}-\u{1F6FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]|[\u{238C}-\u{2454}]|[\u{20D0}-\u{20FF}]|[\u{FE00}-\u{FE0F}]|[\u{1FAB0}-\u{1FABF}]/gu;
      newNickName = newNickName.replace(emojiRegex, '');

      setNickName(newNickName);
      // 通知父组件，使用清理后的昵称
      onProfileChange?.({ avatarUrl, nickName: newNickName });
    }
  }, []);


  return (
    <View className='user-profile'>
      <Button 
        className='user-profile__avatar-wrapper'
        openType='chooseAvatar'
        onChooseAvatar={onChooseAvatar}
      >
        <Image className='user-profile__avatar' src={avatarUrl} />
      </Button>
      <View className='user-profile__info'>
        <Input 
          className='user-profile__nickname' 
          type='nickname'
          value={nickName}
          onInput={onNickNameChange}
          // onBlur={onNickNameBlur}
        />
        <View className='user-profile__vip-status'>{vipStatus} {userInfo?.userid}</View>
      </View>
      {/* <Image 
        className='user-profile__edit' 
        src={IconEdit}
        onClick={onEditClick}
      /> */}
    </View>
  );
};

export default UserProfile; 