import { Route } from '@/core/navigation/route';
import { useNavigation } from '@/core/navigation/use-navigation';
import { useStore } from '@/core/store/store';
import { useLazyRef } from '@/core/use-lazy-ref';
import { animeService } from '@/lib/anime/anime-service';
import { SeasonNowController } from '@/module/home/season-now-controller';
import { textStyles } from '@/style/font';
import { layout } from '@/style/layout';
import { Grid } from '@/ui/grid';
import { Header } from '@/ui/header';
import { LoadingIndicator } from '@/ui/loading-indicator';
import { ScrollableScreen } from '@/ui/screen';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AnimeCard } from './anime-card';

export const HomeScreen = () => {
  const navigation = useNavigation();
  const fetcher = useLazyRef(
    () => new SeasonNowController(animeService.fetchSeasonNow),
  );
  const state = useStore(fetcher.current.state);
  const onFocus = useCallback(() => {
    fetcher.current.fetch();
    return () => fetcher.current.abort();
  }, [fetcher]);
  useFocusEffect(onFocus);

  const season = useStore(animeService.seasonNow);
  return (
    <ScrollableScreen>
      <Header
        style={[layout.horizontalPaddedContainer, layout.topScreen]}
        title="Découvrir"
      />
      <View style={styles.sectionTitleContainer}>
        <Text style={textStyles.h2}>Saison en cours</Text>
      </View>
      {state.fetching ? (
        <LoadingIndicator />
      ) : (
        <Grid
          style={layout.horizontalPaddedContainer}
          rowSize={2}
          rowGap={16}
          columnGap={16}
          data={season}
          renderItem={anime => (
            <Pressable
              onPress={() => {
                navigation.push(Route.Detail, { anime });
              }}
            >
              <AnimeCard key={anime.mal_id} anime={anime} />
            </Pressable>
          )}
        />
      )}
    </ScrollableScreen>
  );
};

const styles = StyleSheet.create({
  sectionTitleContainer: {
    ...layout.horizontalPaddedContainer,
    paddingBottom: 16,
  },
});
