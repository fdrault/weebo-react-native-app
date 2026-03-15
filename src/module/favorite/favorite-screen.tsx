import { useStore } from '@/core/store/store';
import { AnimeRow } from '@/module/search/anime-row';
import { favoriteService } from '@/module/service';
import { layout } from '@/style/layout';
import { Header } from '@/ui/header';
import { ScrollableScreen } from '@/ui/screen';

export const FavoriteScreen = () => {
  const favorites = useStore(favoriteService.favorites);

  return (
    <ScrollableScreen>
      <Header
        style={[layout.horizontalPaddedContainer, layout.topScreen]}
        title="Mes Favoris"
      />
      {favorites.map(f => (
        <AnimeRow key={f.id} anime={f.data} />
      ))}
    </ScrollableScreen>
  );
};
