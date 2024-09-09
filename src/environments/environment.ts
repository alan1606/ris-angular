// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  BASE_SITE: 'https://ris.diagnocons.com/ris',
  BASE_ENDPOINT: 'https://ris.diagnocons.com/api',
  post_logout_redirect_uri: 'https://ris.diagnocons.com/ris/logout',
  redirect_uri: 'https://ris.diagnocons.com/ris/authorized?method=get',
  turneroSocket: 'https://ris.diagnocons.com/api/turnero/shifts-websocket',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
