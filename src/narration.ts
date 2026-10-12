export function narrationSegments(text: string, language: 'zh' | 'en') {
  const segments = [...new Intl.Segmenter(language, { granularity: 'word' }).segment(text)];
  const total = segments.reduce((sum, part) => sum + (part.isWordLike ? part.segment.length : 0), 0);
  let offset = 0;
  return segments.map(part => {
    const start = offset / (total || 1);
    offset += part.isWordLike ? part.segment.length : 0;
    return { text: part.segment, start, end: offset / (total || 1) };
  });
}
