import { Save } from 'lucide-react';
import { FormInput, FormTextarea } from '../forms';

interface SettingsData {
    title: string;
    description: string;
    seo: {
        siteUrl: string;
        defaultOgImage: string;
        twitterHandle: string;
    };
    social: {
        twitter: string;
        linkedin: string;
        github: string;
    };
    author: {
        name: string;
        role: string;
        bio: string;
        avatar: string;
    };
}

interface PasswordForm {
    current: string;
    next: string;
    confirm: string;
}

interface PasswordMessage {
    type: 'error' | 'success';
    text: string;
}

interface SiteSettingsProps {
    settingsData: SettingsData;
    onSettingsChange: (data: SettingsData) => void;
    onSaveSettings: () => void;
    passwordForm: PasswordForm;
    onPasswordChange: (form: PasswordForm) => void;
    onUpdatePassword: () => void;
    passwordMessage: PasswordMessage | null;
    hasExistingPassword: boolean;
}

export function SiteSettings({
    settingsData,
    onSettingsChange,
    onSaveSettings,
    passwordForm,
    onPasswordChange,
    onUpdatePassword,
    passwordMessage,
    hasExistingPassword,
}: SiteSettingsProps) {
    const updateSeo = (field: keyof SettingsData['seo'], value: string) => {
        onSettingsChange({
            ...settingsData,
            seo: { ...settingsData.seo, [field]: value },
        });
    };

    const updateSocial = (field: keyof SettingsData['social'], value: string) => {
        onSettingsChange({
            ...settingsData,
            social: { ...settingsData.social, [field]: value },
        });
    };

    const updateAuthor = (field: keyof SettingsData['author'], value: string) => {
        onSettingsChange({
            ...settingsData,
            author: { ...settingsData.author, [field]: value },
        });
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-purple-600 mb-6">Website Settings</h2>
            <div className="space-y-6">
                {/* Site Basics */}
                <div className="bg-purple-50 border-2 border-purple-100 rounded-lg p-4 space-y-4">
                    <h3 className="text-lg font-bold text-purple-600">Site Basics</h3>
                    <FormInput
                        label="Website Title"
                        value={settingsData.title}
                        onChange={(e) => onSettingsChange({ ...settingsData, title: e.target.value })}
                    />
                    <FormTextarea
                        label="Website Description"
                        value={settingsData.description}
                        onChange={(e) => onSettingsChange({ ...settingsData, description: e.target.value })}
                        rows={3}
                    />
                </div>

                {/* SEO & Metadata */}
                <div className="bg-purple-50 border-2 border-purple-100 rounded-lg p-4 space-y-4">
                    <h3 className="text-lg font-bold text-purple-600">SEO & Metadata</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                            label="Site URL"
                            type="url"
                            value={settingsData.seo.siteUrl}
                            onChange={(e) => updateSeo('siteUrl', e.target.value)}
                            placeholder="https://yourdomain.com"
                        />
                        <FormInput
                            label="Default OG Image URL"
                            type="url"
                            value={settingsData.seo.defaultOgImage}
                            onChange={(e) => updateSeo('defaultOgImage', e.target.value)}
                            placeholder="https://..."
                        />
                    </div>
                    <FormInput
                        label="Twitter Handle"
                        value={settingsData.seo.twitterHandle}
                        onChange={(e) => updateSeo('twitterHandle', e.target.value)}
                        placeholder="@yourhandle"
                    />
                </div>

                {/* Social Links */}
                <div className="bg-purple-50 border-2 border-purple-100 rounded-lg p-4 space-y-4">
                    <h3 className="text-lg font-bold text-purple-600">Social Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                            id="social-twitter"
                            label="Twitter"
                            type="url"
                            value={settingsData.social.twitter}
                            onChange={(e) => updateSocial('twitter', e.target.value)}
                            placeholder="Twitter URL"
                        />
                        <FormInput
                            id="social-linkedin"
                            label="LinkedIn"
                            type="url"
                            value={settingsData.social.linkedin}
                            onChange={(e) => updateSocial('linkedin', e.target.value)}
                            placeholder="LinkedIn URL"
                        />
                        <FormInput
                            id="social-github"
                            label="GitHub"
                            type="url"
                            value={settingsData.social.github}
                            onChange={(e) => updateSocial('github', e.target.value)}
                            placeholder="GitHub URL"
                        />
                    </div>
                </div>

                {/* Author Profile */}
                <div className="bg-purple-50 border-2 border-purple-100 rounded-lg p-4 space-y-4">
                    <h3 className="text-lg font-bold text-purple-600">Author Profile</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                            id="author-name"
                            label="Name"
                            value={settingsData.author.name}
                            onChange={(e) => updateAuthor('name', e.target.value)}
                            placeholder="Author name"
                        />
                        <FormInput
                            id="author-role"
                            label="Role"
                            value={settingsData.author.role}
                            onChange={(e) => updateAuthor('role', e.target.value)}
                            placeholder="Role / Title"
                        />
                    </div>
                    <FormTextarea
                        id="author-bio"
                        label="Bio"
                        value={settingsData.author.bio}
                        onChange={(e) => updateAuthor('bio', e.target.value)}
                        rows={3}
                        placeholder="Short bio"
                    />
                    <FormInput
                        id="author-avatar"
                        label="Avatar URL"
                        type="url"
                        value={settingsData.author.avatar}
                        onChange={(e) => updateAuthor('avatar', e.target.value)}
                        placeholder="Avatar image URL"
                    />
                </div>

                {/* Admin Security */}
                <div className="bg-purple-50 border-2 border-purple-100 rounded-lg p-4 space-y-4">
                    <h3 className="text-lg font-bold text-purple-600">Admin Security</h3>
                    {passwordMessage && (
                        <div
                            className={`border px-3 py-2 rounded text-sm ${passwordMessage.type === 'error'
                                ? 'bg-red-50 border-red-200 text-red-700'
                                : 'bg-green-50 border-green-200 text-green-700'
                                }`}
                        >
                            {passwordMessage.text}
                        </div>
                    )}
                    {hasExistingPassword && (
                        <FormInput
                            label="Current Password"
                            type="password"
                            value={passwordForm.current}
                            onChange={(e) => onPasswordChange({ ...passwordForm, current: e.target.value })}
                            placeholder="Enter current password"
                        />
                    )}
                    <FormInput
                        label="New Password"
                        type="password"
                        value={passwordForm.next}
                        onChange={(e) => onPasswordChange({ ...passwordForm, next: e.target.value })}
                        placeholder="Create a strong password"
                    />
                    <FormInput
                        label="Confirm New Password"
                        type="password"
                        value={passwordForm.confirm}
                        onChange={(e) => onPasswordChange({ ...passwordForm, confirm: e.target.value })}
                        placeholder="Re-enter new password"
                    />
                    <p className="text-xs text-gray-500">
                        🔒 Minimum 10 characters with letters and numbers. Passwords are hashed (PBKDF2 + salt).
                    </p>
                    <div className="flex justify-end">
                        <button
                            onClick={onUpdatePassword}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300"
                        >
                            <Save size={20} />
                            Update Password
                        </button>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={onSaveSettings}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
                    >
                        <Save size={20} />
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
}
