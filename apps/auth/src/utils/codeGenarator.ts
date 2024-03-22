export const codeGenerator = (n: number): string =>  {
  let otp = '';
  const digits = '0123456789';
  for (let i = 0; i < n; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
}
