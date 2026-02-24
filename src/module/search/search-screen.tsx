import { useDebounce } from '@/core/debounce';
import { useStore } from '@/core/store/store';
import { useLazyRef } from '@/core/use-lazy-ref';
import { animeService } from '@/lib/anime/anime-service';
import { AnimeRow } from '@/module/search/anime-row';
import { SearchPaginationController } from '@/module/search/search-pagination-controller';
import { colors } from '@/style/color';
import { layout } from '@/style/layout';
import { Header } from '@/ui/header';
import { LoadingIndicator } from '@/ui/loading-indicator';
import { Screen } from '@/ui/screen';
import React, { useEffect } from 'react';
import { FlatList, Image, StyleSheet, TextInput, View } from 'react-native';

export const SearchScreen = () => {
  const fetcherRef = useLazyRef(
    () => new SearchPaginationController(animeService.searchAnime),
  );

  useEffect(() => {
    const fetcher = fetcherRef.current;
    return () => fetcher.abort();
  }, [fetcherRef]);

  const state = useStore(fetcherRef.current.state);
  const search = useDebounce((q: string) => fetcherRef.current.fetch(q), 1000);

  return (
    <Screen>
      <Header
        style={[layout.horizontalPaddedContainer, layout.topScreen]}
        title="Recherche"
      />
      <View style={[layout.horizontalPaddedContainer, styles.fill]}>
        <View style={styles.searchBarContainer}>
          <Image source={require('@images/24-magnifier.png')} />
          <TextInput
            style={styles.textInput}
            onChangeText={search}
            placeholder="Anime, studios..."
            placeholderTextColor={colors.blueGrey}
            numberOfLines={1}
          />
        </View>
        {state.fetching ? (
          <LoadingIndicator />
        ) : (
          <FlatList
            data={state.data}
            renderItem={a => (
              <AnimeRow
                key={a.item.mal_id}
                anime={a.item}
                style={styles.animeRow}
              />
            )}
            contentContainerStyle={styles.flatlistContent}
            onEndReached={
              state.hasMore ? () => fetcherRef.current.fetchMore() : undefined
            }
            style={styles.flatlist}
            ListFooterComponent={
              state.fetchingMore ? <LoadingIndicator /> : null
            }
            onRefresh={fetcherRef.current.refresh}
            refreshing={state.refreshing}
          />
        )}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  flatlist: {
    flexGrow: 1,
    flexBasis: 0,
  },
  flatlistContent: {
    flexGrow: 1,
  },
  searchBarContainer: {
    flexDirection: 'row',
    backgroundColor: colors.darkBgSecondary,
    paddingHorizontal: 16,
    borderRadius: 12,
    minHeight: 48,
    alignItems: 'center',
    marginBottom: 16,
  },
  textInput: {
    paddingStart: 16,
    flex: 1,
  },
  animeRow: {
    marginBottom: 14,
  },
});
