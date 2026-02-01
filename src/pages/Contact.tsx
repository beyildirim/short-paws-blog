import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { formRateLimiter } from '../utils/crypto';
import { useSettingsStore } from '../store/settingsStore';

function Contact() {
  const [formStatus, setFormStatus] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { settings } = useSettingsStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('');
    setIsError(false);
    
    // Rate limiting
    if (!formRateLimiter.canAttempt('contact-form')) {
      setFormStatus('Please wait before sending another message.');
      setIsError(true);
      return;
    }
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;
    
    if (!name.trim() || !email.trim() || !message.trim()) {
      setFormStatus('Please fill in all fields.');
      setIsError(true);
      return;
    }
    
    setIsSubmitting(true);
    const form = e.currentTarget;
    
    // Simulate sending (in real app, this would be an API call)
    setTimeout(() => {
      setFormStatus('Message sent! Thank you for reaching out! 💌');
      setIsError(false);
      setIsSubmitting(false);
      form.reset();
    }, 1000);
  };

  return (
    <>
      <Helmet>
        <title>Contact | {settings.title}</title>
        <meta name="description" content="Get in touch with Gizmeli Kedi" />
      </Helmet>
      
      <div className="space-y-8">
      <div className="bg-white border-4 border-pink-500 rounded-lg p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-purple-600 mb-6 text-center">
          Get in Touch
          <Mail className="inline-block ml-2 text-blue-500" />
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="text-purple-500" aria-hidden="true" />
              <a href={`mailto:${settings.content.contact.email}`} className="text-gray-700 hover:text-purple-600 transition-colors">
                {settings.content.contact.email}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-purple-500" aria-hidden="true" />
              <a href={`tel:${settings.content.contact.phone.replace(/[^0-9+]/g, '')}`} className="text-gray-700 hover:text-purple-600 transition-colors">
                {settings.content.contact.phone}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="text-purple-500" aria-hidden="true" />
              <span className="text-gray-700">{settings.content.contact.address}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-1 block w-full rounded-md border-2 border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:outline-none"
                required
                minLength={2}
                maxLength={100}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full rounded-md border-2 border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:outline-none"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message *</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="mt-1 block w-full rounded-md border-2 border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:outline-none"
                required
                minLength={10}
                maxLength={1000}
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} aria-hidden="true" />
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
        
        {formStatus && (
          <div className={`text-center font-comic p-4 rounded-lg ${isError ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600 animate-bounce'}`}>
            {formStatus}
          </div>
        )}
      </div>

      <div className="bg-pink-100 border-4 border-purple-400 rounded-lg p-8 shadow-lg text-center">
        <h3 className="text-2xl font-bold text-purple-600 mb-4">Office Hours</h3>
        <p className="text-gray-700 whitespace-pre-line">
          {settings.content.contact.officeHours}
        </p>
        <p className="mt-4 text-purple-600 font-comic">
          ✨ Let's create amazing plans together! ✨
        </p>
      </div>
    </div>
    </>
  );
}

export default Contact;
