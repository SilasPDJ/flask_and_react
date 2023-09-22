export default function slugify(text, replaceSpacesTo) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, replaceSpacesTo) // Substitui espaços por hifens
    .replace(/[^\w-]+/g, '') // Remove caracteres não alfanuméricos e não hifens
    .replace(/--+/g, '-'); // Remove múltiplos hifens consecutivos
}

