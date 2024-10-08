import { StrKey } from "@stellar/stellar-sdk";

/**
 * Validates a Stellar secret key or hex string.
 *
 * Checks if the input is a valid Stellar secret key (starting with "S") or a
 * valid hex string (even length, up to 64 bytes). Returns an error message if
 * the input is invalid, otherwise returns an empty string.
 *
 * @param {string} value - The input to validate.
 * @returns {string} - Error message or an empty string.
 */
const getSecretKeyError = (secretKey: string): string => {
  if (secretKey && secretKey.length !== 0) {
    if (secretKey[0] === "S") {
      if (!StrKey.isValidEd25519SecretSeed(secretKey)) {
        return "Invalid secret key.";
      }
    } else {
      if (
        !secretKey.match(/^[0-9a-f]{2,128}$/gi) ||
        secretKey.length % 2 == 1
      ) {
        return `Invalid hex value. Please provide up to 64 bytes in hexadecimal format.`;
      }
    }
  }

  return "";
};

export default getSecretKeyError;
