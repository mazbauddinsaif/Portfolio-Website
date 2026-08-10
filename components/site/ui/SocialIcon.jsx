import { FiGithub, FiLinkedin, FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiGlobe, FiMail } from 'react-icons/fi';

/* The CMS stores ionicon names ("logo-github"); map them onto Feather icons. */
export default function SocialIcon({ name, size = 16 }) {
  const key = (name || '').toLowerCase();
  if (key.includes('github')) return <FiGithub size={size} />;
  if (key.includes('linkedin')) return <FiLinkedin size={size} />;
  if (key.includes('facebook')) return <FiFacebook size={size} />;
  if (key.includes('twitter') || key.includes('x-')) return <FiTwitter size={size} />;
  if (key.includes('instagram')) return <FiInstagram size={size} />;
  if (key.includes('youtube')) return <FiYoutube size={size} />;
  if (key.includes('mail')) return <FiMail size={size} />;
  return <FiGlobe size={size} />;
}
