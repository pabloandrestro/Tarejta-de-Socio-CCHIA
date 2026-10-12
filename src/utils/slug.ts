export function generateSlug(name: string): string {
  if (!name) return '';
  return name
    .normalize('NFD') // Descompone caracteres con tildes
    .replace(/[\u0300-\u036f]/g, '') // Remueve tildes
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Reemplaza espacios y caracteres no alfanuméricos por guiones
    .replace(/^-+|-+$/g, '') // Remueve guiones al inicio y fin
    .slice(0, 60); // Longitud razonable
}

export function ensureUniqueSlug(baseSlug: string, existingSlugs: string[], currentCardId?: string): string {
  if (!baseSlug) baseSlug = 'socio';
  let slug = baseSlug;
  let counter = 2;
  
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

export function categoryToSlug(category: string): string {
  return generateSlug(category);
}

export function slugToCategory(slug: string, categories: string[]): string | undefined {
  return categories.find(cat => generateSlug(cat) === slug);
}
