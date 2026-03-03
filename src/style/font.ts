import { StyleProp, TextStyle } from 'react-native';
import { colors } from './color';

export const font = {
  regular: {
    fontFamily: 'BeVietnamPro-Regular',
  },
  medium: {
    fontFamily: 'BeVietnamPro-Medium',
  },
  bold: {
    fontFamily: 'BeVietnamPro-Bold',
  },
  semibold: {
    fontFamily: 'BeVietnamPro-SemiBold',
  },
} satisfies { [key: string]: StyleProp<TextStyle> };

export const textStyles = {
  h1: {
    ...font.bold,
    fontSize: 30,
    color: colors.white95,
  },
  h2: {
    ...font.bold,
    fontSize: 20,
    color: colors.white95,
  },
  h3: {
    ...font.bold,
    fontSize: 18,
    color: colors.white95,
  },
  h4: {
    ...font.bold,
    fontSize: 16,
    color: colors.white95,
  },
  h5: {
    ...font.medium,
    fontSize: 14,
    color: colors.white95,
  },
  regular: {
    ...font.regular,
    fontSize: 12,
    color: colors.grey,
  },
} satisfies { [key: string]: StyleProp<TextStyle> };
