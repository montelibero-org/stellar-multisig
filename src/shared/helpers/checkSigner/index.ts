import { IAccount, Information } from "@/shared/types";

export type CheckSigner = (
  accounts: IAccount[],
  signers?: Information["signers"],
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
 * @param {string} [signer] - Optional. A specific signer key to check against the accounts.
 * @returns {boolean} - Returns `true` if the signer is found in any account, otherwise `false`.
 */

const checkSigner: CheckSigner = (accounts, signers, signer) => {
  if (!accounts) return false;
  if (signers) {
    return accounts.some((account: IAccount) =>
      signers.some((signer) => account.accountID === signer?.key)
    );
  }
  if (signer) {
    return accounts.some((account: IAccount) => account.accountID=== signer);
  }

  return false;
};

export default checkSigner;
