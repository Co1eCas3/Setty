import * as validator from 'validator';
import { urlMaker, debounceAsync } from '$lib/utils/helpers';

export const email = email => {
  if (!email) return '';
  if (!validator.isEmail(email))
    return "That email doesn't look right...";
  return '';
}

export const name = name => {
  if (validator.isEmpty(name)) return '';
  if (validator.matches(name, /[^\s\w\d\-']/))
    return 'No special characters except dashes and/or apostrophes please.';
  else if (!validator.isLength(name, { max: 20 }))
    return 'Woah, is your name really that long? Got a nickname maybe? Something less than 20 characters?';
  else
    return '';
}

export const bandName = (name, el) => {
  if (validator.isEmpty(name)) return '';
  if (validator.matches(name, /[=+%;:]/))
    return "Some special characters are restricted";
  if (!validator.isLength(name, { max: 30 }))
    return 'Can you really remember that name? Sorry, needs to be shorter...';
  return '';
}

export const webSafeName = wsn => {
  if (validator.isEmpty(wsn)) return '';
  if (validator.matches(wsn, /[^\w\d\-_!]/))
    return "Only special characters '!', '-', and '_' are allowed for the URL.";
  if (!validator.isLength(wsn, { max: 30 }))
    return "That's going to be hard to remember, please make it shorter."
  return '';
}

// intended to be called reactively on input
export const WSNIsTaken = debounceAsync(async wsn => {
  if (!wsn) return false;

  const url = urlMaker({ path: '/api/bands/check-wsn-is-unique', query: { wsn } });
  const res = await fetch(url);

  if (res.status === 204) return false;
  return true;
}, 250);



