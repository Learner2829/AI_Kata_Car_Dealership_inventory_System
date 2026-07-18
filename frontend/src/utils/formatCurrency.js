export function formatIndianCurrency(amount) {
  const num = Number(amount);
  if (isNaN(num)) return '₹0';

  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  if (absNum >= 10000000) {
    return `${sign}₹${(absNum / 10000000).toFixed(2)} Cr`;
  }
  if (absNum >= 100000) {
    return `${sign}₹${(absNum / 100000).toFixed(2)} L`;
  }

  const [intPart, decPart] = absNum.toFixed(2).split('.');
  const lastThree = intPart.slice(-3);
  const otherNumbers = intPart.slice(0, -3);
  const formatted = otherNumbers.length > 0
    ? otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree
    : lastThree;

  if (decPart === '00') {
    return `${sign}₹${formatted}`;
  }
  return `${sign}₹${formatted}.${decPart}`;
}
