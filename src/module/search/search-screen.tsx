import { FetchStatus } from '@/core/fetcher/fetcher-state';
import { buildSearchPaginationFetcher } from '@/core/fetcher/pagination-fetcher';
import { useStore } from '@/core/store/store';
import { useLazyRef } from '@/core/use-lazy-ref';
import { animeService } from '@/lib/anime/anime-service';
import { AnimeRow } from '@/module/search/anime-row';
import { colors } from '@/style/color';
import { layout } from '@/style/layout';
import { Header } from '@/ui/header';
import { LoadingIndicator } from '@/ui/loading-indicator';
import { Screen } from '@/ui/screen';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, TextInput, View } from 'react-native';

export const SearchScreen = () => {
  const [searchInput, setSearch] = useState('');

  const fetcherRef = useLazyRef(() =>
    buildSearchPaginationFetcher(searchInput, animeService.searchAnime),
  );

  useEffect(() => {
    const fetcher = fetcherRef.current;
    return () => fetcher.abortOngoingRequest();
  }, [fetcherRef]);
  useEffect(() => {
    if (searchInput.length > 0) {
      fetcherRef.current.abortOngoingRequest();
      fetcherRef.current = buildSearchPaginationFetcher(
        searchInput,
        animeService.searchAnime,
      );
      fetcherRef.current.fetch();
    } else {
      fetcherRef.current.reset();
    }
  }, [searchInput, fetcherRef]);

  const state = useStore(fetcherRef.current.fetchState);
  const fetchMoreState = useStore(fetcherRef.current.fetchMoreState);
  const refreshState = useStore(fetcherRef.current.refreshState);
  const hasMore =
    state.status === FetchStatus.READY && state.data.pagination.has_next_page;
  console.log(
    state.status === FetchStatus.READY
      ? `"${searchInput}" Result Length: ${state.data.data.length}`
      : 'Fetching',
  );
  console.log(`Status: ${fetchMoreState.status}`);

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
            onChangeText={setSearch}
            placeholder="Anime, studios..."
            placeholderTextColor={colors.blueGrey}
            numberOfLines={1}
          />
        </View>
        {state.status === FetchStatus.READY ? (
          <FlatList
            data={state.data.data}
            renderItem={a => (
              <AnimeRow
                key={a.item.mal_id}
                anime={a.item}
                style={styles.animeRow}
              />
            )}
            contentContainerStyle={styles.flatlistContent}
            onEndReached={
              hasMore ? () => fetcherRef.current.fetchMore() : undefined
            }
            style={styles.flatlist}
            ListFooterComponent={
              fetchMoreState.status === FetchStatus.FETCHING ? (
                <LoadingIndicator />
              ) : null
            }
            onRefresh={fetcherRef.current.refresh}
            refreshing={refreshState.status === FetchStatus.FETCHING}
          />
        ) : state.status === FetchStatus.FETCHING ? (
          <LoadingIndicator />
        ) : null}
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
