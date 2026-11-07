export function normalizePhone(value) {
  let phone = String(value).trim().replace(/[۰-۹]/g, digit => '۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)).replace(/[٠-٩]/g, digit => '٠١٢٣٤٥٦٧٨٩'.indexOf(digit)).replace(/[\s()-]/g, '');
  if (phone.startsWith('+98')) phone = '0' + phone.slice(3);
  else if (phone.startsWith('0098')) phone = '0' + phone.slice(4);
  else if (/^989\d{9}$/.test(phone)) phone = '0' + phone.slice(2);
  return phone;
}
export function validateEntry(name, phone) {
  const normalizedName = String(name).trim().replace(/\s+/g, ' ');
  const normalizedPhone = normalizePhone(phone);
  return { name: normalizedName, phone: normalizedPhone,
    nameError: normalizedName.length < 2 || normalizedName.length > 80 || !/[\p{L}]/u.test(normalizedName) ? 'لطفاً نامت رو کامل بنویس.' : '',
    phoneError: !/^09\d{9}$/.test(normalizedPhone) ? 'شماره موبایل معتبر وارد کن؛ مثل ۰۹۱۲۳۴۵۶۷۸۹.' : '' };
}
