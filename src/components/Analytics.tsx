import { Helmet } from 'react-helmet-async';

export function Analytics() {
  const domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined;
  if (!domain) return null;
  const src = (import.meta.env.VITE_PLAUSIBLE_SRC as string | undefined) || 'https://plausible.io/js/script.js';

  return (
    <Helmet>
      <script defer data-domain={domain} src={src} />
    </Helmet>
  );
}
