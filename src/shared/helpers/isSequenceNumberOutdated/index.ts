import { Sequence } from "@/shared/types";

/**
 * Checks whether the given sequence number is outdated compared to the original sequence number.
 * It uses BigInt for comparison to ensure accuracy with large numbers.
 *
 * @param {Sequence} originalSeq - The original sequence number that serves as the baseline for comparison.
 * @param {Sequence} seqForCheck - The sequence number to check against the original sequence.
 * @returns {boolean} - Returns true if the sequence number to check is outdated (i.e., less than or equal to the original sequence).
 *                      Returns false if the sequence number to check is greater than the original sequence.
 */
function isSequenceNumberOutdated(
  originalSeq: Sequence,
  seqForCheck: Sequence
): boolean {
  if (!originalSeq || !seqForCheck) {
    console.error(
      "originalSeq or seqForCheck is undefined:",
      originalSeq,
      seqForCheck
    );
  }
  return BigInt(seqForCheck!) < BigInt(originalSeq!);
}

export default isSequenceNumberOutdated;
