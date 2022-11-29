import BigNumber from 'bignumber.js';

// JavaScript numbers use exponential notation for positive exponents of 21 and above.
// JavaScript numbers use exponential notation for negative exponents of -7 and below. We need more.
BigNumber.config({ EXPONENTIAL_AT: [-21, 21] });
/**
 * Format token amount to at least 4 decimals.
 * @param amount amount to format.
 * @returns formatted amount.
 */
export const formatTokenAmount = (
  amount: string = '0',
  decimals: number = 0,
) => {
  let shiftedAmount = amount;
  if (decimals) {
    shiftedAmount = (Number(amount) / 10 ** decimals).toString();
  }
  const parsedAmount = parseFloat(shiftedAmount);
  if (parsedAmount === 0 || isNaN(Number(shiftedAmount))) {
    return '0';
  }

  let decimalPlaces = 3;
  const absAmount = Math.abs(parsedAmount);
  while (absAmount < 1 / 10 ** decimalPlaces) {
    decimalPlaces++;
  }

  return new BigNumber(
    parseFloat(new BigNumber(parsedAmount).toFixed(decimalPlaces + 1, 0)),
  ).toString();
};
