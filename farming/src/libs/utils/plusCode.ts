import fetch from 'node-fetch';
import env from '../../config/env';
import { ERR_PLUS_CODE_INVALID_REQUEST } from '../constants/errors';

export type DecodedPlusCode = {
  lat: number;
  lng: number;
};

export async function decodePlusCode(code: string): Promise<DecodedPlusCode> {
  const query = new URLSearchParams({
    key: env.GOOGLE_GEOCODING_API_KEY,
    address: code,
  });
  const response = await fetch(`https://plus.codes/api?${query.toString()}`, {
    method: 'POST',
  });

  const responseBody = await response.json();
  if (responseBody?.status !== 'OK') {
    throw ERR_PLUS_CODE_INVALID_REQUEST(responseBody);
  }

  const result = responseBody?.plus_code?.geometry?.location;
  if (!result) {
    throw new Error('decoding failed!');
  }
  return result as DecodedPlusCode;
}
