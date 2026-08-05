export function calcCompoundInterest(
  principal: number,
  rate: number,
  periods: number,
): number {
  return principal * Math.pow(1 + rate, periods);
}