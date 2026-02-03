import { Save, Home, User, Phone } from 'lucide-react';
import { FormInput, FormTextarea } from '../forms';

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

interface PagesSettingsProps {
    content: PageContent;
    onChange: (content: PageContent) => void;
    onSave: (page: 'home' | 'about' | 'contact') => void;
}

export function PagesSettings({ content, onChange, onSave }: PagesSettingsProps) {
    const updateHome = (field: keyof PageContent['home'], value: string) => {
        onChange({
            ...content,
            home: { ...content.home, [field]: value },
        });
    };

    const updateAbout = (field: keyof PageContent['about'], value: string | string[]) => {
        onChange({
            ...content,
            about: { ...content.about, [field]: value },
        });
    };

    const updateContact = (field: keyof PageContent['contact'], value: string) => {
        onChange({
            ...content,
            contact: { ...content.contact, [field]: value },
        });
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-purple-600 mb-6">Page Content</h2>
            <div className="space-y-8">
                {/* Home Page */}
                <div className="border-b pb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Home size={20} className="text-purple-600" />
                        <h3 className="text-xl font-bold text-purple-600">Home Page</h3>
                    </div>
                    <div className="space-y-4">
                        <FormInput
                            label="Welcome Text"
                            value={content.home.welcomeText}
                            onChange={(e) => updateHome('welcomeText', e.target.value)}
                        />
                        <FormInput
                            label="Profile Image URL"
                            value={content.home.profileImage}
                            onChange={(e) => updateHome('profileImage', e.target.value)}
                        />
                        <FormInput
                            label="Job Title"
                            value={content.home.jobTitle}
                            onChange={(e) => updateHome('jobTitle', e.target.value)}
                        />
                        <FormTextarea
                            label="Bio"
                            value={content.home.bio}
                            onChange={(e) => updateHome('bio', e.target.value)}
                            rows={3}
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={() => onSave('home')}
                                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
                            >
                                <Save size={20} />
                                Save Home Page
                            </button>
                        </div>
                    </div>
                </div>

                {/* About Page */}
                <div className="border-b pb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <User size={20} className="text-purple-600" />
                        <h3 className="text-xl font-bold text-purple-600">About Page</h3>
                    </div>
                    <div className="space-y-4">
                        <FormInput
                            label="Title"
                            value={content.about.title}
                            onChange={(e) => updateAbout('title', e.target.value)}
                        />
                        <FormTextarea
                            label="Professional Journey"
                            value={content.about.professionalJourney}
                            onChange={(e) => updateAbout('professionalJourney', e.target.value)}
                            rows={4}
                        />
                        <FormTextarea
                            label="Skills (one per line)"
                            value={content.about.skills.join('\n')}
                            onChange={(e) => updateAbout('skills', e.target.value.split('\n').filter(s => s.trim()))}
                            rows={4}
                        />
                        <FormTextarea
                            label="Work Philosophy"
                            value={content.about.workPhilosophy}
                            onChange={(e) => updateAbout('workPhilosophy', e.target.value)}
                            rows={3}
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={() => onSave('about')}
                                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
                            >
                                <Save size={20} />
                                Save About Page
                            </button>
                        </div>
                    </div>
                </div>

                {/* Contact Page */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Phone size={20} className="text-purple-600" />
                        <h3 className="text-xl font-bold text-purple-600">Contact Page</h3>
                    </div>
                    <div className="space-y-4">
                        <FormInput
                            label="Email"
                            type="email"
                            value={content.contact.email}
                            onChange={(e) => updateContact('email', e.target.value)}
                        />
                        <FormInput
                            label="Phone"
                            value={content.contact.phone}
                            onChange={(e) => updateContact('phone', e.target.value)}
                        />
                        <FormInput
                            label="Address"
                            value={content.contact.address}
                            onChange={(e) => updateContact('address', e.target.value)}
                        />
                        <FormTextarea
                            label="Office Hours"
                            value={content.contact.officeHours}
                            onChange={(e) => updateContact('officeHours', e.target.value)}
                            rows={3}
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={() => onSave('contact')}
                                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
                            >
                                <Save size={20} />
                                Save Contact Page
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
