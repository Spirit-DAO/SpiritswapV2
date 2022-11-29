export type FeatureFlags = {
  environment: string;
  production: {
    [key: string]: boolean;
  };
  development: {
    [key: string]: boolean;
  };
};
