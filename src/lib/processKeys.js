// utils/processKeys.js
import dataKeys from './data-keys.json';

const processKeys = (key, value) => {
  let processedKey = key;
  let processedValue = value;

  // Convert regex strings to RegExp objects
  const regexPatterns = Object.entries(dataKeys).reduce((acc, [type, patterns]) => {
    acc[type] = patterns.map(pattern => new RegExp(pattern, 'i'));
    return acc;
  }, {});

  // Determine the type of key and process accordingly
  for (const [type, patterns] of Object.entries(regexPatterns)) {
    if (patterns.some(pattern => pattern.test(key))) {
      switch (type) {
        case 'accounts':
          processedValue = `<a href="https://stellar.expert/explorer/public/account/${value}">${value}</a>`;
          break;
        case 'links':
          processedValue = `<a href="${value}">${value}</a>`;
          break;
        case 'names':
          processedValue = value; // Add specific processing for names if needed
          break;
        default:
          break;
      }
      break;
    }
  }

  return { processedKey, processedValue };
};

export default processKeys;
