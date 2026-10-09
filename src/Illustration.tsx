import type { Picture } from './content';

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
  return <img src={large && picture.imageLarge ? picture.imageLarge : picture.image} alt="" className="picture-image" loading={large ? 'eager' : 'lazy'} draggable={false} width={picture.imageLarge ? 2048 : 300} height={picture.imageLarge ? 1792 : 250} />;
}
