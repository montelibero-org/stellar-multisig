import dataKeys from "@/shared/configs/data-keys.json";
import stellarSdk from "stellar-sdk";
import Link from "next/link";

// Function to decode base64 strings
const decodeBase64 = (str: string | undefined): string => {
  if (typeof str !== "string") {
    return "";
  }

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
): { processedKey: string; processedValue: JSX.Element } => {
  const processedKey = key;
  let processedValue: JSX.Element = <span>{decodeBase64(value)}</span>;

  // Convert regular expression strings to RegExp objects with boundaries and case-insensitive flag
  const regexPatterns: { [type: string]: RegExp[] } = Object.entries(
    dataKeys
  ).reduce((acc, [type, patterns]) => {
    acc[type] = patterns.map((pattern) => new RegExp(`^${pattern}$`, "i"));
    return acc;
  }, {} as { [type: string]: RegExp[] });

  // Decode base64 value
  const decodedValue = decodeBase64(value);

  // Determine key type and process accordingly
  for (const [type, patterns] of Object.entries(regexPatterns)) {
    if (patterns.some((pattern) => pattern.test(key))) {
      switch (type) {
        case "accounts":
          processedValue = stellarSdk.StrKey.isValidEd25519PublicKey(decodedValue)
            ? <Link href={`/public/account?id=${decodedValue}`} legacyBehavior><a>{decodedValue}</a></Link>
            : <span>{decodedValue}</span>;
          break;
        case "links":
          processedValue = <Link href={decodedValue} legacyBehavior><a target="_blank">{decodedValue}</a></Link>;
          break;
        case "names":
          processedValue = <span>{decodedValue}</span>; // Add specific processing for names if needed
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
