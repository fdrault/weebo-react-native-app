import { AnimeData } from '@/core/api/jikan-dto';
import { MMKVRecordStorage } from '@/core/store/mmkv-record-storage';
import { createPersistentStore } from '@/core/store/persistent-store';
import { ReadableStore, WritableStore } from '@/core/store/store';
import { MyAnimeListId } from '@/lib/anime/my-anime-list-id';

export type FavoriteEntry = {
  id: MyAnimeListId;
  added: DateString;
  myRank: number;
  data: AnimeData;
};

type DateString = string;
export class FavoriteService {
  storage = new MMKVRecordStorage('favorite-service');
  private favoritesData: WritableStore<Map<MyAnimeListId, FavoriteEntry>>;
  favorites: ReadableStore<FavoriteEntry[]>;
  favoritesMap: ReadableStore<Map<MyAnimeListId, FavoriteEntry>>;

  constructor() {
    this.favoritesData = createPersistentStore(
      this.storage,
      'anime-favorite',
      new Map(),
      s => JSON.stringify(Array.from(s)),
      s => new Map(JSON.parse(s)),
    );
    this.favorites = this.favoritesData.select(map =>
      Array.from(map.values()).sort((a, b) => b.myRank - a.myRank),
    );
    this.favoritesMap = this.favoritesData.readonly;
  }

  add(anime: AnimeData) {
    console.log(`Add ${anime.title}`);
    const isAlreadyFavorite = this.favoritesData.get().has(anime.mal_id);
    if (!isAlreadyFavorite) {
      this.favoritesData.update(
        map =>
          new Map(
            map.set(anime.mal_id, {
              id: anime.mal_id,
              added: new Date().toISOString(),
              data: anime,
              myRank: map.size,
            }),
          ),
      );
    }
  }

  remove(anime: AnimeData) {
    console.log(`Remove ${anime.title}`);
    this.favoritesData.update(map => {
      if (map.has(anime.mal_id)) {
        const rank = map.get(anime.mal_id)?.myRank ?? Infinity;
        map.delete(anime.mal_id);
        // reorder ranking
        map.forEach(entry => {
          if (entry.myRank > rank) {
            entry.myRank--;
          }
        });
      }
      return new Map(map);
    });
  }

  reorder(from: number, to: number) {
    this.favoritesData.update(map => {
      const sorted = Array.from(map.values()).sort(
        (a, b) => b.myRank - a.myRank,
      );
      const [moved] = sorted.splice(from, 1);
      sorted.splice(to, 0, moved);
      const newMap = new Map<MyAnimeListId, FavoriteEntry>();
      sorted.forEach((entry, index) => {
        entry.myRank = sorted.length - 1 - index;
        newMap.set(entry.id, entry);
      });
      return newMap;
    });
  }
}
