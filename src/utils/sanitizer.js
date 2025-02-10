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

const preventSqlInjection = (input) => {
  return input
    .replace(/'/g, "''")
    .replace(/--/g, '')
    .replace(/;/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '')
    .replace(/xp_/gi, '')
    .replace(/UNION/gi, '')
    .replace(/SELECT/gi, '')
    .replace(/DROP/gi, '')
    .replace(/DELETE/gi, '')
    .replace(/UPDATE/gi, '');
};

const preventPathTraversal = (input) => {
  return input
    .replace(/\.\./g, '')
    .replace(/\/\//g, '/')
    .replace(/\\/g, '/');
};

const preventCommandInjection = (input) => {
  return input
    .replace(/[&|;$`]/g, '')
    .replace(/\n/g, '')
    .replace(/\r/g, '')
    .replace(/\t/g, '');
};

const preventNoSqlInjection = (input) => {
  return input
    .replace(/\$/g, '')
    .replace(/\{/g, '')
    .replace(/\}/g, '')
    .replace(/\$/g, '')
    .replace(/\./g, '');
};

const preventTemplateInjection = (input) => {
  return input
    .replace(/\${/g, '')
    .replace(/\}/g, '')
    .replace(/<%-/g, '')
    .replace(/<%=/g, '')
    .replace(/<%/g, '')
    .replace(/%>/g, '');
};

const preventCrlfInjection = (input) => {
  return input
    .replace(/\r/g, '')
    .replace(/\n/g, '')
    .replace(/%0D/gi, '')
    .replace(/%0A/gi, '');
};

const preventUnicodeAttacks = (input) => {
  return input
    .replace(/[^\x20-\x7E]/g, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '');
};

const preventDataUrlXss = (input) => {
  return input
    .replace(/data:/gi, '')
    .replace(/base64/gi, '')
    .replace(/[^\w\s-.,]/gi, '');
};

const preventPrototypePollution = (input) => {
  return input
    .replace(/__proto__/gi, '')
    .replace(/constructor/gi, '')
    .replace(/prototype/gi, '');
};

const preventRegexDos = (input) => {
  if (input.length > 100 && /^([a-z0-9]+[.*+?^${}()|[\]\\]){3,}/i.test(input)) {
    return input.substring(0, 100);
  }
  return input;
};

const preventHppAttacks = (input) => {
  return input
    .replace(/[\[\]]/g, '')
    .replace(/&/g, '')
    .replace(/=/g, '');
};

const preventFormatStringAttack = (input) => {
  return input
    .replace(/%[scdfu]/gi, '')
    .replace(/%[n]/gi, '')
    .replace(/%[x]/gi, '');
};

const preventRequestSmuggling = (input) => {
  return input
    .replace(/content-length/gi, '')
    .replace(/transfer-encoding/gi, '')
    .replace(/chunked/gi, '');
};

const preventSsrf = (input) => {
  const blockedPatterns = [
    /localhost/gi,
    /127\.0\.0\.1/g,
    /0\.0\.0\.0/g,
    /::1/g,
    /internal\./gi,
    /private\./gi,
    /10\./g,
    /172\.(1[6-9]|2[0-9]|3[0-1])\./g,
    /192\.168\./g,
    /169\.254\./g
  ];
  
  let sanitized = input;
  blockedPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });
  return sanitized;
};

const preventXmlAttacks = (input) => {
  return input
    .replace(/<!\[CDATA\[/gi, '')
    .replace(/\]\]>/gi, '')
    .replace(/<!ENTITY/gi, '')
    .replace(/<!DOCTYPE/gi, '')
    .replace(/<!ELEMENT/gi, '')
    .replace(/<!ATTLIST/gi, '');
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  let sanitized = input;

  sanitized = removeScriptTags(sanitized);
  sanitized = escapeHtml(sanitized);
  sanitized = preventSqlInjection(sanitized);
  sanitized = preventPathTraversal(sanitized);
  sanitized = preventCommandInjection(sanitized);
  sanitized = preventNoSqlInjection(sanitized);
  sanitized = preventTemplateInjection(sanitized);
  sanitized = preventCrlfInjection(sanitized);
  sanitized = preventUnicodeAttacks(sanitized);
  
  sanitized = preventDataUrlXss(sanitized);
  sanitized = preventPrototypePollution(sanitized);
  sanitized = preventRegexDos(sanitized);
  sanitized = preventHppAttacks(sanitized);
  sanitized = preventFormatStringAttack(sanitized);
  sanitized = preventRequestSmuggling(sanitized);
  sanitized = preventSsrf(sanitized);
  sanitized = preventXmlAttacks(sanitized);
  
  sanitized = sanitized.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
  
  sanitized = sanitized.replace(/(\b)(on\S+)(\s*)=/g, '');
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  sanitized = sanitized.slice(0, 1000);
  
  return sanitized.trim();
};

const rateLimiter = (() => {
  const requests = new Map();
  const limit = 100;
  const windowMs = 15 * 60 * 1000;

  return (ip) => {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    requests.forEach((timestamp, key) => {
      if (timestamp < windowStart) {
        requests.delete(key);
      }
    });

    const requestCount = (requests.get(ip) || [])
      .filter(timestamp => timestamp > windowStart)
      .length;

    if (requestCount >= limit) {
      return false;
    }

    const timestamps = requests.get(ip) || [];
    timestamps.push(now);
    requests.set(ip, timestamps);

    
    return true;
  };
})();

export { 
  sanitizeInput, 
  rateLimiter,
  escapeHtml,
  preventSqlInjection,
  preventPathTraversal,
  preventCommandInjection,
  preventNoSqlInjection,
  preventTemplateInjection,
  preventCrlfInjection,
  preventUnicodeAttacks,
  preventDataUrlXss,
  preventPrototypePollution,
  preventRegexDos,
  preventHppAttacks,
  preventFormatStringAttack,
  preventRequestSmuggling,
  preventSsrf,
  preventXmlAttacks
}; 