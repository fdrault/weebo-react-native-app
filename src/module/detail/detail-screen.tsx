import { AnimeData } from '@/core/api/jikan-dto';
import { NavigationParamList } from '@/core/navigation/root-stack';
import { Route } from '@/core/navigation/route';
import { useStore } from '@/core/store/store';
import { getAnimeCharacteritics } from '@/module/detail/detail-anime-format';
import { DetailAnimeBlockTitle } from '@/module/detail/ui/detail-anime-block-title';
import { DetailAnimeTile } from '@/module/detail/ui/detail-anime-tile';
import { favoriteService } from '@/module/service';
import { colors } from '@/style/color';
import { textStyles } from '@/style/font';
import { layout } from '@/style/layout';
import { Button } from '@/ui/button';
import { Grid } from '@/ui/grid';
import { RoundedItem } from '@/ui/rounded-item';
import { ScrollableScreen } from '@/ui/screen';
import { StackScreenProps } from '@react-navigation/stack';
import { Image, StyleSheet, Text, View } from 'react-native';

type DetailScreenProps = StackScreenProps<NavigationParamList, Route.Detail>;
export interface DetailScreenParams {
  anime: AnimeData;
}
export const DetailScreen = (props: DetailScreenProps) => {
  const anime = props.route.params.anime;
  const favorite = useStore(favoriteService.favoritesMap);

  const characteristics = getAnimeCharacteritics(anime);
  return (
    <ScrollableScreen>
      <View style={styles.screen}>
        <View style={styles.banner}>
          <Image
            src={anime.images.jpg.large_image_url}
            style={styles.bannerImage}
          />
          <Image
            style={styles.shadow}
            resizeMode="stretch"
            source={require('@images/50-gradient-black-bottom.png')}
          />
          <View style={styles.bannerContent}>
            <Text style={textStyles.h1}>{anime.title}</Text>
            <View style={styles.genreContainer}>
              {anime.genres.map(genre => (
                <RoundedItem key={genre.mal_id} label={genre.name} />
              ))}
            </View>
          </View>
        </View>
        <View style={styles.content}>
          <Button
            leftElement={
              <Image
                source={require('@images/28-heart.png')}
                tintColor={colors.white95}
              />
            }
            label={
              favorite.has(anime.mal_id)
                ? 'Retirer des favoris'
                : 'Ajouter aux favoris'
            }
            onPress={() =>
              favorite.has(anime.mal_id)
                ? favoriteService.remove(anime)
                : favoriteService.add(anime)
            }
          />
          <Grid
            data={characteristics}
            renderItem={c => (
              <DetailAnimeTile
                key={c.description}
                icon={c.icon}
                value={c.value}
                description={c.description}
              />
            )}
            rowSize={3}
            rowGap={0}
            columnGap={10}
          />
          <DetailAnimeBlockTitle label="Synopsis" />
          <Text style={styles.synopsis}>{anime.synopsis}</Text>
        </View>
      </View>
    </ScrollableScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  banner: {
    height: 300,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  bannerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bannerContent: {
    ...layout.horizontalPaddedContainer,
  },
  shadow: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: 'auto',
    height: 100,
  },
  title: {},
  genreContainer: {
    flexDirection: 'row',
    columnGap: 7,
  },
  content: {
    ...layout.horizontalPaddedContainer,
    rowGap: 24,
    marginBottom: 24,
  },
  synopsis: {
    ...textStyles.regular,
    fontSize: 14,
  },
});
