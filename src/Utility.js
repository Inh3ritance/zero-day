import sha512 from 'crypto-js/sha512';

export const Xor = (a, b) => {
    let result = '';
    if(a.length !== b.length) return result;
    for(let i = 0; i < a.length; i++) {
      result += String.fromCharCode(parseInt(a.charCodeAt(i) ^ b.charCodeAt(i)));
    }
    return result;
}

export const Rounds = (str, num) => {
  if(num <= 0) return str;
  let rounds = str;
  let i = 0;
  while(i < num) {
    rounds = sha512(rounds, num);
    i++;
  }
  return rounds;
}

export const NextRound = (str) => {
  return sha512(str);
}

export const ConformPlainText = (pt) => {
  let str = pt;
  str += "/[EXT:";
  if(str % 128 !== 0) {
    while(str % 126 !== 0) {
      str += "";
    }
    str += "]/";
  } else {
    return "Extension";
  }
}