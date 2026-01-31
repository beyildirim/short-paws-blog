import React from 'react';

export function Helmet({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

export function HelmetProvider({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

export default {
  Helmet,
  HelmetProvider,
};
