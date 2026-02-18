import { getAnimeSearch } from '@/core/api/jikan';
import { AnimeData } from '@/core/api/jikan-dto';
import { Loader } from '@/core/api/loader';
import { createStore } from '@/core/store/store';

class AnimeService {
  animes = createStore<Map<number, AnimeData>>(new Map());

  searchAnime = async (q: string, signal: AbortSignal) => {
    const result = await getAnimeSearch({ q, limit: 10 }, signal);
    this.updateAnimeEntries(result.data);
    return result.data;
  };

  searchAnimeLoader = new Loader(this.searchAnime, { wait: 1000 });

  private updateAnimeEntries(entries: AnimeData[]) {
    this.animes.update(animeMap => {
      for (const entry of entries) {
        animeMap.set(entry.mal_id, entry);
      }
      return animeMap;
    });
  }
}

export const animeService = new AnimeService();
