import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { AnimeData } from '../../core/api/jikan-dto';
import { textStyles } from '../../style/font';

interface AnimeCardProps {
  style?: StyleProp<ViewStyle>;
  anime: AnimeData;
}
export const AnimeCard = (props: AnimeCardProps) => {
  const { style, anime } = props;

  return (
    <View style={[styles.container, style]}>
      <Image
        style={styles.image}
        source={{ uri: anime.images.jpg.image_url }}
      />
      <Text numberOfLines={2} style={styles.title}>
        {anime.title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  image: {
    height: 170,
    marginBottom: 7,
    borderRadius: 8,
  },
  title: {
    ...textStyles.h4,
  },
});
