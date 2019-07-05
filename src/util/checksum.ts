import crypto from 'crypto';

export default function(str: string, algorithm: string = 'sha1', encoding: crypto.HexBase64Latin1Encoding = 'hex') {
  return crypto
    .createHash(algorithm)
    .update(str, 'utf8')
    .digest(encoding);
}