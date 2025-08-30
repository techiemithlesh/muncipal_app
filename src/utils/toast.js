import Toast from 'react-native-toast-message';

export const showToast = (type = 'success', title = '', message = '') => {
  Toast.show({
    type,          
    text1: title,
    text2: message,
    visibilityTime: 2500,
    position: 'top',
    topOffset: 60,
  });
};
