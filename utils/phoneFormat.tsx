export const formatUSInternational = (input: string): string => {
  const digits = input.replace(/\D/g, '');

  // Ensure +1 country code
  const cleaned = digits.startsWith('1') ? digits : '1' + digits;
  const sliced = cleaned.slice(0, 11); // 1 + 10 digits

  const country = `+${sliced[0]}`;
  const area = sliced.slice(1, 4);
  const prefix = sliced.slice(4, 7);
  const line = sliced.slice(7, 11);

  if (sliced.length <= 1) return country;
  if (sliced.length <= 4) return `${country} ${area}`;
  if (sliced.length <= 7) return `${country} ${area} ${prefix}`;
  return `${country} ${area} ${prefix} ${line}`;
};

export function stripUSPhone(input: string): string {
  const cleaned = input.replace(/[^\d+]/g, '');
  return cleaned.startsWith('+') ? cleaned : '+' + cleaned;
}
