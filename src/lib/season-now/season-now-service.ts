import { getSeasonNow } from '../../core/api/jikan';
import { AnimeData } from '../../core/api/jikan-dto';
import { createStore } from '../../core/store/store';

const buildSeasonNowService = () => {
  const seasonNowList = createStore<AnimeData[]>([]);

  const fetchSeasonNow = async () => {
    console.log('fetching Season Now...');
    const result = await getSeasonNow({ limit: 10 });
    seasonNowList.set(result.data);
  };

  return { seasonNowList: seasonNowList.readonly, fetchSeasonNow };
};

export const seasonNowService = buildSeasonNowService();
