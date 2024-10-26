import { Information } from "@/shared/types";

/**
 * Collects the total signer weights from the provided `information` object and updates the state.
 *
 * This function iterates through the signers in the `information` object, checks if each signer has a weight,
 * and adds that weight to the current state of signer weights using the `setSignerWeights` function.
 * The initial weight is reset to 0 before processing.
 *
 * @param {Information} information - The object containing an array of signers. Each signer should have a `weight` property.
 * @param {React.Dispatch<React.SetStateAction<number>>} setSignerWeights - A React state setter function used to update the total signer weights.
 *
 * @returns {void} - This function does not return anything. It updates the total signer weights via the `setSignerWeights` function.
 */

const collectSignerWeights = (
  information: Information,
  setSignerWeights: React.Dispatch<React.SetStateAction<number>>
): void => {
  setSignerWeights(0);
  if (information.signers && information.signers.length > 0) {
    information.signers.map((item) => {
      if (item.weight) {
        setSignerWeights((prevState) => prevState + item.weight);
      }
    });
  }
};

export default collectSignerWeights;
