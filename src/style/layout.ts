import { StyleProp, ViewStyle } from 'react-native';

export const layout = {
  horizontalPaddedContainer: {
    paddingHorizontal: 24,
  },
  topScreen: {
    paddingTop: 12
  }
} satisfies { [key: string]: StyleProp<ViewStyle> };
