// ----------------------------------------------------------------------

export type ConfigValue = {
  env: 'development' | 'production' | 'test';
  site: {
    basePath: string;
    serverUrl: string;
    routingUrl: string;
  };
};

// ----------------------------------------------------------------------

export const CONFIG: ConfigValue = {
  env: process.env.NODE_ENV,
  site: {
    basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? '',
    serverUrl: process.env.NEXT_PUBLIC_SERVER_URL ?? '',
    routingUrl: process.env.NEXT_PUBLIC_ROUTING_MAP_URL ?? '',
  },
};
