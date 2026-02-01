import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { useSettingsStore } from '../store/settingsStore';

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));
const baseSettings = clone(useSettingsStore.getState().settings);

describe('App', () => {
  it('renders with admin enabled and valid colors', async () => {
    (globalThis as { __ENV__?: Record<string, string | boolean> }).__ENV__ = {
      VITE_ENABLE_ADMIN: 'true',
    };
    useSettingsStore.setState({
      settings: {
        ...clone(baseSettings),
        theme: {
          ...baseSettings.theme,
          primaryColor: '#112233',
          secondaryColor: '#445566',
          accentColor: '#778899',
        },
      },
    });

    render(<App />);
    const homes = await screen.findAllByText('Home');
    expect(homes.length).toBeGreaterThan(0);
    expect(screen.getAllByText('Admin').length).toBeGreaterThan(0);
  });

  it('renders with fallback colors when invalid', async () => {
    (globalThis as { __ENV__?: Record<string, string | boolean> }).__ENV__ = {};
    useSettingsStore.setState({
      settings: {
        ...clone(baseSettings),
        theme: {
          ...baseSettings.theme,
          primaryColor: 'invalid',
          secondaryColor: 'invalid',
          accentColor: 'invalid',
        },
      },
    });

    render(<App />);
    const styleTag = document.querySelector('style');
    expect(styleTag?.textContent).toContain('147, 51, 234');
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
  });
});
