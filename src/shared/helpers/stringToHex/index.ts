/**
 * Converts a given string into its hexadecimal representation.
 *
 * @param {string} str - The input string that you want to convert to hexadecimal format.
 * @returns {string} A string representing the hexadecimal encoding of the input string.
 *
 * @example
 * import stringToHex from './stringToHex';
 *
 * const hexValue = stringToHex('Hello, World!');
 * console.log(hexValue);
 * // Output: '48656c6c6f2c20576f726c6421'
 *
 * @remarks
 * - **Unicode Handling**: This function uses `charCodeAt`, which works well for characters represented by a single 16-bit code unit.
 *   For characters outside the Basic Multilingual Plane (BMP), such as emoji or certain Asian characters,
 *   consider using `codePointAt` for accurate results.
 * - **No Delimiters**: The output hex string does not include spaces or any delimiters between hexadecimal values of characters.
 */
function stringToHex(str: string): string {
  let hex = "";
  for (let i = 0; i < str.length; i++) {
    hex += str.charCodeAt(i).toString(16);
  }
  return hex;
}

export default stringToHex;
