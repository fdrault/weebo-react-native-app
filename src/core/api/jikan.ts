import { EntryType, GetSeasonNowResponse } from './jikan-dto';

const JIKAN_BASE = 'https://api.jikan.moe/v4/';

type GetSeasonQueryParams = {
  filter?: EntryType[];
  sfw?: boolean;
  unapproved?: boolean;
  continuing?: boolean;
  page?: number;
  limit?: number;
};

export const getSeasonNow = async (
  params: GetSeasonQueryParams,
  signal: AbortSignal,
) => {
  const url = `${JIKAN_BASE}seasons/now?${mapParams(params)}`;
  const result = await fetch(url, { signal });
  if (!result.ok) throw new Error('Failed to fetch');
  return (await result.json()) as GetSeasonNowResponse;
};

type GetAnimeSearchQueryParams = {
  q: string;
  type?: EntryType[];
  sfw?: boolean;
  unapproved?: boolean;
  continuing?: boolean;
  page?: number;
  limit?: number;
};
export const getAnimeSearch = async (
  params: GetAnimeSearchQueryParams,
  signal: AbortSignal,
) => {
  const url = `${JIKAN_BASE}anime?${mapParams(params)}`;
  const result = await fetch(url, { signal });
  if (!result.ok) throw new Error('Failed to fetch');
  return (await result.json()) as GetSeasonNowResponse;
};

const mapParams = (params: { [key: string]: unknown }) => {
  const array = Object.entries(params);
  const queryParamList = array
    .map(([key, value]) => {
      switch (typeof value) {
        case 'string':
        case 'number':
          return `${key}=${value}`;
        case 'boolean':
          return value ? `${key}` : '';
        case 'object':
          if (Array.isArray(value)) {
            if (value.length > 0) {
              return `${key}=${value.join(',')}`;
            }
            return '';
          }
        // fallthrough
        default: {
          console.warn(`Unable to transform query params ${key}, ignoring it`);
          return '';
        }
      }
    })
    .filter(q => q !== '');
  return queryParamList.join('&');
};
