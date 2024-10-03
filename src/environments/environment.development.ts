export const environment = {
  production: false,
  BASE_SITE: 'http://localhost:4200/ris',
  BASE_ENDPOINT: 'http://localhost:8090/api',
  post_logout_redirect_uri: 'http://localhost:4200/ris/logout',
  redirect_uri: 'http://localhost:4200/ris/authorized?method=get',
  turneroSocket:  'https://ris.diagnocons.com/api/turnero/shifts-websocket',
  chatSocket: 'https://ris.diagnocons.com/api/whatsapp-web/wp-web-websocket',
};
