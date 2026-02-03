import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PenSquare,
  Trash2,
  LogOut,
  Plus,
  Settings as SettingsIcon,
  Palette,
  Layout,
  FileText,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useBlogStore, BlogPost, IconName } from '../../store/blogStore';
import { useSettingsStore } from '../../store/settingsStore';
import { hashPassword, validatePassword, verifyPassword } from '../../utils/crypto';
import { formatDate } from '../../utils/helpers';
import { ROUTES } from '../../constants';
import {
  PostEditor,
  ThemeSettings,
  PagesSettings,
  SiteSettings,
  type PostEditorFormData,
} from '../../components/admin';

type TabType = 'posts' | 'theme' | 'pages' | 'settings';

const tabItems: { id: TabType; icon: typeof FileText; label: string }[] = [
  { id: 'posts', icon: FileText, label: 'Blog Posts' },
  { id: 'theme', icon: Palette, label: 'Theme' },
  { id: 'pages', icon: Layout, label: 'Pages' },
  { id: 'settings', icon: SettingsIcon, label: 'Settings' },
];

const emptyFormData: PostEditorFormData = {
  title: '',
  excerpt: '',
  content: '',
  icon: 'cat' as IconName,
  tags: '',
  status: 'published',
  publishedAt: '',
  coverImage: '',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const { posts, addPost, editPost, deletePost } = useBlogStore();
  const { settings, updateSettings, updateTheme, updatePageContent } = useSettingsStore();

  const [activeTab, setActiveTab] = useState<TabType>('posts');
  const [editing, setEditing] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<PostEditorFormData>(emptyFormData);
  const [settingsData, setSettingsData] = useState({
    title: settings.title,
    description: settings.description,
    seo: { ...settings.seo },
    social: { ...settings.social },
    author: { ...settings.author },
  });
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    next: '',
    confirm: '',
  });
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [themeData, setThemeData] = useState(settings.theme);
  const [pageContent, setPageContent] = useState(settings.content);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.ADMIN_LOGIN);
  };

  const handleEdit = (post: BlogPost) => {
    setEditing(post.id);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      icon: post.icon,
      tags: post.tags?.join(', ') ?? '',
      status: post.status,
      publishedAt: post.publishedAt ? post.publishedAt.slice(0, 10) : '',
      coverImage: post.coverImage ?? '',
    });
  };

  const handleSave = () => {
    const tags = formData.tags
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);
    const publishedAt = formData.publishedAt
      ? new Date(formData.publishedAt).toISOString()
      : new Date().toISOString();
    const payload: Omit<BlogPost, 'id' | 'source'> = {
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      icon: formData.icon,
      tags,
      status: formData.status as BlogPost['status'],
      publishedAt,
      coverImage: formData.coverImage || undefined,
    };

    if (editing) {
      editPost(editing, payload);
      setEditing(null);
    } else if (showAddForm) {
      addPost(payload);
      setShowAddForm(false);
    }
    setFormData(emptyFormData);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(id);
    }
  };

  const handleSaveSettings = async () => {
    const updatedSettings: Partial<typeof settings> = {
      title: settingsData.title,
      description: settingsData.description,
      seo: settingsData.seo,
      social: settingsData.social,
      author: settingsData.author,
    };

    updateSettings(updatedSettings);
    alert('Settings updated successfully!');
  };

  const handleChangePassword = async () => {
    setPasswordMessage(null);

    if (settings.adminPassword) {
      if (!passwordForm.current) {
        setPasswordMessage({ type: 'error', text: 'Enter your current password.' });
        return;
      }
      const currentCheck = await verifyPassword(passwordForm.current, settings.adminPassword);
      if (!currentCheck.valid) {
        setPasswordMessage({ type: 'error', text: 'Current password is incorrect.' });
        return;
      }
    }

    if (!passwordForm.next || !passwordForm.confirm) {
      setPasswordMessage({ type: 'error', text: 'Enter and confirm your new password.' });
      return;
    }

    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    const validation = validatePassword(passwordForm.next);
    if (!validation.valid) {
      setPasswordMessage({ type: 'error', text: validation.message });
      return;
    }

    const newHash = await hashPassword(passwordForm.next);
    updateSettings({ adminPassword: newHash });
    setPasswordForm({ current: '', next: '', confirm: '' });
    setPasswordMessage({ type: 'success', text: 'Password updated. Please log in again.' });
    logout();
    navigate(ROUTES.ADMIN_LOGIN, { state: { reason: 'password-updated' } });
  };

  const handleSaveTheme = () => {
    updateTheme(themeData);
    alert('Theme settings updated successfully!');
  };

  const handleSavePageContent = (page: 'home' | 'about' | 'contact') => {
    updatePageContent(page, pageContent[page]);
    alert(`${page.charAt(0).toUpperCase() + page.slice(1)} page content updated successfully!`);
  };

  return (
    <div className="min-h-screen bg-purple-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-purple-600">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg border-4 border-purple-500 overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-purple-200">
            {tabItems.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-6 py-3 ${activeTab === id ? 'bg-purple-100 text-purple-600 font-bold' : 'text-gray-600'
                  }`}
              >
                <Icon size={20} />
                {label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Posts Tab */}
            {activeTab === 'posts' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-purple-600">Blog Posts</h2>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300"
                  >
                    <Plus size={20} />
                    Add New Post
                  </button>
                </div>

                {showAddForm && (
                  <PostEditor
                    formData={formData}
                    onChange={setFormData}
                    onSave={handleSave}
                    onCancel={() => setShowAddForm(false)}
                  />
                )}

                <div className="space-y-4">
                  {posts.map((post) => (
                    <div key={post.id} className="border rounded-lg p-4 hover:bg-purple-50">
                      {editing === post.id ? (
                        <PostEditor
                          formData={formData}
                          onChange={setFormData}
                          onSave={handleSave}
                          onCancel={() => setEditing(null)}
                          isEditing
                        />
                      ) : (
                        <div>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-bold text-purple-600">{post.title}</h3>
                              <p className="text-gray-600 text-sm">
                                {formatDate(post.publishedAt)} • {post.readTime} • {post.status}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(post)}
                                className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition-colors duration-300"
                                aria-label="Edit post"
                              >
                                <PenSquare size={20} />
                              </button>
                              <button
                                onClick={() => handleDelete(post.id)}
                                className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors duration-300"
                                aria-label="Delete post"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                          </div>
                          <p className="text-gray-700 mt-2">{post.excerpt}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Theme Tab */}
            {activeTab === 'theme' && (
              <ThemeSettings
                themeData={themeData}
                onChange={setThemeData}
                onSave={handleSaveTheme}
              />
            )}

            {/* Pages Tab */}
            {activeTab === 'pages' && (
              <PagesSettings
                content={pageContent}
                onChange={setPageContent}
                onSave={handleSavePageContent}
              />
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <SiteSettings
                settingsData={settingsData}
                onSettingsChange={setSettingsData}
                onSaveSettings={handleSaveSettings}
                passwordForm={passwordForm}
                onPasswordChange={setPasswordForm}
                onUpdatePassword={handleChangePassword}
                passwordMessage={passwordMessage}
                hasExistingPassword={!!settings.adminPassword}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
