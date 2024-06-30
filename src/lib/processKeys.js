import dataKeys from './data-keys.json';

// Function to decode base64 strings
const decodeBase64 = (str) => {
  try {
    return atob(str);
  } catch (e) {
    console.error("Invalid base64 string:", str);
    return str;
  }
};

const processKeys = (key, value) => {
  let processedKey = key;
  let processedValue = value;

  // Convert regex strings to RegExp objects with boundaries and case-insensitive flag
  const regexPatterns = Object.entries(dataKeys).reduce((acc, [type, patterns]) => {
    acc[type] = patterns.map(pattern => new RegExp(`^${pattern}$`, 'i'));
    return acc;
  }, {});

  // Decode the base64 value
  const decodedValue = decodeBase64(value);

  // Determine the type of key and process accordingly
  for (const [type, patterns] of Object.entries(regexPatterns)) {
    if (patterns.some(pattern => pattern.test(key))) {
      switch (type) {
        case 'accounts':
          processedValue = `<a href="https://stellar.expert/explorer/public/account/${decodedValue}">${decodedValue}</a>`;
          break;
        case 'links':
          processedValue = `<a href="${decodedValue}">${decodedValue}</a>`;
          break;
        case 'names':
          processedValue = decodedValue; // Add specific processing for names if needed
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
