import type { Picture } from './content';
import { expansionCategories } from './expansion.ts';
import { additionCategories } from './additions.ts';

const expansionIds = new Set([...expansionCategories, ...additionCategories].flatMap(category => category.cards.map(card => card.id)));

export function audioTranscript(picture: Picture): string {
  if (picture.category === 'letters') return picture.name;
  if (picture.category === 'numbers') return picture.pronunciation;
  return `${picture.name}。${picture.description}`;
}

export function edgeEnglishAudioTranscript(picture: Picture): string {
  return expansionIds.has(picture.id) ? englishAudioTranscript(picture) : picture.english;
}

export function englishAudioTranscript(picture: Picture): string {
  if (picture.category === 'letters') return picture.name;
  if (!picture.englishDescription) throw new Error(`Missing English explanation: ${picture.id}`);
  return `${picture.english}. ${picture.englishDescription}`;
}
