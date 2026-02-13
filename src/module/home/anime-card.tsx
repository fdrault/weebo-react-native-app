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
    <View style={style}>
      <Image
        style={styles.image}
        source={{ uri: anime.images.jpg.image_url }}
      />
      <Text style={textStyles.h4}>{anime.title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  image: {
    height: 170,
    aspectRatio: 1,
    marginBottom: 7,
  },
});
