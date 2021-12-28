import cookie from 'cookie';
import * as validator from 'validator';

export const addOneWeekOfSeconds = () => {
  const d = new Date();
  const t = Math.floor(d.getTime() / 1000);
  const nextWeek = t + (60 * 60 * 24 * 7);
  return new Date(nextWeek);
}

export const createRefTokenCookie = (token = '') => {
  return cookie.serialize(
    'ref',
    token,
    {
      httpOnly: true,
      expires: (token ? addOneWeekOfSeconds() : 0),
      maxAge: (token ? (60 * 60 * 24 * 7) : 0),
      path: '/'
    }
  );
}

export const isAuthRoute = path => path.startsWith('/api/auth');

export const setExpire = sub => {
  switch (sub) {
    case 'authenticate': return 300;
    case 'login': return 600;
    case 'refresh': return (60 * 60 * 24 * 7)
    default: throw new Error('Invalid subject');
  }
}

export const urlMaker = ({ host, path, query, hash }) => {
  host = host || 'http://localhost:3000';
  path = path || '';
  hash = hash || '';

  const url = new URL(path, host);
  url.search = new URLSearchParams(query);
  url.hash = hash;

  return url.toString();
}

export const debounceAsync = (fn, wait) => {
  let timer;
  return (...args) => new Promise(resolve => {
    (timer && clearTimeout(timer));

    timer = setTimeout(async () => {
      const res = await fn(...args);
      resolve(res);
    }, wait);
  });
}

export function makeBandNameWebSafe(bandName) {
  const sanitized = validator.whitelist(bandName, '\\w\\d\\s\\-!');
  const spacesReplaced = sanitized.replace(/\s/g, '-');
  return spacesReplaced.toLowerCase();
}