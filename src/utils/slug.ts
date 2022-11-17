
export function parseSlug (slug: string) {
  const words = [];
  const splits = slug.split('-');

  for (let i = 0; i < splits.length; i++) {
    const split = splits[i];
    const word = split[0].toUpperCase() + split.substring(1);
    words.push(word);
  }

  return words.join(' ');
}
