import { Briefcase, Heart, Trophy, Target, Coffee } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useSettingsStore } from '../store/settingsStore';

function About() {
  const { settings } = useSettingsStore();
  
  return (
    <>
      <Helmet>
        <title>About | {settings.title}</title>
        <meta name="description" content={settings.content.about.professionalJourney} />
      </Helmet>
      
      <div className="space-y-8">
      <div className="bg-white border-4 border-pink-500 rounded-lg p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-purple-600 mb-6 text-center">
          {settings.content.about.title}
          <Briefcase className="inline-block ml-2 text-blue-500" aria-hidden="true" />
        </h2>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Trophy className="text-yellow-500 flex-shrink-0 mt-1" aria-hidden="true" />
            <div>
              <h3 className="text-xl font-bold text-purple-600">{settings.content.home.jobTitle}</h3>
              <p className="text-gray-700">
                {settings.content.about.professionalJourney}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Target className="text-red-500 flex-shrink-0 mt-1" aria-hidden="true" />
            <div>
              <h3 className="text-xl font-bold text-purple-600">Key Skills</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {settings.content.about.skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>


      <div className="bg-pink-100 border-4 border-blue-400 rounded-lg p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-purple-600 mb-6 text-center">
          Work Philosophy
          <Coffee className="inline-block ml-2 text-amber-600" aria-hidden="true" />
        </h2>
        <div className="text-center space-y-4 text-gray-700">
          <p className="text-lg">
            {settings.content.about.workPhilosophy}
          </p>
          <div className="mt-6">
            <Heart className="inline-block text-red-500 animate-pulse" size={32} aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default About;