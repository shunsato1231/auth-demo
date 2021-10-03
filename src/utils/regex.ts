export const regex = {
  email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
  // 半角英数字をそれぞれ1種類以上含む8文字以上100文字以下の正規表現
  password: /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,100}$/i,
};
