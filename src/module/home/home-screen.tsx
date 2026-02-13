import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Screen } from '../../ui/screen';
import { useNavigation } from '../../core/navigation/use-navigation';
import { Header } from '../../ui/header';
import { layout } from '../../style/layout';
import { useAsync, useAsyncOnFocus } from '../../core/api/use-async';
import { seasonNowService } from '../../lib/season-now/season-now-service';
import { useStore } from '../../core/store/store';
import { colors } from '../../style/color';
import { LoadingIndicator } from '../../ui/loading-indicator';
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
      {seasonNowLoading ? (
        <LoadingIndicator />
      ) : (
        season.map(anime => (
          <AnimeCard key={anime.mal_id} anime={anime} />
        ))
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  animeTitle: {
    color: colors.blueGrey,
    fontSize: 22
  }
});
