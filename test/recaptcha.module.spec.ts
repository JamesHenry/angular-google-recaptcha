import { TestBed, async } from '@angular/core/testing';

import { RecaptchaModule } from '../src/recaptcha/recaptcha.module';
import { SITE_KEY } from '../src/recaptcha/recaptcha.tokens';

describe('RecaptchaModule', () => {
  const mockSiteKey = 'abc123';
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RecaptchaModule.forRoot({ siteKey: mockSiteKey })],
    });
  });
  it('should set the SITE_KEY token based on the configuration given in the forRoot method', () => {
    expect(TestBed.get(SITE_KEY)).toEqual(mockSiteKey);
  });
});
