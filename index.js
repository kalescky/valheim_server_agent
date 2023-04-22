import { queryGameServerInfo } from 'steam-server-query';

queryGameServerInfo('34.209.244.112:2457').then(infoResponse => {
  console.log(infoResponse);
}).catch((err) => {
  console.error(err);
});