import DOMPurify from 'dompurify';

export const sanitizeHtml = (dirty) => {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'pre', 'code', 'span', 'div',
      'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr', 'sub', 'sup'],
    ALLOWED_ATTR: ['href', 'target', 'src', 'alt', 'class', 'id', 'style', 'rel'],
    ALLOW_DATA_ATTR: false,
  });
};

export const sanitizeText = (dirty) => {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [] });
};
