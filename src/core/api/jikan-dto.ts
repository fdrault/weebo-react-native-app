export interface GetSeasonNowResponse {
  data: AnimeData[];
  pagination: Pagination;
}

export interface AnimeData {
  mal_id: number;
  url: string;
  images: {
    jpg: ImageUrls;
    webp: ImageUrls;
  };
  trailer: {
    youtube_id: string;
    url: string;
    embed_url: string;
  };
  approved: boolean;
  titles: Title[];
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  title_synonyms: string[];
  type: string;
  source: string;
  episodes: number | null;
  status: string;
  airing: boolean;
  aired: AiredDate;
  duration: string;
  rating: string;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string | null;
  background: string | null;
  season: string | null;
  year: number | null;
  broadcast: Broadcast;
  producers: ResourceItem[];
  licensors: ResourceItem[];
  studios: ResourceItem[];
  genres: ResourceItem[];
  explicit_genres: ResourceItem[];
  themes: ResourceItem[];
  demographics: ResourceItem[];
}

interface ImageUrls {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

interface Title {
  type: string;
  title: string;
}

interface ResourceItem {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

interface AiredDate {
  from: string;
  to: string | null;
  prop: {
    from: DateProp;
    to: DateProp;
    string: string;
  };
}

interface DateProp {
  day: number | null;
  month: number | null;
  year: number | null;
}

interface Broadcast {
  day: string | null;
  time: string | null;
  timezone: string | null;
  string: string | null;
}

interface Pagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: {
    count: number;
    total: number;
    per_page: number;
  };
}

export enum EntryType {
  TV = 'tv',
  MOVIE = 'movie',
  OVA = 'ova',
  SPECIAL = 'special',
  ONA = 'ona',
  MUSIC = 'music',
}