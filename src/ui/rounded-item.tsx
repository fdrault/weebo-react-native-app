import { colors, theme } from '@/style/color';
import { font } from '@/style/font';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

interface RoundedItemProps {
  style?: StyleProp<ViewStyle>;
  label: string;
  theme?: 'primary' | 'secondary';
}

export const RoundedItem = (props: RoundedItemProps) => {
  const { style, label } = props;

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    height: 24,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  label: {
    ...font.semibold,
    fontSize: 12,
    color: colors.white95,
    textTransform: 'uppercase',
  },
});
