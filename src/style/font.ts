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
    color: colors.blueGrey,
  },
  h2: {
    ...font.bold,
    fontSize: 20,
    color: colors.blueGrey,
  },
  h4: {
    ...font.medium,
    fontSize: 14,
    color: colors.blueGrey,
  },
} satisfies { [key: string]: StyleProp<TextStyle> };
