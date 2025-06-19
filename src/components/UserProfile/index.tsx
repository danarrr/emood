import { View, Button, Image, Input } from '@tarojs/components'
import Taro, { getStorageSync } from '@tarojs/taro'
import { useState } from 'react'
import './index.less'

interface UserProfileProps {
  defaultAvatar?: string;
  defaultNickname?: string;
  vipStatus?: string;
  onProfileChange?: (profile: { avatarUrl: string; nickName: string }) => void;
  onEditClick?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  defaultAvatar = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
  defaultNickname = '用户昵称',
  vipStatus = '还未加入会员',
  onProfileChange,
  onEditClick
}) => {
  const avatarFromStorage = getStorageSync('avatarUrl');
  const nameFromStorage = getStorageSync('nickName');

  const [avatarUrl, setAvatarUrl] = useState(avatarFromStorage || defaultAvatar);
  const [nickName, setNickName] = useState(nameFromStorage || defaultNickname);

  const onChooseAvatar = (e) => {
    const { avatarUrl } = e.detail;
    setAvatarUrl(avatarUrl);
    // 保存到本地存储
    Taro.setStorageSync('avatarUrl', avatarUrl);
    // 通知父组件
    onProfileChange?.({ avatarUrl, nickName });
  }

  const onNickNameChange = (e) => {
    const newNickName = e.detail.value;
    setNickName(newNickName);
    // 保存到本地存储
    Taro.setStorageSync('nickName', newNickName);
    // 通知父组件
    onProfileChange?.({ avatarUrl, nickName: newNickName });
  }

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
        />
        <View className='user-profile__vip-status'>{vipStatus}</View>
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