import { Loader, LoaderStatus } from '@/core/api/loader';
import { useLoaderOnFocus } from '@/core/api/use-loader';
import { useStore } from '@/core/store/store';
import { animeService } from '@/lib/anime/anime-service';
import { textStyles } from '@/style/font';
import { layout } from '@/style/layout';
import { Grid } from '@/ui/grid';
import { Header } from '@/ui/header';
import { LoadingIndicator } from '@/ui/loading-indicator';
import { Screen } from '@/ui/screen';
import { StyleSheet, Text, View } from 'react-native';
import { AnimeCard } from './anime-card';

export const HomeScreen = () => {
  const { state } = useLoaderOnFocus(
    () =>
      new Loader(animeService.fetchSeasonNow, {
        type: 'swr',
        duration: 60 * 1000,
      }),
  );

  const season = useStore(animeService.seasonNow);

  return (
    <Screen>
      <Header
        style={[layout.horizontalPaddedContainer, layout.topScreen]}
        title="Découvrir"
      />
      <View style={styles.sectionTitleContainer}>
        <Text style={textStyles.h2}>Saison en cours</Text>
      </View>
      {state.status !== LoaderStatus.SUCCESS ? (
        <LoadingIndicator />
      ) : (
        <Grid
          style={layout.horizontalPaddedContainer}
          rowSize={2}
          rowGap={16}
          columnGap={16}
          data={season}
          renderItem={anime => <AnimeCard key={anime.mal_id} anime={anime} />}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  sectionTitleContainer: {
    ...layout.horizontalPaddedContainer,
    paddingBottom: 16,
  },
});
