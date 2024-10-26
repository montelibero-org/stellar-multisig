import { IAccount, Information } from "@/shared/types";

export type CheckSigner = (
  accounts: IAccount[],
  signers?: Information["signers"],
  signerWeight?: number,
  signer?: string
) => boolean;

/**
 * Checks if a given signer is associated with any of the provided accounts.
 *
 * This function operates in two modes:
 * 1. When `signers` array is provided, it checks if any account matches any key from the signers.
 * 2. When a single `signer` is provided, it checks if any account matches this specific signer.
 *
 * @param {IAccount[]} accounts - The array of accounts to be checked.
 * @param {Information["signers"]} [signers] - Optional. An array of signers to check against the accounts.
 * @param {number} [signerWeight] - Optional. The weight required for a single signer to be considered valid.
 * @param {string} [signer] - Optional. A specific signer key to check against the accounts.
 * @returns {boolean} - Returns `true` if the signer is found in any account with the required weight, otherwise `false`.
 */

const checkSigner: CheckSigner = (
  accounts,
  signers,
  signerWeight = 0,
  signer
) => {
  if (!Array.isArray(accounts) || accounts.length === 0) return false;

  // Check for multiple signers with individual weights
  if (Array.isArray(signers) && signers.length > 0) {
    signers.map((item) => {
      accounts.map((account) => {
        if (account.accountID === item.key && item.weight > 0) {
          return true;
        }
      })
    })
  }

  // Check for a single signer with provided weight
  if (signer && signerWeight > 0) {
    return accounts.some((account) => account.accountID === signer);
  }

  // Return false if no valid signers or signer are provided
  return true;
};

export default checkSigner;
