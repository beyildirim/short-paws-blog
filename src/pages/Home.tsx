import { Cat, Stars, Sparkles, Heart, Flower, Flower2, Briefcase } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useSettingsStore } from '../store/settingsStore';
import { ICON_SIZE, ANIMATION_DURATION } from '../constants';

function Home() {
  const { settings } = useSettingsStore();

  return (
    <>
      <Helmet>
        <title>{settings.title}</title>
        <meta name="description" content={settings.description} />
        <meta property="og:title" content={settings.title} />
        <meta property="og:description" content={settings.description} />
      </Helmet>
      {/* Header with marquee */}
      <div className={`bg-[rgb(var(--color-accent))] ${settings.theme.borderStyle} border-[rgb(var(--color-secondary))] rounded-lg p-4 mb-8 shadow-lg relative overflow-hidden`}>
        <div className="absolute -left-4 top-1/2 transform -translate-y-1/2" aria-hidden="true">
          <Flower2 className="w-12 h-12 text-[rgb(var(--color-primary))]" />
        </div>
        <div className="absolute -right-4 top-1/2 transform -translate-y-1/2" aria-hidden="true">
          <Flower className="w-12 h-12 text-[rgb(var(--color-secondary))]" />
        </div>
        <div className="overflow-hidden whitespace-nowrap" style={{ animation: `marquee ${ANIMATION_DURATION.MARQUEE}s linear infinite` }}>
          <div className="inline-flex items-center gap-4">
            <span className="text-2xl" aria-hidden="true">✨</span>
            <span className="text-2xl font-bold text-[rgb(var(--color-primary))]">{settings.content.home.welcomeText}</span>
            <span className="text-2xl" aria-hidden="true">✨</span>
            <Cat className="inline-block text-[rgb(var(--color-secondary))]" size={ICON_SIZE.XLARGE} aria-hidden="true" />
            <span className="text-2xl font-bold text-[rgb(var(--color-primary))]">{settings.content.home.welcomeText}</span>
            <span className="text-2xl" aria-hidden="true">✨</span>
          </div>
        </div>
      </div>

      {/* Profile section */}
      <div className={`bg-white ${settings.theme.borderStyle} border-[rgb(var(--color-primary))] rounded-lg p-6 mb-8 shadow-lg relative`}>
        <div className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
          <Flower className="w-12 h-12 text-[rgb(var(--color-secondary))]" />
        </div>
        <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2" aria-hidden="true">
          <Flower2 className="w-12 h-12 text-[rgb(var(--color-primary))]" />
        </div>
        <div className="flex items-center justify-center mb-4">
          <img
            src={settings.content.home.profileImage}
            alt="Profile"
            className={`w-48 h-48 rounded-full ${settings.theme.borderStyle} border-[rgb(var(--color-secondary))]`}
          />
        </div>
        <h1 className="text-4xl font-bold text-center text-[rgb(var(--color-primary))] mb-4 animate-bounce">
          Gizmeli Kedi
          <Stars className="inline-block ml-2 text-[rgb(var(--color-accent))]" aria-hidden="true" />
        </h1>
        <div className="text-center">
          <p className="text-xl mb-2 font-comic text-[rgb(var(--color-primary))]">
            <Briefcase className="inline-block mr-2 text-[rgb(var(--color-primary))]" size={ICON_SIZE.MEDIUM} aria-hidden="true" />
            {settings.content.home.jobTitle}
          </p>
          <p className="text-lg mb-4 font-comic">
            <Sparkles className="inline-block mr-2 text-[rgb(var(--color-accent))]" size={ICON_SIZE.MEDIUM} aria-hidden="true" />
            {settings.content.home.bio}
            <Sparkles className="inline-block ml-2 text-[rgb(var(--color-accent))]" size={ICON_SIZE.MEDIUM} aria-hidden="true" />
          </p>
        </div>
      </div>

      {/* Professional Overview */}
      <div className={`bg-pink-100 ${settings.theme.borderStyle} border-[rgb(var(--color-primary))] rounded-lg p-6 mb-8 shadow-lg relative`}>
        <div className="absolute bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2" aria-hidden="true">
          <Flower2 className="w-12 h-12 text-[rgb(var(--color-accent))]" />
        </div>
        <div className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2" aria-hidden="true">
          <Flower className="w-12 h-12 text-[rgb(var(--color-secondary))]" />
        </div>
        <h2 className="text-3xl font-bold text-center text-[rgb(var(--color-primary))] mb-4">
          What I Do
          <Heart className="inline-block ml-2 text-red-500" aria-hidden="true" />
        </h2>
        <div className="space-y-4 text-lg">
          <p className="text-center">
            As a Planning Specialist, I bring order to chaos and transform complex challenges into actionable strategies.
          </p>
          <p className="text-center">
            With a keen eye for detail and a passion for organization, I help teams and projects reach their full potential.
          </p>
        </div>
      </div>
    </>
  );
}

export default Home;