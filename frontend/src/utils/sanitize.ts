const ENTITIES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
};

export function sanitize(str: string): string {
  return String(str).replace(/[&<>"']/g, (ch) => ENTITIES[ch as keyof typeof ENTITIES] || ch);
}

export function sanitizeFilename(name: string): string {
  const base = name.split('\\').pop()?.split('/').pop() || name;
  return base.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120);
}
