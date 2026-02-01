import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../constants';
import { getEnv } from '../utils/env';
import settingsSeed from '../data/settings.json';

interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  borderStyle: string;
}

interface PageContent {
  home: {
    welcomeText: string;
    profileImage: string;
    jobTitle: string;
    bio: string;
  };
  about: {
    title: string;
    professionalJourney: string;
    skills: string[];
    workPhilosophy: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    officeHours: string;
  };
}

interface SeoSettings {
  siteUrl: string;
  defaultOgImage: string;
  twitterHandle: string;
}

interface SocialLinks {
  twitter: string;
  linkedin: string;
  github: string;
}

interface AuthorProfile {
  name: string;
  role: string;
  bio: string;
  avatar: string;
}

interface Settings {
  title: string;
  description: string;
  adminPassword: string;
  theme: ThemeSettings;
  seo: SeoSettings;
  social: SocialLinks;
  author: AuthorProfile;
  content: PageContent;
}

interface SettingsState {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  updateTheme: (newTheme: Partial<ThemeSettings>) => void;
  updatePageContent: (page: keyof PageContent, content: Partial<PageContent[keyof PageContent]>) => void;
}

const baseSettings: Settings = {
  title: "Gizmeli Kedi's Personal Website",
  description: "Planning Specialist turning chaos into order, one plan at a time",
  // Set via admin setup on first login
  adminPassword: '',
  theme: {
    primaryColor: '#9333ea',
    secondaryColor: '#ec4899',
    accentColor: '#fde047',
    fontFamily: 'Comic',
    borderStyle: 'border-4'
  },
  seo: {
    siteUrl: '',
    defaultOgImage: '',
    twitterHandle: '',
  },
  social: {
    twitter: '',
    linkedin: '',
    github: '',
  },
  author: {
    name: "Gizmeli Kedi",
    role: "Planning Specialist",
    bio: "Turning chaos into order, one plan at a time",
    avatar: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400&h=400&fit=crop",
  },
  content: {
    home: {
      welcomeText: "Welcome to Gizmeli Kedi's Personal Website!",
      profileImage: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400&h=400&fit=crop",
      jobTitle: "Planning Specialist",
      bio: "Turning chaos into order, one plan at a time"
    },
    about: {
      title: "Professional Journey",
      professionalJourney: "With years of experience in strategic planning and project coordination, I specialize in turning complex ideas into actionable plans.",
      skills: [
        "Project Management",
        "Strategic Planning",
        "Resource Allocation",
        "Risk Assessment"
      ],
      workPhilosophy: "I believe in creating structured, achievable plans while maintaining flexibility for unexpected challenges."
    },
    contact: {
      email: "gizmelikedi@example.com",
      phone: "+1 (555) 123-4567",
      address: "Planning Department, Dream Corp",
      officeHours: "Monday - Friday: 9:00 AM - 5:00 PM\nWeekend: By appointment only"
    }
  }
};

const mergeSettings = (base: Settings, override?: Partial<Settings>): Settings => ({
  ...base,
  ...override,
  theme: { ...base.theme, ...(override?.theme ?? {}) },
  seo: { ...base.seo, ...(override?.seo ?? {}) },
  social: { ...base.social, ...(override?.social ?? {}) },
  author: { ...base.author, ...(override?.author ?? {}) },
  content: {
    ...base.content,
    ...(override?.content ?? {}),
    home: { ...base.content.home, ...(override?.content?.home ?? {}) },
    about: { ...base.content.about, ...(override?.content?.about ?? {}) },
    contact: { ...base.content.contact, ...(override?.content?.contact ?? {}) },
  },
});

const envAdminPassword = (() => {
  const value = getEnv('VITE_ADMIN_PASSWORD_HASH');
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }
  return '';
})();

const defaultSettings = mergeSettings(
  baseSettings,
  { ...(settingsSeed as Partial<Settings>), adminPassword: envAdminPassword }
);

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: mergeSettings(state.settings, newSettings)
        })),
      updateTheme: (newTheme) =>
        set((state) => ({
          settings: {
            ...state.settings,
            theme: { ...state.settings.theme, ...newTheme }
          }
        })),
      updatePageContent: (page, content) =>
        set((state) => ({
          settings: {
            ...state.settings,
            content: {
              ...state.settings.content,
              [page]: { ...state.settings.content[page], ...content }
            }
          }
        }))
    }),
    {
      name: STORAGE_KEYS.SETTINGS,
      version: 1,
      migrate: (state: unknown) => {
        if (!state || typeof state !== 'object') return state;
        const typedState = state as { settings?: Partial<Settings> } & Record<string, unknown>;
        if (!typedState.settings) return state;
        const persistedSettings = typedState.settings;
        return {
          ...typedState,
          settings: mergeSettings(defaultSettings, persistedSettings),
        };
      },
    }
  )
);
