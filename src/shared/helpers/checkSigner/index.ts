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
 * 1. When `signers` array is provided, it checks if any account matches any key from the signers,
 *    and that each matching signer has at least the required `signerWeight`.
 * 2. When a single `signer` is provided, it checks if any account matches this specific signer
 *    and that the signer has the specified weight.
 *
 * @param {IAccount[]} accounts - The array of accounts to be checked.
 * @param {Information["signers"]} [signers] - Optional. An array of signers to check against the accounts.
 * @param {number} [signerWeight] - Optional. The minimum weight required for a signer to be considered valid.
 * @param {string} [signer] - Optional. A specific signer key to check against the accounts.
 * @returns {boolean} - Returns `true` if a valid signer is found with the required weight, otherwise `false`.
 */

const checkSigner: CheckSigner = (
  accounts,
  signers,
  signerWeight = 1,
  signer
) => {
  if (!Array.isArray(accounts) || accounts.length === 0) return false;

  // Check for multiple signers with individual weights
  if (Array.isArray(signers) && signers.length > 0) {
    return signers.some((item) =>
      accounts.some(
        (account) =>
          account.accountID === item.key && item.weight >= signerWeight
      )
    );
  }

  // Check for a single signer with provided weight
  if (signer) {
    return accounts.some(
      (account) =>
        account.accountID === signer &&
        signers?.some((s) => s.key === signer && s.weight >= signerWeight)
    );
  }

  // Return false if no valid signers or signer are provided
  return false;
};

export default checkSigner;
