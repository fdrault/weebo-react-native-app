import { getAnimeSearch, getSeasonNow } from '@/core/api/jikan';
import { AnimeData } from '@/core/api/jikan-dto';
import { combineStores, createStore } from '@/core/store/store';

type MyAnimeListId = number;

export class AnimeService {
  animes = createStore<Map<MyAnimeListId, AnimeData>>(new Map());

  seasonNowIds = createStore<MyAnimeListId[]>([]);
  seasonNow = combineStores(
    { ids: this.seasonNowIds, animes: this.animes },
    ({ ids, animes }) => ids.map(id => animes.get(id)!),
  );

  searchAnime: (signal: AbortSignal, q: string) => Promise<AnimeData[]> =
    async (signal, q) => {
      const result = await getAnimeSearch({ q, limit: 10 }, signal);
      this.updateAnimeEntries(result.data);
      return result.data;
    };

  private updateAnimeEntries = (entries: AnimeData[]) => {
    this.animes.update(animeMap => {
      const updatedMap = new Map(animeMap);
      for (const entry of entries) {
        console.log('Update entry', entry.title);
        updatedMap.set(entry.mal_id, entry);
      }
      return updatedMap;
    });
  };

  fetchSeasonNow = async (signal: AbortSignal) => {
    console.log('fetching Season Now...');
    const result = await getSeasonNow({ limit: 10 }, signal);
    this.updateAnimeEntries(result.data);
    this.seasonNowIds.set(result.data.map(a => a.mal_id));
    return result.data;
  };
}

export const animeService = new AnimeService();
