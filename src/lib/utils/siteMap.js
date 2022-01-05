import { urlMaker } from "./helpers";

export const home = urlMaker({});
export const login = urlMaker({ path: 'login' });
export const userAccount = urlMaker({ path: '/user/account' });
export const userBands = urlMaker({ path: 'user/bands' });
export const userProfile = userBands;
export const newUser = urlMaker({ path: 'user/account', hash: 'new' });
export const newBand = urlMaker({ path: 'user/bands', hash: 'new' });

export const band = webSafeName => urlMaker({ path: `${webSafeName}` });
export const repertoire = webSafeName => urlMaker({ path: `${webSafeName}/repertoire` });
export const newList = webSafeName => urlMaker({ path: `${webSafeName}#new-list` });
export const list = (webSafeName, listName) => urlMaker({ path: `${webSafeName}/${listName}` });
