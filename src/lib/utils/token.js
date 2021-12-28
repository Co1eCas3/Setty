let curToken;

export function setToken(token) { curToken = token; };

export async function useToken(url, fetchOpts) {
  if (curToken) {
    if (fetchOpts.hasOwnProperty('headers')) {
      fetchOpts.headers = {
        ...fetchOpts.headers,
        authorization: `Bearer: ${curToken}`
      };
    } else {
      fetchOpts.headers = {
        authorization: `Bearer: ${curToken}`
      };
    }
  }

  try {
    const res = await fetch(url, fetchOpts);
    const data = await res.json();

    return {
      ok: res.ok,
      status: res.status,
      data
    };
  } catch (error) {
    console.log('request error: ', error);
    return {
      ok: false,
      error
    };
  }
}