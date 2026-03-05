import { useState } from 'react';
import { Save, Eye, Edit3 } from 'lucide-react';
import type { IconName } from '../../store/blogStore';
import { FormInput, FormTextarea, FormSelect } from '../forms';
import { renderMarkdown } from '../../utils/markdown';

interface PostEditorFormData {
    title: string;
    excerpt: string;
    content: string;
    icon: IconName;
    tags: string;
    status: string;
    publishedAt: string;
    coverImage: string;
    featured: boolean;
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
    const [showPreview, setShowPreview] = useState(false);

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
                    placeholder="Cover image URL or /images/filename.jpg"
                    value={formData.coverImage}
                    onChange={(e) => handleChange('coverImage', e.target.value)}
                />
                <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => handleChange('featured', e.target.checked)}
                        className="w-4 h-4 text-purple-600 border-purple-300 rounded focus:ring-purple-500"
                    />
                    Featured post (pinned to top of blog listing)
                </label>
                <FormTextarea
                    placeholder="Excerpt"
                    value={formData.excerpt}
                    onChange={(e) => handleChange('excerpt', e.target.value)}
                    rows={3}
                />
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Content</span>
                        <button
                            type="button"
                            onClick={() => setShowPreview(!showPreview)}
                            className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700"
                        >
                            {showPreview ? (
                                <><Edit3 size={14} /> Edit</>
                            ) : (
                                <><Eye size={14} /> Preview</>
                            )}
                        </button>
                    </div>
                    {showPreview ? (
                        <div
                            className="prose prose-purple max-w-none p-4 border-2 border-purple-200 rounded-lg bg-white min-h-[200px]"
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(formData.content) }}
                        />
                    ) : (
                        <FormTextarea
                            placeholder="Content (markdown supported)"
                            value={formData.content}
                            onChange={(e) => handleChange('content', e.target.value)}
                            rows={10}
                        />
                    )}
                </div>
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
