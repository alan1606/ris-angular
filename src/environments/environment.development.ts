export const environment = {
  production: false,
  BASE_SITE: 'http://localhost:4200/ris',
  BASE_ENDPOINT: 'https://ris.diagnocons.com/api',
  post_logout_redirect_uri: 'http://localhost:4200/ris/logout',
  redirect_uri: 'http://localhost:4200/ris/authorized?method=get',
  turneroSocket: 'http://172.17.200.235:8002/shifts-websocket',
  chatSocket: 'https://ris.diagnocons.com/api/whatsapp-web/wp-web-websocket',
};
