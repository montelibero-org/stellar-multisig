import { Keypair, TransactionBuilder } from "@stellar/stellar-sdk";

/**
 * Signs a Stellar transaction using the provided secret key(s) and network.
 *
 * @param {string | string[]} secretKeys - A single secret key or an array of secret keys of the Stellar account(s).
 * @param {string} network - The network passphrase (e.g., 'Test SDF Network ; September 2015').
 * @param {string} xdr - The base64-encoded XDR string representing the transaction.
 * @returns {Promise<string>} - The signed transaction as a base64-encoded XDR string.
 *
 * Example usage:
 * const signedXDR = await signTransaction(secretKeyOrKeys, network, xdr);
 */
const signTransaction = async (
  secretKeys: string | string[],
  network: string,
  xdr: string
): Promise<string> => {
  try {
    // Validate input
    if (!secretKeys || !network || !xdr) {
      throw new Error("Invalid input: secretKeys, network, and xdr are required.");
    }

    // Ensure secretKeys is always an array for consistency
    const keypairs = (Array.isArray(secretKeys) ? secretKeys : [secretKeys]).map((key) => {
      if (typeof key !== "string") {
        throw new Error("Invalid secret key format. Expected a string.");
      }
      return Keypair.fromSecret(key);
    });

    // Parse the transaction
    const transaction = TransactionBuilder.fromXDR(xdr, network);

    // Sign the transaction with each keypair
    keypairs.forEach((keypair) => transaction.sign(keypair));

    // Return the signed transaction as XDR (base64)
    return transaction.toEnvelope().toXDR("base64");
  } catch (error) {
    console.error("Error signing transaction:", error);
    throw error; // Rethrow the error to handle it where this function is used
  }
};

export default signTransaction;
