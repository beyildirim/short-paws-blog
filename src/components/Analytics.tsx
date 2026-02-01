import { Helmet } from 'react-helmet-async';
import { getEnv } from '../utils/env';

export function Analytics() {
  const domain = getEnv('VITE_PLAUSIBLE_DOMAIN');
  if (!domain) return null;
  const src = getEnv('VITE_PLAUSIBLE_SRC') || 'https://plausible.io/js/script.js';

  return (
    <Helmet>
      <script defer data-domain={domain} src={src} />
    </Helmet>
  );
}
