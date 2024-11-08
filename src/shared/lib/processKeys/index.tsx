import dataKeys from "@/shared/configs/data-keys.json";
// Function to decode base64 strings
export const decodeBase64 = (str: string | undefined): string => {
  if (typeof str !== "string") return "";

  try {
    return atob(str);
  } catch (error) {
    console.error("Invalid base64 string:", str, error);
    return str;
  }
};

const processKeys = (
  key: string,
  value: string
): { processedKey: string; processedValue: string } => {
  const processedKey = key;
  let processedValue: string = value;

  // Convert regular expression strings to RegExp objects with boundaries and case-insensitive flag
  const regexPatterns: { [type: string]: RegExp[] } = Object.entries(
    dataKeys
  ).reduce((acc, [type, patterns]) => {
    acc[type] = patterns.map((pattern) => new RegExp(`^${pattern}$`, "i"));
    return acc;
  }, {} as { [type: string]: RegExp[] });

  const isValidKey = Object.values(regexPatterns).some((patterns) =>
    patterns.some((pattern) => pattern.test(key))
  );

  if (!isValidKey) {
    console.log("")
  }

  // Decode base64 value
  const decodedValue = decodeBase64(value);

  processedValue = decodedValue;

  return { processedKey, processedValue };
};

export default processKeys;
