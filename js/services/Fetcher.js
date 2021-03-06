// @flow
import config from 'react-native-config';

config.api = 'https://api.github.com/repos/spyl94/epicerie-radar';

const status = (response: Object): Object | Error => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  return response.json().then(res => {
    const error = new Error(response.statusText);
    error.response = res;
    throw error;
  });
};

const json = (response: ?Object) => (response ? response.json() : {});

const createHeaders = (): { [string]: string } => {
  return {
    Accept: 'application/vnd.github.v3+json',
    Authorization: 'token ' + config.GH_TOKEN,
    'Content-Type': 'application/json',
  };
};

class Fetcher {
  get(uri: string) {
    return fetch(config.api + uri, {
      method: 'GET',
      headers: createHeaders(),
    })
      .then(status)
      .then(json);
  }

  post(uri: string, body: ?Object = {}) {
    return fetch(config.api + uri, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(body),
    })
      .then(status)
      .then(json);
  }
}

export default new Fetcher();
