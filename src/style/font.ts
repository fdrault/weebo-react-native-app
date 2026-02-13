import { StyleProp, TextStyle } from 'react-native';
import { colors } from './color';

export const font = {
  regular: {
    fontFamily: 'BeVietnamPro-Regular',
  },
  bold: {
    fontFamily: 'BeVietnamPro-Bold',
  },
  semibold: {
    fontFamily: 'BeVietnamPro-SemiBold',
  },
} satisfies { [key: string]: StyleProp<TextStyle> };

export const textStyles = {
  header: {
    ...font.bold,
    fontSize: 30,
    color: colors.blueGrey,
  },
} satisfies { [key: string]: StyleProp<TextStyle> };
