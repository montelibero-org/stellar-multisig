/**
 * Converts a hexadecimal string back to its original string representation.
 *
 * @param {string} hex - The hexadecimal string that you want to convert back to normal text.
 * @returns {string} The decoded string from the hexadecimal input.
 *
 * @example
 * import hexToString from './hexToString';
 *
 * const originalString = hexToString('48656c6c6f2c20576f726c6421');
 * console.log(originalString);
 * // Output: 'Hello, World!'
 *
 * @remarks
 * - **Hex String Format**: The function expects the hexadecimal string to have no delimiters and an even length.
 * - **Error Handling**: If the hex string has an odd length or contains invalid hexadecimal characters, the function may produce incorrect results.
 */
function hexToString(hex: string): string {
  let str = "";
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
}

export default hexToString;
