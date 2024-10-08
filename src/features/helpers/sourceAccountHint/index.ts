/**
 * @param sourcerAccount - The source account string.
 * @returns A shortened hint version of the input.
 */
const sourceAccountHint = (sourcerAccount: string): string => {
  if (!sourcerAccount || sourcerAccount.length < 6) {
    return sourcerAccount;
  }
  const firstChar = sourcerAccount[0];
  const middlePart = "-".repeat(sourcerAccount.length - 10);
  const lastPart = sourcerAccount.slice(-9, -4);

  return `${firstChar}${middlePart}${lastPart}----`;
};

export default sourceAccountHint;

