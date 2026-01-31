import { Mail, User } from 'lucide-react';

interface AuthorCardProps {
  name: string;
  role?: string;
  bio?: string;
  image?: string;
  email?: string;
}

export function AuthorCard({ name, role, bio, image, email }: AuthorCardProps) {
  return (
    <div className="bg-white border-2 border-purple-200 rounded-lg p-6 shadow-md flex flex-col md:flex-row gap-4 items-center">
      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-purple-300 flex items-center justify-center bg-purple-50">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <User className="text-purple-500" size={32} aria-hidden="true" />
        )}
      </div>
      <div className="flex-1 text-center md:text-left">
        <h4 className="text-lg font-bold text-purple-700">{name}</h4>
        {role && <p className="text-sm text-gray-600">{role}</p>}
        {bio && <p className="text-sm text-gray-700 mt-2">{bio}</p>}
      </div>
      {email && (
        <a
          href={`mailto:${email}`}
          className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700"
        >
          <Mail size={16} aria-hidden="true" />
          Contact
        </a>
      )}
    </div>
  );
}
