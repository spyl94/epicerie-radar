require('es6-promise').polyfill();
require('isomorphic-fetch');

fetch('https://api.github.com/repos/spyl94/epicerie-radar/issues', {
  method: 'POST',
  headers: {
    Authorization: 'token fbc8afa6399f01bde41c17058a45243f5dc7e0d2',
    'User-Agent': 'Epicerie Radar',
    'Content-Type': 'application/json; charset=utf-8',
  },
  body: JSON.stringify({
    title: 'Nouvelles informations',
    body: 'Plop',
  }),
})
.catch(e => {
  console.error(e);
});
