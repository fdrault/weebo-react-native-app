import { LoaderStatus } from '@/core/api/loader';
import { useStore } from '@/core/store/store';
import { animeService } from '@/lib/anime/anime-service';
import { AnimeRow } from '@/module/search/anime-row';
import { colors } from '@/style/color';
import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, TextInput, View } from 'react-native';
import { layout } from '../../style/layout';
import { Header } from '../../ui/header';
import { Screen } from '../../ui/screen';

export const SearchScreen = () => {
  const [searchInput, setSearch] = useState('');
  const loader = useRef(animeService.searchAnimeLoader);
  const result = useStore(loader.current.state);

  useEffect(() => {
    if (searchInput.length > 0) {
      loader.current.load(searchInput);
    }
  }, [searchInput]);

  return (
    <Screen>
      <Header
        style={[layout.horizontalPaddedContainer, layout.topScreen]}
        title="Recherche"
      />
      <View style={[layout.horizontalPaddedContainer]}>
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
        {result.status === LoaderStatus.SUCCESS
          ? result.data.map(a => (
              <AnimeRow key={a.mal_id} anime={a} style={styles.animeRow} />
            ))
          : null}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
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
    marginBottom: 8,
  },
});
