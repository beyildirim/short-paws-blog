import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PenSquare, 
  Trash2, 
  LogOut, 
  Plus, 
  Save, 
  Settings as SettingsIcon,
  Palette,
  Layout,
  FileText,
  Home,
  User,
  Phone
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useBlogStore, BlogPost } from '../../store/blogStore';
import { useSettingsStore } from '../../store/settingsStore';

export default function Dashboard() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const { posts, addPost, editPost, deletePost } = useBlogStore();
  const { settings, updateSettings, updateTheme, updatePageContent } = useSettingsStore();
  
  const [activeTab, setActiveTab] = useState('posts');
  const [editing, setEditing] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    readTime: '',
    excerpt: '',
    content: '',
  });
  const [settingsData, setSettingsData] = useState({
    title: settings.title,
    description: settings.description,
    adminPassword: '',
  });
  const [themeData, setThemeData] = useState(settings.theme);
  const [pageContent, setPageContent] = useState(settings.content);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleEdit = (post: BlogPost) => {
    setEditing(post.id);
    setFormData({
      title: post.title,
      readTime: post.readTime,
      excerpt: post.excerpt,
      content: post.content,
    });
  };

  const handleSave = () => {
    if (editing) {
      editPost(editing, formData);
      setEditing(null);
    } else if (showAddForm) {
      addPost({
        ...formData,
        icon: 'Cat',
      });
      setShowAddForm(false);
    }
    setFormData({
      title: '',
      readTime: '',
      excerpt: '',
      content: '',
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(id);
    }
  };

  const handleSaveSettings = () => {
    const updatedSettings: any = {
      title: settingsData.title,
      description: settingsData.description,
    };
    
    if (settingsData.adminPassword) {
      updatedSettings.adminPassword = settingsData.adminPassword;
    }
    
    updateSettings(updatedSettings);
    alert('Settings updated successfully!');
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
          <div className="flex border-b border-purple-200">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex items-center gap-2 px-6 py-3 ${
                activeTab === 'posts' ? 'bg-purple-100 text-purple-600 font-bold' : 'text-gray-600'
              }`}
            >
              <FileText size={20} />
              Blog Posts
            </button>
            <button
              onClick={() => setActiveTab('theme')}
              className={`flex items-center gap-2 px-6 py-3 ${
                activeTab === 'theme' ? 'bg-purple-100 text-purple-600 font-bold' : 'text-gray-600'
              }`}
            >
              <Palette size={20} />
              Theme
            </button>
            <button
              onClick={() => setActiveTab('pages')}
              className={`flex items-center gap-2 px-6 py-3 ${
                activeTab === 'pages' ? 'bg-purple-100 text-purple-600 font-bold' : 'text-gray-600'
              }`}
            >
              <Layout size={20} />
              Pages
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-6 py-3 ${
                activeTab === 'settings' ? 'bg-purple-100 text-purple-600 font-bold' : 'text-gray-600'
              }`}
            >
              <SettingsIcon size={20} />
              Settings
            </button>
          </div>

          <div className="p-6">
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
                  <div className="mb-8 bg-purple-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-purple-600 mb-4">Add New Post</h3>
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full p-2 border rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Read Time (e.g., 5 min read)"
                        value={formData.readTime}
                        onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                        className="w-full p-2 border rounded-lg"
                      />
                      <textarea
                        placeholder="Excerpt"
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        className="w-full p-2 border rounded-lg"
                        rows={3}
                      />
                      <textarea
                        placeholder="Content"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="w-full p-2 border rounded-lg"
                        rows={6}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setShowAddForm(false)}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-300"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
                        >
                          <Save size={20} />
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {posts.map((post) => (
                    <div key={post.id} className="border rounded-lg p-4 hover:bg-purple-50">
                      {editing === post.id ? (
                        <div className="space-y-4">
                          <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-2 border rounded-lg"
                          />
                          <input
                            type="text"
                            value={formData.readTime}
                            onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                            className="w-full p-2 border rounded-lg"
                          />
                          <textarea
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            className="w-full p-2 border rounded-lg"
                            rows={3}
                          />
                          <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full p-2 border rounded-lg"
                            rows={6}
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setEditing(null)}
                              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-300"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleSave}
                              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
                            >
                              <Save size={20} />
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-bold text-purple-600">{post.title}</h3>
                              <p className="text-gray-600 text-sm">{post.date} • {post.readTime}</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(post)}
                                className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition-colors duration-300"
                              >
                                <PenSquare size={20} />
                              </button>
                              <button
                                onClick={() => handleDelete(post.id)}
                                className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors duration-300"
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

            {activeTab === 'theme' && (
              <div>
                <h2 className="text-2xl font-bold text-purple-600 mb-6">Theme Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Primary Color
                    </label>
                    <input
                      type="color"
                      value={themeData.primaryColor}
                      onChange={(e) => setThemeData({ ...themeData, primaryColor: e.target.value })}
                      className="w-full h-10 p-1 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Secondary Color
                    </label>
                    <input
                      type="color"
                      value={themeData.secondaryColor}
                      onChange={(e) => setThemeData({ ...themeData, secondaryColor: e.target.value })}
                      className="w-full h-10 p-1 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Accent Color
                    </label>
                    <input
                      type="color"
                      value={themeData.accentColor}
                      onChange={(e) => setThemeData({ ...themeData, accentColor: e.target.value })}
                      className="w-full h-10 p-1 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Font Family
                    </label>
                    <select
                      value={themeData.fontFamily}
                      onChange={(e) => setThemeData({ ...themeData, fontFamily: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="Comic">Comic</option>
                      <option value="sans-serif">Sans Serif</option>
                      <option value="serif">Serif</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Border Style
                    </label>
                    <select
                      value={themeData.borderStyle}
                      onChange={(e) => setThemeData({ ...themeData, borderStyle: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="border-4">Thick</option>
                      <option value="border-2">Medium</option>
                      <option value="border">Thin</option>
                    </select>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveTheme}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
                    >
                      <Save size={20} />
                      Save Theme
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pages' && (
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Welcome Text
                        </label>
                        <input
                          type="text"
                          value={pageContent.home.welcomeText}
                          onChange={(e) => setPageContent({
                            ...pageContent,
                            home: { ...pageContent.home, welcomeText: e.target.value }
                          })}
                          className="w-full p-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Profile Image URL
                        </label>
                        <input
                          type="text"
                          value={pageContent.home.profileImage}
                          onChange={(e) => setPageContent({
                            ...pageContent,
                            home: { ...pageContent.home, profileImage: e.target.value }
                          })}
                          className="w-full p-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Job Title
                        </label>
                        <input
                          type="text"
                          value={pageContent.home.jobTitle}
                          onChange={(e) => setPageContent({
                            ...pageContent,
                            home: { ...pageContent.home, jobTitle: e.target.value }
                          })}
                          className="w-full p-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bio
                        </label>
                        <textarea
                          value={pageContent.home.bio}
                          onChange={(e) => setPageContent({
                            ...pageContent,
                            home: { ...pageContent.home, bio: e.target.value }
                          })}
                          className="w-full p-2 border rounded-lg"
                          rows={3}
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleSavePageContent('home')}
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={pageContent.about.title}
                          onChange={(e) => setPageContent({
                            ...pageContent,
                            about: { ...pageContent.about, title: e.target.value }
                          })}
                          className="w-full p-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Professional Journey
                        </label>
                        <textarea
                          value={pageContent.about.professionalJourney}
                          onChange={(e) => setPageContent({
                            ...pageContent,
                            about: { ...pageContent.about, professionalJourney: e.target.value }
                          })}
                          className="w-full p-2 border rounded-lg"
                          rows={4}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Skills (one per line)
                        </label>
                        <textarea
                          value={pageContent.about.skills.join('\n')}
                          onChange={(e) => setPageContent({
                            ...pageContent,
                            about: { ...pageContent.about, skills: e.target.value.split('\n') }
                          })}
                          className="w-full p-2 border rounded-lg"
                          rows={4}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Work Philosophy
                        </label>
                        <textarea
                          value={pageContent.about.workPhilosophy}
                          onChange={(e) => setPageContent({
                            ...pageContent,
                            about: { ...pageContent.about, workPhilosophy: e.target.value }
                          })}
                          className="w-full p-2 border rounded-lg"
                          rows={3}
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleSavePageContent('about')}
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={pageContent.contact.email}
                          onChange={(e) => setPageContent({
                            ...pageContent,
                            contact: { ...pageContent.contact, email: e.target.value }
                          })}
                          className="w-full p-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="text"
                          value={pageContent.contact.phone}
                          onChange={(e) => setPageContent({
                            ...pageContent,
                            contact: { ...pageContent.contact, phone: e.target.value }
                          })}
                          className="w-full p-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <input
                          type="text"
                          value={pageContent.contact.address}
                          onChange={(e) => setPageContent({
                            ...pageContent,
                            contact: { ...pageContent.contact, address: e.target.value }
                          })}
                          className="w-full p-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Office Hours
                        </label>
                        <textarea
                          value={pageContent.contact.officeHours}
                          onChange={(e) => setPageContent({
                            ...pageContent,
                            contact: { ...pageContent.contact, officeHours: e.target.value }
                          })}
                          className="w-full p-2 border rounded-lg"
                          rows={3}
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleSavePageContent('contact')}
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
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold text-purple-600 mb-6">Website Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website Title
                    </label>
                    <input
                      type="text"
                      value={settingsData.title}
                      onChange={(e) => setSettingsData({ ...settingsData, title: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website Description
                    </label>
                    <textarea
                      value={settingsData.description}
                      onChange={(e) => setSettingsData({ ...settingsData, description: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Admin Password (leave blank to keep current)
                    </label>
                    <input
                      type="password"
                      value={settingsData.adminPassword}
                      onChange={(e) => setSettingsData({ ...settingsData, adminPassword: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveSettings}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
                    >
                      <Save size={20} />
                      Save Settings
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}