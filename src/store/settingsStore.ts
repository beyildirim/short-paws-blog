import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

interface Settings {
  title: string;
  description: string;
  adminPassword: string;
  theme: ThemeSettings;
  content: PageContent;
}

interface SettingsState {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  updateTheme: (newTheme: Partial<ThemeSettings>) => void;
  updatePageContent: (page: keyof PageContent, content: Partial<PageContent[keyof PageContent]>) => void;
}

const defaultSettings: Settings = {
  title: "Gizmeli Kedi's Personal Website",
  description: "Planning Specialist turning chaos into order, one plan at a time",
  adminPassword: "gizmelikedi123",
  theme: {
    primaryColor: '#9333ea',
    secondaryColor: '#ec4899',
    accentColor: '#fde047',
    fontFamily: 'Comic',
    borderStyle: 'border-4'
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

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
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
      name: 'settings-storage',
    }
  )
);