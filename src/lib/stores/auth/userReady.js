import { derived } from 'svelte/store';
import { firebase } from './firebase';
import { user } from './user';

export const userReady = derived(
  [firebase, user],
  ([$firebase, $user]) => ($firebase.statusKnown && $user !== undefined)
)