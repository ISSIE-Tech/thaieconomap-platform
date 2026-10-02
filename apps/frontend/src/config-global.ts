// ----------------------------------------------------------------------

export type ConfigValue = {
  env: 'development' | 'production' | 'test';
  site: {
    basePath: string;
    serverUrl: string;
    routingUrl: string;
    /** csc's LINE LIFF app, where jobs are posted */
    cscLiffUrl: string;
  };
};

// ----------------------------------------------------------------------

export const CONFIG: ConfigValue = {
  env: process.env.NODE_ENV,
  site: {
    basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? '',
    serverUrl: process.env.NEXT_PUBLIC_SERVER_URL ?? '',
    routingUrl: process.env.NEXT_PUBLIC_ROUTING_MAP_URL ?? '',
    cscLiffUrl: process.env.NEXT_PUBLIC_CSC_LIFF_URL ?? '',
  },
};

/**
 * Absolute API URL for server-side fetch(). serverUrl ends with "/" and endpoint paths start
 * with "/"; axios joins them itself, but a raw "//services/..." is a 404 at the gateway.
 */
export const serverApiUrl = (path: string) =>
  `${CONFIG.site.serverUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
