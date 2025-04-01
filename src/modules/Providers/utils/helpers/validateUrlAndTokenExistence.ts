import { ValidationMsg } from '../validators/common';

/**
 * Function to ensure that the input url, token fields are both set or both empty.
 */
export const validateUrlAndTokenExistence = (url: string, token: string): ValidationMsg => {
  // Empty URL + token is valid as host providers
  if (url === '' && token === '') {
    return { type: 'default' };
  }

  // If we have url, token is required
  if (url !== '' && token === '') {
    return { type: 'error', msg: `Missing required fields [token]` };
  }

  // If we have token, url is required
  if (url === '' && token !== '') {
    return { type: 'error', msg: `Missing required fields [url]` };
  }

  return null;
};
