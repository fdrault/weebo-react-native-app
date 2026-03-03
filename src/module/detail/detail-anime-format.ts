import { AnimeData } from '@/core/api/jikan-dto';
import { ImageSourcePropType } from 'react-native';

interface AnimeCharacteristics {
  icon: ImageSourcePropType;
  value: string;
  description: string;
}
export const getAnimeCharacteritics: (
  a: AnimeData,
) => AnimeCharacteristics[] = anime => {
  const score = {
    icon: require('@images/24-star.png'),
    value: anime.score !== null ? `${anime.score}` : '-',
    description: 'Note',
  };
  const mainStudioName = anime.studios.length > 0 ? anime.studios[0].name : '-';
  const studio = {
    icon: require('@images/24-movie.png'),
    value: mainStudioName,
    description: 'Studio',
  };
  const episodes = {
    icon: require('@images/24-list.png'),
    value: `${anime.episodes ?? '-'}`,
    description: 'Épisodes',
  };
  return [score, studio, episodes];
};
