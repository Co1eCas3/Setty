import { derived } from 'svelte/store';
import { firebase, user } from '$lib/stores/auth';

export const userReady = derived(
  [firebase, user],
  ([$firebase, $user]) => ($firebase.statusKnown && $user !== undefined)
)