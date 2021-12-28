import { writable } from 'svelte/store';

export function createBandStore(bandData) {
  return writable(null, setBand => {

  })

  async function getUsers() {

  }
}

// {
//   userRole,
//   bandRole,
//   otherBandRoleDescription,
//   band: {
//     id,
//     name,
//     webSafeName
//     getUsers(),
//     getSongs(),
//     getLists()
//   }
// }