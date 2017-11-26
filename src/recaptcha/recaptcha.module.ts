import { NgModule, ModuleWithProviders } from '@angular/core';
import { RecaptchaComponent } from './recaptcha.component';
import { RECAPTCHA_CONFIG } from './recaptcha.tokens';

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
  static forRoot(recaptchaConfig: RecaptchaModuleConfig): ModuleWithProviders {
    return {
      ngModule: RecaptchaModule,
      providers: [{ provide: RECAPTCHA_CONFIG, useValue: recaptchaConfig }],
    };
  }
}
