// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:4006',
  scheduleApiUrl: 'http://localhost:4008',
  //apiUrl: '/api',
  patientUrl: 'http://localhost:4000',
  adminUrl: 'http://localhost:4006',
  appointmentUrl: 'http://localhost:4007',
  keyCloakRedirectUrl: 'http://localhost:9000'
};
