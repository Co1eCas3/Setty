import { browser } from "$app/env";
import fbApp from "$lib/utils/firebaseConfig";
import {
  getAuth,
  isSignInWithEmailLink,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signOut as _signOut
} from "firebase/auth";
import { writable } from 'svelte/store';

import { urlMaker } from "../../utils/helpers";

export const firebase = createAuthStore();

function createAuthStore() {
  const { subscribe, update } = writable({
    statusKnown: false,
    needEmailAgain: false,
    user: undefined
  });

  const listen = async () => {
    const setState = fbUser => update($authState => ({
      ...$authState,
      statusKnown: true,
      user: fbUser
    }));

    const handleAuthError = err => {
      console.log('auth error: ', err);
      setState(null);
    }

    onAuthStateChanged(getAuth(fbApp), setState, handleAuthError);
  }

  const sendEmail = async email => {
    const actionCodeSettings = {
      url: urlMaker({ path: '/login' }),
      handleCodeInApp: true
    };

    try {
      await sendSignInLinkToEmail(getAuth(fbApp), email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      return true;
    } catch (error) {
      console.log('email error: ', error);
      return false;
    }
  }

  const signIn = async (email = '') => {
    const url = checkLink();

    if (url) {
      email = email || getNRemoveEmail();

      if (!email) {
        setNeedEmailAgain(true);
        return false;
      }

      try {
        await signInWithEmailLink(getAuth(fbApp), email, url);
        setNeedEmailAgain(false);
        return true;
      } catch (error) {
        console.log('sign in error: ', error);
        return false;
      }
    } else {
    }
  }

  const signOut = async () => {
    try {
      await _signOut(getAuth(fbApp));
      return true;
    } catch (error) {
      console.log('sign out error: ', error);
      return false;
    }
  }

  function setNeedEmailAgain(val) {
    update($auth => ({
      ...$auth,
      needEmailAgain: val
    }));
  }

  if (browser) listen();
  else update($auth => ({ ...$auth, statusKnown: true }));

  return {
    subscribe,
    sendEmail,
    signIn,
    signOut
  }
}

function checkLink() {
  const curHref = window.location.href;

  if (isSignInWithEmailLink(getAuth(fbApp), curHref)) {
    window.history.replaceState({ loginLink: curHref }, '', '/login');
    return curHref;
  }

  const savedHref = getLinkFromHistory();
  return isSignInWithEmailLink(getAuth(fbApp), (savedHref || '')) && savedHref;
}

function getLinkFromHistory() {
  const curState = window.history.state;
  return (
    typeof curState === 'object' && curState.hasOwnProperty('loginLink')
  ) && curState.loginLink;
}

function getNRemoveEmail() {
  const email = localStorage.getItem('emailForSignIn');
  localStorage.removeItem('emailForSignIn');
  return email;
}