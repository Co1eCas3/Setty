import { writable, get } from 'svelte/store';

import { urlMaker } from "$lib/utils/helpers";
import { setToken, useToken } from "$lib/utils/token";
import { firebase } from "./firebase";
import siteMap from '$lib/utils/siteMap';


// `$user = undefined` means auth status has not been resolved yet
// `$user = null` means firebase not able to authenticate, user not signed in
export const user = createUserStore();

function createUserStore() {
  const { subscribe, set } = writable(undefined, setUser => {
    const unsubFirebase = firebase.subscribe(async $firebase => {
      const { user, token } = await getSettyUserData($firebase.user);
      setUser(user);
      setToken(token);
    });

    return () => unsubFirebase();
  })

  const updateUserName = newName => {
    return new Promise(async resolve => {
      const { id } = get(user);
      const url = urlMaker({ path: `/api/user/${id}` });
      const fetchBody = { name: newName };

      const updateRes = await useToken(url, {
        method: 'PUT',
        body: JSON.stringify(fetchBody)
      });

      if (updateRes.ok) {
        resolve(true);
        set(updateRes.data.user);
      } else {
        console.log('update name error: ', updateRes.error)
        resolve(false);
      }
    });
  }

  const createBand = (newBand) => {
    return new Promise(async resolve => {
      const url = urlMaker({ path: 'api/bands/create' });
      const opts = {
        method: "POST",
        body: JSON.stringify(newBand)
      }
      const res = await useToken(url, opts);

      if (!res.ok) return resolve(false);

      const userStore = get(user);
      userStore.bands = [...userStore.bands, res.data.band];
      set(userStore);
      resolve(true);
    })
  }

  return {
    subscribe,
    updateUserName,
    createBand
  }
}

async function getSettyUserData($fbUser) {
  if (!$fbUser)
    return { user: $fbUser, token: null };

  // if($fbUser === undefined) 
  //   return { user: undefined, token: null};
  // if ($fbUser === null)
  //   return { user: null, token: null };

  const url = urlMaker({ path: '/api/login' });
  const fetchBody = {
    email: $fbUser.email,
    fbuid: $fbUser.uid,
    newUser: $fbUser.metadata.createdAt === $fbUser.metadata.lastLoginAt
  };

  const settyUserRes = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(fetchBody)
  });
  const settyUserData = await settyUserRes.json();

  if (!settyUserRes.ok) {
    console.log(settyUserData.error);
    return { user: null, token: null };
  }

  return settyUserData;
}