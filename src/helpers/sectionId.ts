/** Stable anchor id for a legal section heading, e.g. "ARTICLE 9 – ..." -> "article-9". */
export const sectionId = (heading: string): string => {
  const article = heading.match(/^ARTICLE\s+(\d+)/i);
  if (article) return `article-${article[1]}`;
  return heading
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};
