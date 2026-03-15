import { useStore } from '@/core/store/store';
import { DraggableFavoriteList } from '@/module/favorite/draggable-favorite-list';
import { favoriteService } from '@/module/service';
import { layout } from '@/style/layout';
import { Header } from '@/ui/header';
import { Screen } from '@/ui/screen';
import { ScrollView } from 'react-native';

export const FavoriteScreen = () => {
  const favorites = useStore(favoriteService.favorites);

  return (
    <Screen>
      <Header
        style={[layout.horizontalPaddedContainer, layout.topScreen]}
        title="Mes Favoris"
      />
      <ScrollView>
        <DraggableFavoriteList
          style={layout.horizontalPaddedContainer}
          items={favorites}
          onReorder={(from, to) => favoriteService.reorder(from, to)}
        />
      </ScrollView>
    </Screen>
  );
};
