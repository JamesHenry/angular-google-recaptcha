import { TestBed, async } from '@angular/core/testing';

import { RecaptchaModule } from '../src/recaptcha/recaptcha.module';
import { RECAPTCHA_CONFIG } from '../src/recaptcha/recaptcha.tokens';

describe('RecaptchaModule', () => {
  const mockRecaptchaConfig = {
    siteKey: 'abc123',
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RecaptchaModule.forRoot(mockRecaptchaConfig)],
    });
  });
  it('should set the RECAPTCHA_CONFIG token based on the configuration given in the forRoot method', () => {
    expect(TestBed.get(RECAPTCHA_CONFIG)).toEqual(mockRecaptchaConfig);
  });
});
