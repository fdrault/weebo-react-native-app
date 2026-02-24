import { getAnimeSearch, getSeasonNow } from '@/core/api/jikan';
import { AnimeData, GetAnimeSearchResponse } from '@/core/api/jikan-dto';
import { combineStores, createStore } from '@/core/store/store';

type MyAnimeListId = number;

export class AnimeService {
  animes = createStore<Map<MyAnimeListId, AnimeData>>(new Map());

  seasonNowIds = createStore<MyAnimeListId[]>([]);
  seasonNow = combineStores(
    { ids: this.seasonNowIds, animes: this.animes },
    ({ ids, animes }) => ids.map(id => animes.get(id)!),
  );

  searchAnime: (
    signal: AbortSignal,
    page: number,
    q: string,
  ) => Promise<GetAnimeSearchResponse> = async (signal, page, q) => {
    const result = await getAnimeSearch(
      { q, limit: 25, page, sfw: true },
      signal,
    );
    this.updateAnimeEntries(result.data);
    return result;
  };

  private updateAnimeEntries = (entries: AnimeData[]) => {
    this.animes.update(animeMap => {
      const updatedMap = new Map(animeMap);
      for (const entry of entries) {
        updatedMap.set(entry.mal_id, entry);
      }
      return updatedMap;
    });
  };

  fetchSeasonNow = async (signal: AbortSignal) => {
    const result = await getSeasonNow({ limit: 10, sfw: true }, signal);
    this.updateAnimeEntries(result.data);
    this.seasonNowIds.set(result.data.map(a => a.mal_id));
    return result;
  };
}

export const animeService = new AnimeService();
