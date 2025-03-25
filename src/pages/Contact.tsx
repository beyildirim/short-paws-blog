import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

function Contact() {
  const [formStatus, setFormStatus] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('Message sent! Thank you for reaching out! 💌');
  };

  return (
    <div className="space-y-8">
      <div className="bg-white border-4 border-pink-500 rounded-lg p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-purple-600 mb-6 text-center">
          Get in Touch
          <Mail className="inline-block ml-2 text-blue-500" />
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="text-purple-500" />
              <span className="text-gray-700">gizmelikedi@example.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-purple-500" />
              <span className="text-gray-700">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="text-purple-500" />
              <span className="text-gray-700">Planning Department, Dream Corp</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                id="message"
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <Send size={20} />
              Send Message
            </button>
          </form>
        </div>
        
        {formStatus && (
          <div className="text-center text-green-600 font-comic animate-bounce">
            {formStatus}
          </div>
        )}
      </div>

      <div className="bg-pink-100 border-4 border-purple-400 rounded-lg p-8 shadow-lg text-center">
        <h3 className="text-2xl font-bold text-purple-600 mb-4">Office Hours</h3>
        <p className="text-gray-700">
          Monday - Friday: 9:00 AM - 5:00 PM<br />
          Weekend: By appointment only
        </p>
        <p className="mt-4 text-purple-600 font-comic">
          ✨ Let's create amazing plans together! ✨
        </p>
      </div>
    </div>
  );
}

export default Contact;