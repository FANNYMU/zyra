const escapeHtml = (unsafe) => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const removeScriptTags = (input) => {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  let sanitized = removeScriptTags(input);
  
  sanitized = escapeHtml(sanitized);
  
  sanitized = sanitized.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
  
  sanitized = sanitized.replace(/(\b)(on\S+)(\s*)=/g, '');
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  sanitized = sanitized.slice(0, 1000);
  
  return sanitized.trim();
};

export { sanitizeInput }; 