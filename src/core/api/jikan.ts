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

export const getSeasonNow = async (params: GetSeasonQueryParams) => {
  const url = `${JIKAN_BASE}${mapParams(params)}`;
  const result = await fetch(url);
  if (!result.ok) throw new Error('Failed to fetch');
  return (await result.json()) as GetSeasonNowResponse;
};


const mapParams = (params: { [key: string]: unknown }) => {
  const array = Object.entries(params);
  const queryParamList = array
    .map(([key, value]) => {
      switch (typeof value) {
        case 'string':
        // BREAKTHROUGH
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
        // BREAKTHROUGH
        default: {
          console.warn(`Unable to transform query params ${key}, ignoring it`);
          return '';
        }
      }
    })
    .filter(q => q !== '');
  return queryParamList.join('&');
};