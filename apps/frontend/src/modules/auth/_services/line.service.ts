import type { LoginResponse } from '../_types/auth.type';
import type { ApiResponse } from 'src/shared/types/api.type';

import axios from 'src/shared/utils/axios';
import { endpoints } from 'src/shared/configs/endpoints.config';

// ----------------------------------------------------------------------

export const getLineLoginUrl = async () => {
  const { data } = await axios.get<ApiResponse<string>>(endpoints.auth.line.link);

  const lineLoginUrl = data.data;

  return lineLoginUrl;
};

// ----------------------------------------------------------------------

export const lineLogin = async (authorizationCode: string) => {
  const { data } = await axios.post<ApiResponse<LoginResponse>>(endpoints.auth.line.login, {
    authorizationCode,
  });

  const { credentials, user } = data.data;

  return { credentials, user };
};

// ----------------------------------------------------------------------

export function overwriteLineRedirectUrl(url: string, newRedirectUrl: string): string {
  const redirectUriRegex = /([&?]redirect_uri=)([^&]*)/;

  // Replace the current redirect_uri domain with the new one directly in the URL string
  const updatedUrl = url.replace(redirectUriRegex, (_, prefix, uri) => {
    const decodedUri = decodeURIComponent(uri);
    // Change protocol to http and replace the domain part
    // eslint-disable-next-line no-useless-escape
    const updatedUri = decodedUri.replace(/^https?:\/\/[^\/]+/, `http://${newRedirectUrl}`);
    return `${prefix}${encodeURIComponent(updatedUri)}`;
  });

  return updatedUrl;
}
