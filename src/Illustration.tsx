import type { Picture } from './content';
import media from './media.json';

export function Illustration({ picture, large = false }: { picture: Picture; large?: boolean }) {
  const images: Record<string, string> = media.images;
  return <img src={images[large ? picture.imageLarge : picture.image]} alt="" className="picture-image" loading={large ? 'eager' : 'lazy'} draggable={false} width="2048" height="1792" />;
}
