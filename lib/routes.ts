const ESCAPE_MARKER = "~";

/**
 * Next.js decodes percent-escaped slashes before resolving dynamic segments.
 * Replacing percent markers keeps DOI-backed identifiers inside one segment.
 */
export function paperSlug(id: string): string {
  return encodeURIComponent(id).replaceAll("%", ESCAPE_MARKER);
}

export function paperIdFromSlug(slug: string): string {
  try {
    return decodeURIComponent(slug.replaceAll(ESCAPE_MARKER, "%"));
  } catch {
    return slug;
  }
}

export function paperHref(id: string): string {
  return `/papers/${paperSlug(id)}`;
}

