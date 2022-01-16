import { urlMaker } from "$lib/utils/helpers";

const siteMap = {};

siteMap.home = urlMaker({});
siteMap.login = urlMaker({ path: 'login' });
siteMap.userAccount = urlMaker({ path: '/user/account' });
siteMap.userBands = urlMaker({ path: 'user/bands' });
siteMap.userProfile = siteMap.userBands;
siteMap.newUser = urlMaker({ path: 'user/account', hash: 'new' });
siteMap.newBand = urlMaker({ path: 'user/bands', hash: 'new' });

siteMap.band = webSafeName => urlMaker({ path: `${webSafeName}` });
siteMap.bandManage = webSafeName => urlMaker({ path: `${webSafeName}/manage` });
siteMap.repertoire = webSafeName => urlMaker({ path: `${webSafeName}/repertoire` });
siteMap.newList = webSafeName => urlMaker({ path: webSafeName, hash: 'new' });
siteMap.list = (webSafeName, listName) => urlMaker({ path: `${webSafeName}/${listName}` });

export default siteMap;