/* The CMS stores a tiny subset of HTML in text fields. Parse it into real
   elements instead of using dangerouslySetInnerHTML. */
const TOKEN = /(<strong>[\s\S]*?<\/strong>|<em>[\s\S]*?<\/em>|<u>[\s\S]*?<\/u>|<p>[\s\S]*?<\/p>|<br\s*\/?>)/g;

export function parseRichText(text, keyPrefix = 'r') {
  if (!text) return null;

  return text.split(TOKEN).map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith('<strong>') && part.endsWith('</strong>'))
      return <strong key={key} className="font-semibold text-ink">{parseRichText(part.slice(8, -9), key)}</strong>;
    if (part.startsWith('<em>') && part.endsWith('</em>'))
      return <em key={key}>{parseRichText(part.slice(4, -5), key)}</em>;
    if (part.startsWith('<u>') && part.endsWith('</u>'))
      return <u key={key}>{parseRichText(part.slice(3, -4), key)}</u>;
    if (part.startsWith('<p>') && part.endsWith('</p>'))
      return <p key={key} className="mb-4">{parseRichText(part.slice(3, -4), key)}</p>;
    if (/^<br\s*\/?>$/.test(part)) return <br key={key} />;
    return part;
  });
}

export default function RichText({ text, className = '' }) {
  if (!text) return null;
  return <div className={`whitespace-pre-wrap ${className}`}>{parseRichText(text)}</div>;
}
