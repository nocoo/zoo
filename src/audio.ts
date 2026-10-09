import type { Picture } from './content';

export function audioTranscript(picture: Picture): string {
  if (picture.category === 'letters') return picture.name;
  if (picture.category === 'numbers') return picture.pronunciation;
  return `${picture.name}。${picture.description}`;
}
