import { StyleSheet, Text, View } from 'react-native';
import { useAsync, useAsyncOnFocus } from '../../core/api/use-async';
import { useNavigation } from '../../core/navigation/use-navigation';
import { useStore } from '../../core/store/store';
import { seasonNowService } from '../../lib/season-now/season-now-service';
import { textStyles } from '../../style/font';
import { layout } from '../../style/layout';
import { Grid } from '../../ui/grid';
import { Header } from '../../ui/header';
import { LoadingIndicator } from '../../ui/loading-indicator';
import { Screen } from '../../ui/screen';
import { AnimeCard } from './anime-card';

export const HomeScreen = () => {
  const navigation = useNavigation();
  const [fetchSeasonNow, seasonNowLoading] = useAsync(
    seasonNowService.fetchSeasonNow,
  );

  const season = useStore(seasonNowService.seasonNowList);
  useAsyncOnFocus(fetchSeasonNow);
  return (
    <Screen>
      <Header
        style={[layout.horizontalPaddedContainer, layout.topScreen]}
        title="Découvrir"
      />
      <View style={styles.sectionTitleContainer}>
        <Text style={textStyles.h2}>Saison en cours</Text>
      </View>
      {seasonNowLoading ? (
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
