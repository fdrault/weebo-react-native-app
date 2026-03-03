import { colors } from '@/style/color';
import { textStyles } from '@/style/font';
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

interface DetailAnimeTileProps {
  style?: StyleProp<ViewStyle>;
  value: string;
  icon: ImageSourcePropType;
  description: string;
}
export const DetailAnimeTile = (props: DetailAnimeTileProps) => {
  const { style, value, description, icon } = props;

  return (
    <View style={[styles.container, style]}>
      <Image style={styles.icon} source={icon} />
      <Text
        style={styles.value}
        adjustsFontSizeToFit
        minimumFontScale={0.6}
        numberOfLines={1}
      >
        {value}
      </Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: colors.purple90,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    flex: 1,
  },
  icon: {
    marginBottom: 8,
  },
  value: {
    ...textStyles.h3,
    marginBottom: 2,
  },
  description: {
    ...textStyles.regular,
    textTransform: 'uppercase',
  },
});
