import { NgModule, ModuleWithProviders } from '@angular/core';
import { RecaptchaComponent } from './recaptcha.component';
import { SITE_KEY } from './recaptcha.tokens';

export * from './recaptcha.component';
export * from './recaptcha.tokens';
export interface RecaptchaModuleConfig {
  siteKey: string;
}

@NgModule({
  declarations: [RecaptchaComponent],
  exports: [RecaptchaComponent],
})
export class RecaptchaModule {
  static forRoot({ siteKey }: RecaptchaModuleConfig): ModuleWithProviders {
    return {
      ngModule: RecaptchaModule,
      providers: [{ provide: SITE_KEY, useValue: siteKey }],
    };
  }
}
