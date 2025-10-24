import { Share2, Twitter, Linkedin, Facebook, Link as LinkIcon } from 'lucide-react';
import { SOCIAL_SHARE } from '../constants';
import { copyToClipboard, getCurrentUrl } from '../utils/helpers';
import { useState } from 'react';

interface SocialShareProps {
  title: string;
  description?: string;
  url?: string;
}

export function SocialShare({ title, description, url }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || getCurrentUrl();
  const shareText = description || title;

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = (platform: 'twitter' | 'linkedin' | 'facebook') => {
    let shareLink = '';
    
    switch (platform) {
      case 'twitter':
        shareLink = SOCIAL_SHARE.TWITTER(shareUrl, shareText);
        break;
      case 'linkedin':
        shareLink = SOCIAL_SHARE.LINKEDIN(shareUrl);
        break;
      case 'facebook':
        shareLink = SOCIAL_SHARE.FACEBOOK(shareUrl);
        break;
    }
    
    window.open(shareLink, '_blank', 'width=600,height=400');
  };

  return (
    <div className="flex items-center gap-3">
      <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Share2 size={16} />
        Share:
      </span>
      
      <button
        onClick={() => handleShare('twitter')}
        className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors duration-300"
        aria-label="Share on Twitter"
      >
        <Twitter size={18} />
      </button>
      
      <button
        onClick={() => handleShare('linkedin')}
        className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-300"
        aria-label="Share on LinkedIn"
      >
        <Linkedin size={18} />
      </button>
      
      <button
        onClick={() => handleShare('facebook')}
        className="p-2 rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors duration-300"
        aria-label="Share on Facebook"
      >
        <Facebook size={18} />
      </button>
      
      <button
        onClick={handleCopyLink}
        className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors duration-300 relative"
        aria-label="Copy link"
      >
        <LinkIcon size={18} />
        {copied && (
          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            Copied!
          </span>
        )}
      </button>
    </div>
  );
}
