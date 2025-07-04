// Phone utilities placeholder
export const formatPhoneNumber = (phone: string, format: string = 'international'): string => {
  const digits = phone.replace(/\D/g, '');
  
  if (format === 'international') {
    return `+${digits}`;
  } else if (format === 'national' && digits.length === 10) {
    return `(${digits.substr(0, 3)}) ${digits.substr(3, 3)}-${digits.substr(6, 4)}`;
  }
  
  return phone;
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

export const maskPhoneNumber = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return phone;
  
  const visibleStart = digits.slice(0, 2);
  const visibleEnd = digits.slice(-2);
  const masked = '*'.repeat(digits.length - 4);
  
  return `${visibleStart}${masked}${visibleEnd}`;
};
