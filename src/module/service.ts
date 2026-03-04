import { animeService } from '@/lib/anime/anime-service';
import { FavoriteService } from '@/module/favorite/favorite-service';

export const favoriteService = new FavoriteService(animeService);
