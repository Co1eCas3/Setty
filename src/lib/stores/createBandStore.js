import { page, url } from '$app/stores';
import { urlMaker } from '$lib/utils/helpers';
import { useToken } from '$lib/utils/token';
import { writable } from 'svelte/store';

export function createBandStore(bandData) {
  const { subscribe, set, update } = writable(bandData);

  const getListStore = async listId => await createListStore(listId);

  const updateBandInfo = newBandInfo => new Promise(async resolve => {
    const url = urlMaker({ path: `api/bands/${page.url.params.band}` });
    const opts = {
      method: 'POST',
      body: JSON.stringify(newBandInfo)
    };

    const res = await useToken(url, opts);

    if (!res.ok) {
      console.log('update band error: ', res.data.error);
      return resolve(false);
    }

    update(band => ({ ...band, ...res.data.band }));
    resolve(true);
  })

  const deleteBand = () => new Promise(async resolve => {
    const url = urlMaker({ path: `api/bands/${page.url.params.band}` })
    const opts = { method: 'DELETE' }

    const res = await useToken(url, opts);

    if (!res.ok) {
      console.log('delete band error: ', res.data.error);
      return resolve(false);
    }

    resolve(true);
  });


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