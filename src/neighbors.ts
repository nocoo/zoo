import type { Picture } from './content';

export function neighborImages(items: Picture[], current: string): string[] {
  const index = items.findIndex(item => item.id === current);
  if (index < 0) return [];
  return [...new Set([-1, 1, -2, 2].map(step => items[(index + step + 2 * items.length) % items.length])
    .filter(item => item.id !== current).map(item => item.imageLarge).filter((url): url is string => !!url))];
}
