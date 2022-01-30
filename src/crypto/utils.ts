import sha512 from 'crypto-js/sha512';
// import crypto from 'crypto';

// console.log(crypto);

// XOR to strings of equal length
export const xor = (a: string, b: string) => {
  let result = '';
  if (a.length !== b.length) return result;
  for (let i = 0; i < a.length; i++) {
    result += String.fromCharCode(a.charCodeAt(i) ^ b.charCodeAt(i));
  }
  return result.toString();
};

// think about this...
export const rounds = (str: string, num: number) => {
  if (num <= 0) return str;
  let roundsStr = str;
  let i = 0;
  while (i < num) {
    roundsStr = sha512(roundsStr).toString();
    i++;
  }
  return roundsStr;
};

// gets next sha512 round
export const nextRound = (str: string) => sha512(str);

// Padding for plaintext
export const conformPlainText = (pt: string) => {
  let str = pt;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  str += '/[EXT:';
  while (str.length % 126 !== 0) {
    str += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  str += ']/';
  return str;
};
