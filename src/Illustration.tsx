import type { Picture } from './content';
import media from './media.json';

export function Illustration({ picture, large = false }: { picture: Picture; large?: boolean }) {
  if (picture.category === 'numbers') return (
    <div className={`number-art ${large ? 'large' : ''}`}>
      <span>{picture.name}</span>
      {large && <div className="counting-dots" aria-label={`${picture.value} 个圆点`}>
        {Array.from({ length: picture.value! }, (_, index) => <i key={index} />)}
      </div>}
      {!large && <div className="number-sprinkles" aria-hidden="true"><i /><i /><i /></div>}
    </div>
  );
  if (picture.category === 'letters') return (
    <div className={`letter-art ${large ? 'large' : ''}`}><span>{picture.name}</span><span>{picture.pronunciation}</span></div>
  );
  const images: Record<string, string> = media.images;
  return <img src={images[(large ? picture.imageLarge : picture.image)!]} alt="" className="picture-image" loading={large ? 'eager' : 'lazy'} draggable={false} width="2048" height="1792" />;
}
