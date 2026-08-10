import SocialIcon from './SocialIcon';

/* Two stacked copies of the same glyph inside a clipped box: on hover the column
   slides up by exactly one icon height, so the icon rolls out of the top while its
   twin arrives from the bottom. The parent link must carry `group/roll`. */
export default function RollIcon({ name, size = 16 }) {
  return (
    <span className="block overflow-hidden" style={{ width: size, height: size }}>
      <span
        className="flex flex-col transition-transform duration-300 ease-out group-hover/roll:-translate-y-1/2"
        style={{ height: size * 2 }}
      >
        <SocialIcon name={name} size={size} />
        <SocialIcon name={name} size={size} />
      </span>
    </span>
  );
}
