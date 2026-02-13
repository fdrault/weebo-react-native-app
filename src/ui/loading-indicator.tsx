import { ActivityIndicator, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, theme } from '../style/color';

interface LoadingIndicatorProps {
  style?: StyleProp<ViewStyle>;
}
export const LoadingIndicator = (props: LoadingIndicatorProps) => {
  const { style } = props;

  return <View style={style}><ActivityIndicator size="large" color={theme.primary} /></View>;
};