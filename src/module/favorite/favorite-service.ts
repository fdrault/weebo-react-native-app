import { AnimeData } from '@/core/api/jikan-dto';
import { MMKVRecordStorage } from '@/core/store/mmkv-record-storage';
import { combineStores, createStore, ReadableStore } from '@/core/store/store';
import { AnimeService } from '@/lib/anime/anime-service';
import { MyAnimeListId } from '@/lib/anime/my-anime-list-id';

type FavoriteEntry = {
  id: MyAnimeListId;
  added: DateString;
};
type FavoriteAnime = FavoriteEntry & { data: AnimeData };

type DateString = string;
export class FavoriteService {
  rankedFavorite = createStore<FavoriteEntry[]>([]);
  rankedFavoriteSet: ReadableStore<Set<MyAnimeListId>>;
  favorites: ReadableStore<FavoriteAnime[]>;

  storage = new MMKVRecordStorage('favorite-service');

  constructor(private animeService: AnimeService) {
    this.rankedFavoriteSet = this.rankedFavorite.select(
      t => new Set(t.map(a => a.id)),
    );
    this.favorites = combineStores(
      { rank: this.rankedFavorite, anime: this.animeService.animes },
      ({ rank, anime }) => rank.map(r => ({ ...r, data: anime.get(r.id)! })),
    );
  }

  add(anime: AnimeData) {
    console.log(`Add ${anime.title}`);
    const isAlreadyFavorite = this.rankedFavoriteSet.get().has(anime.mal_id);
    if (!isAlreadyFavorite) {
      this.rankedFavorite.update(c => [
        ...c,
        { id: anime.mal_id, added: new Date().toISOString() },
      ]);
    }
  }

  remove(anime: AnimeData) {
    console.log(`Remove ${anime.title}`);
    this.rankedFavorite.update(c => [...c.filter(i => i.id !== anime.mal_id)]);
  }
}
