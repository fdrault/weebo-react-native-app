import { theme } from '@/style/color';
import { textStyles } from '@/style/font';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

interface DetailAnimeBlockTitleProps {
  style?: StyleProp<ViewStyle>;
  label: string;
}
export const DetailAnimeBlockTitle = (props: DetailAnimeBlockTitleProps) => {
  const { style, label } = props;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.rectangle} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    ...textStyles.h2,
  },
  rectangle: {
    width: 4,
    alignSelf: 'stretch',
    backgroundColor: theme.primary,
    marginEnd: 12,
  },
});
