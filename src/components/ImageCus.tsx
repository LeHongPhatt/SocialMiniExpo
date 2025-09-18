import React, {ReactNode} from 'react';
import {StyleSheet} from 'react-native';
import FastImage, {FastImageProps, ResizeMode} from 'react-native-fast-image';

export default function ImageCus(props: IImage) {
  const {style, resizeMode, source, size, children, ...rest} = props;

  const styles = StyleSheet.create({
    avatar: {
      width: size,
      height: size,
      borderRadius: Math.round((size ?? 0) * 0.5),
    },
  });

  let resize: ResizeMode = FastImage.resizeMode.cover;
  switch (resizeMode) {
    case 'contain':
      resize = FastImage.resizeMode.contain;
      break;
    case 'stretch':
      resize = FastImage.resizeMode.stretch;
      break;
    case 'center':
      resize = FastImage.resizeMode.center;
      break;
  }
  return (
    <FastImage
      style={[style, size ? styles.avatar : {}]}
      {...rest}
      source={source}
      resizeMode={resize}>
      {children}
    </FastImage>
  );
}

export interface IImage {
  style?: any;
  size?: number;
  source?: FastImageProps['source'];
  resizeMode?: ResizeMode;
  children?: ReactNode;
}