import { Save } from 'lucide-react';
import type { IconName } from '../../store/blogStore';
import { FormInput, FormTextarea, FormSelect } from '../forms';

interface PostEditorFormData {
    title: string;
    excerpt: string;
    content: string;
    icon: IconName;
    tags: string;
    status: string;
    publishedAt: string;
    coverImage: string;
}

interface PostEditorProps {
    formData: PostEditorFormData;
    onChange: (data: PostEditorFormData) => void;
    onSave: () => void;
    onCancel: () => void;
    isEditing?: boolean;
}

const statusOptions = [
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
    { value: 'scheduled', label: 'Scheduled' },
];

export function PostEditor({
    formData,
    onChange,
    onSave,
    onCancel,
    isEditing = false,
}: PostEditorProps) {
    const handleChange = <K extends keyof PostEditorFormData>(
        field: K,
        value: PostEditorFormData[K]
    ) => {
        onChange({ ...formData, [field]: value });
    };

    return (
        <div className={`${isEditing ? '' : 'mb-8 bg-purple-50 p-6 rounded-lg'}`}>
            {!isEditing && (
                <h3 className="text-xl font-bold text-purple-600 mb-4">Add New Post</h3>
            )}
            <div className="space-y-4">
                <FormInput
                    placeholder="Title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                />
                <FormInput
                    placeholder="Tags (comma-separated)"
                    value={formData.tags}
                    onChange={(e) => handleChange('tags', e.target.value)}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormSelect
                        value={formData.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                        options={statusOptions}
                    />
                    <FormInput
                        type="date"
                        value={formData.publishedAt}
                        onChange={(e) => handleChange('publishedAt', e.target.value)}
                    />
                </div>
                <FormInput
                    type="url"
                    placeholder="Cover image URL (optional)"
                    value={formData.coverImage}
                    onChange={(e) => handleChange('coverImage', e.target.value)}
                />
                <FormTextarea
                    placeholder="Excerpt"
                    value={formData.excerpt}
                    onChange={(e) => handleChange('excerpt', e.target.value)}
                    rows={3}
                />
                <FormTextarea
                    placeholder="Content"
                    value={formData.content}
                    onChange={(e) => handleChange('content', e.target.value)}
                    rows={6}
                />
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSave}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
                    >
                        <Save size={20} />
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

export type { PostEditorFormData };
