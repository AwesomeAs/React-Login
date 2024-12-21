import { routes } from "../routes/routes";

async function callCommon<TOut>(path: string, modify: (options: any) => void): Promise<TOut> {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  const auth = localStorage.getItem('token');
  if (auth) {
    headers.set('Authorization', 'Bearer ' + auth);
  }
  const requestOptions = {
    headers: headers
  };
  modify(requestOptions);
  const response = await fetch(path, requestOptions);
  if (response.ok) {
    return await response.json();
  } else {
    if (response.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = routes.login.link;
    }
    throw new Error(await response.text());
  }
}

async function callPost<TIn, TOut>(path: string, data: TIn): Promise<TOut> {
  return await callCommon<TOut>(path, options => {
    options.method = 'POST';
    options.body = JSON.stringify(data);
  });
}

async function callGet<TOut>(path: string): Promise<TOut> {
  return await callCommon<TOut>(path, options => options.method = 'GET');
}

export const ApiHandler = {
  callPost,
  callGet
}