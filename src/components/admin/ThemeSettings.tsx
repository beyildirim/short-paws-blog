import { Save } from 'lucide-react';
import { FormSelect } from '../forms';

interface ThemeData {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
    borderStyle: string;
}

interface ThemeSettingsProps {
    themeData: ThemeData;
    onChange: (data: ThemeData) => void;
    onSave: () => void;
}

const fontOptions = [
    { value: 'Comic', label: 'Comic' },
    { value: 'sans-serif', label: 'Sans Serif' },
    { value: 'serif', label: 'Serif' },
];

const borderOptions = [
    { value: 'border-4', label: 'Thick' },
    { value: 'border-2', label: 'Medium' },
    { value: 'border', label: 'Thin' },
];

export function ThemeSettings({ themeData, onChange, onSave }: ThemeSettingsProps) {
    const handleChange = <K extends keyof ThemeData>(field: K, value: ThemeData[K]) => {
        onChange({ ...themeData, [field]: value });
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-purple-600 mb-6">Theme Settings</h2>
            <div className="space-y-4">
                <div>
                    <label htmlFor="theme-primary-color" className="block text-sm font-medium text-gray-700 mb-1">
                        Primary Color
                    </label>
                    <input
                        id="theme-primary-color"
                        type="color"
                        value={themeData.primaryColor}
                        onChange={(e) => handleChange('primaryColor', e.target.value)}
                        className="w-full h-10 p-1 rounded-lg border border-gray-300"
                    />
                </div>
                <div>
                    <label htmlFor="theme-secondary-color" className="block text-sm font-medium text-gray-700 mb-1">
                        Secondary Color
                    </label>
                    <input
                        id="theme-secondary-color"
                        type="color"
                        value={themeData.secondaryColor}
                        onChange={(e) => handleChange('secondaryColor', e.target.value)}
                        className="w-full h-10 p-1 rounded-lg border border-gray-300"
                    />
                </div>
                <div>
                    <label htmlFor="theme-accent-color" className="block text-sm font-medium text-gray-700 mb-1">
                        Accent Color
                    </label>
                    <input
                        id="theme-accent-color"
                        type="color"
                        value={themeData.accentColor}
                        onChange={(e) => handleChange('accentColor', e.target.value)}
                        className="w-full h-10 p-1 rounded-lg border border-gray-300"
                    />
                </div>
                <FormSelect
                    label="Font Family"
                    value={themeData.fontFamily}
                    onChange={(e) => handleChange('fontFamily', e.target.value)}
                    options={fontOptions}
                />
                <FormSelect
                    label="Border Style"
                    value={themeData.borderStyle}
                    onChange={(e) => handleChange('borderStyle', e.target.value)}
                    options={borderOptions}
                />
                <div className="flex justify-end">
                    <button
                        onClick={onSave}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
                    >
                        <Save size={20} />
                        Save Theme
                    </button>
                </div>
            </div>
        </div>
    );
}
