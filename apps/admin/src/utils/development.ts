export const isDevelopment = () => process.env.NODE_ENV === 'development';

// ----------------------------------------------------------------------

export const getValueBasedOnEnv = <T>(developmentValue: T, productionValue: T): T =>
  isDevelopment() ? developmentValue : productionValue;
