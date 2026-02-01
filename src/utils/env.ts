export type RuntimeEnv = {
  VITE_ENABLE_ADMIN?: string;
  VITE_PLAUSIBLE_DOMAIN?: string;
  VITE_PLAUSIBLE_SRC?: string;
  VITE_NEWSLETTER_ENDPOINT?: string;
  VITE_ADMIN_PASSWORD_HASH?: string;
  DEV?: boolean | string;
};

const getImportMetaEnv = (): RuntimeEnv | undefined => {
  const override = (globalThis as { __IMPORT_META_ENV__?: RuntimeEnv }).__IMPORT_META_ENV__;
  if (override) return override;
  return (import.meta as { env?: RuntimeEnv }).env;
};

export const getEnv = <K extends keyof RuntimeEnv>(key: K): RuntimeEnv[K] | undefined => {
  const metaEnv = getImportMetaEnv();
  if (metaEnv && typeof metaEnv === 'object') return metaEnv[key];
  return (globalThis as { __ENV__?: RuntimeEnv }).__ENV__?.[key];
};

export const getEnvBoolean = (key: keyof RuntimeEnv): boolean => {
  const value = getEnv(key);
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value === 'true';
  return false;
};
