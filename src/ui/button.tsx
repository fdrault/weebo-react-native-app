import { theme } from '@/style/color';
import { textStyles } from '@/style/font';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

interface ButtonProps {
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  leftElement?: React.ReactElement;
  label: string;
}
export const Button = (props: ButtonProps) => {
  const { style, onPress, leftElement, label } = props;

  return (
    <Pressable onPress={onPress}>
      <View style={[styles.container, style]}>
        {leftElement}
        <Text style={styles.label}>{label}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
  },
  label: {
    ...textStyles.h4,
  },
});
