import dataKeys from '../data-keys.json';
import { DataKeys } from './data-keys';

// Функция для декодирования base64 строк
const decodeBase64 = (str: string): string => {
  try {
    return atob(str);
  } catch (e) {
    console.error("Invalid base64 string:", str);
    return str;
  }
};

const processKeys = (key: string, value: string): { processedKey: string, processedValue: string } => {
  let processedKey = key;
  let processedValue = value;

  // Конвертируем строки регулярных выражений в объекты RegExp с границами и флагом без учета регистра
  const regexPatterns: { [type: string]: RegExp[] } = Object.entries(dataKeys).reduce((acc, [type, patterns]) => {
    acc[type] = patterns.map(pattern => new RegExp(`^${pattern}$`, 'i'));
    return acc;
  }, {} as { [type: string]: RegExp[] });

  // Декодируем значение base64
  const decodedValue = decodeBase64(value);

  // Определяем тип ключа и обрабатываем соответственно
  for (const [type, patterns] of Object.entries(regexPatterns)) {
    if (patterns.some(pattern => pattern.test(key))) {
      switch (type) {
        case 'accounts':
          processedValue = `<a href="/public/${decodedValue}">${decodedValue}</a>`;
          break;
        case 'links':
          processedValue = `<a href="${decodedValue}">${decodedValue}</a>`;
          break;
        case 'names':
          processedValue = decodedValue; // Добавьте конкретную обработку для имен, если нужно
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
