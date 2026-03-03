import { AnimeData } from '@/core/api/jikan-dto';
import { textStyles } from '@/style/font';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

interface AnimeRowProps {
  style?: StyleProp<ViewStyle>;
  anime: AnimeData;
}
export const AnimeRow = (props: AnimeRowProps) => {
  const { style, anime } = props;

  return (
    <View style={[styles.container, style]}>
      <Image
        style={styles.image}
        source={{ uri: anime.images.jpg.image_url }}
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {anime.title}
        </Text>
        <Text style={styles.synopsis} numberOfLines={2}>
          {anime.synopsis}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'column',
    flexShrink: 1,
    paddingStart: 16,
  },
  image: {
    width: 80,
    aspectRatio: 1,
    marginBottom: 7,
    borderRadius: 8,
  },
  title: {
    ...textStyles.h4,
    paddingBottom: 4,
    flexShrink: 1,
  },
  synopsis: {
    ...textStyles.regular,
    flexShrink: 1,
  },
});
