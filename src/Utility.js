const Xor = (a, b) => {
    let result = '';
    if(a.length !== b.length) return result;
    for(let i = 0; i < a.length; i++) {
      result += String.fromCharCode(parseInt(a.charCodeAt(i) ^ b.charCodeAt(i)));
    }
    return result;
}

export default Xor;