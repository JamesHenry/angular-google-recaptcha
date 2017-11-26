import {
  TestBed,
  async,
  fakeAsync,
  tick,
  ComponentFixture,
} from '@angular/core/testing';
import { Component, Type } from '@angular/core';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';

import { RecaptchaModule } from '../src/recaptcha/recaptcha.module';
import {
  RecaptchaComponent,
  ScriptLoaderService,
  InjectAndLoadScriptConfig,
} from '../src/recaptcha/recaptcha.component';

const mockSiteKey = 'abc123';

describe('RecaptchaComponent', () => {
  describe('@Input integration tests', () => {
    it('should support ngModel', () => {
      expect.assertions(1);
      const fixture = createOuterComponentFixture({
        component: NgModelStandaloneComponent,
        scriptSuccessfullyLoaded: true,
      });
      fixture.detectChanges();
      const recaptchaComponentInstance =
        fixture.debugElement.children[0].componentInstance;
      recaptchaComponentInstance.onRecaptchaValidCallback();
      expect(fixture.componentInstance.recaptcha).toEqual(true);
    });

    it('should support formControl', () => {
      expect.assertions(1);
      const fixture = createOuterComponentFixture({
        component: FormControlStandaloneComponent,
        scriptSuccessfullyLoaded: true,
      });
      fixture.detectChanges();
      const recaptchaComponentInstance =
        fixture.debugElement.children[0].componentInstance;
      recaptchaComponentInstance.onRecaptchaValidCallback();
      expect(fixture.componentInstance.recaptcha.value).toEqual(true);
    });
  });

  describe('@Output integration tests', () => {
    it('should call the given scriptLoad callback after successfully loading the reCAPTCHA script', () => {
      expect.assertions(1);
      const fixture = createOuterComponentFixture({
        component: OutputTestsComponent,
        scriptSuccessfullyLoaded: true,
      });
      fixture.detectChanges();
      expect(fixture.componentInstance.onScriptLoad).toHaveBeenCalled();
    });

    it('should call the given scriptError callback if the reCAPTCHA script fails to load', () => {
      expect.assertions(1);
      const fixture = createOuterComponentFixture({
        component: OutputTestsComponent,
        scriptSuccessfullyLoaded: false,
      });
      fixture.detectChanges();
      expect(fixture.componentInstance.onScriptError).toHaveBeenCalled();
    });

    describe('Other tests', () => {
      it('should have the siteKey provided in the module forRoot() available', () => {
        expect.assertions(1);
        const fixture = createOuterComponentFixture({
          component: NgModelStandaloneComponent,
          scriptSuccessfullyLoaded: true,
        });
        fixture.detectChanges();
        const recaptchaComponentInstance =
          fixture.debugElement.children[0].componentInstance;
        expect(recaptchaComponentInstance.recaptchaConfig.siteKey).toEqual(
          mockSiteKey,
        );
      });
    });
  });
});

const injectAndLoadScript_LoadSuccess = (config: InjectAndLoadScriptConfig) =>
  config.onLoadCallback();

const injectAndLoadScript_LoadError = (config: InjectAndLoadScriptConfig) =>
  config.onErrorCallback(new ErrorEvent('foo'));

function createOuterComponentFixture<T>({
  component,
  scriptSuccessfullyLoaded,
}: {
  component: Type<T>;
  scriptSuccessfullyLoaded: boolean;
}): ComponentFixture<T> {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    declarations: [component],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      RecaptchaModule.forRoot({
        siteKey: mockSiteKey,
      }),
    ],
  });
  TestBed.overrideProvider(ScriptLoaderService, {
    useValue: {
      injectAndLoadScript: scriptSuccessfullyLoaded
        ? injectAndLoadScript_LoadSuccess
        : injectAndLoadScript_LoadError,
    },
  });
  return TestBed.createComponent(component);
}

@Component({
  selector: 'ng-model-standalone',
  template: `
    <recaptcha [(ngModel)]="recaptcha"></recaptcha>
  `,
})
class NgModelStandaloneComponent {
  recaptcha: boolean;
}

@Component({
  selector: 'form-control-standalone',
  template: `
    <recaptcha [formControl]="recaptcha"></recaptcha>
  `,
})
class FormControlStandaloneComponent {
  recaptcha = new FormControl(false);
}

@Component({
  selector: 'output-tests',
  template: `
    <recaptcha
      [(ngModel)]="recaptcha"
      (scriptLoad)="onScriptLoad()"
      (scriptError)="onScriptError()"
    ></recaptcha>
  `,
})
class OutputTestsComponent {
  recaptcha: boolean;
  onScriptLoad = jest.fn();
  onScriptError = jest.fn();
}
