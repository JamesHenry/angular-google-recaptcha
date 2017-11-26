import { InjectionToken } from '@angular/core';

export const RECAPTCHA_CONFIG = new InjectionToken<string>(
  'angular-google-recaptcha siteKey',
);
