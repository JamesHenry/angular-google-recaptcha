import {
  ControlValueAccessor,
  AbstractControl,
  NgControl,
} from '@angular/forms';
import {
  Inject,
  Output,
  EventEmitter,
  Component,
  ViewChild,
  ElementRef,
  Self,
  Optional,
  OnInit,
  NgZone,
  ChangeDetectorRef,
  Injectable,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';

import { SITE_KEY } from './recaptcha.tokens';

export interface InjectAndLoadScriptConfig {
  scriptSrc: string;
  onLoadCallback(): void;
  onErrorCallback(err: ErrorEvent): void;
}

@Injectable()
export class ScriptLoaderService {
  injectAndLoadScript(config: InjectAndLoadScriptConfig) {
    const script = document.createElement('script');
    script.src = config.scriptSrc;
    script.async = true;
    script.defer = true;
    script.onload = () => config.onLoadCallback();
    script.onerror = err => config.onErrorCallback(err);
    document.body.appendChild(script);
  }
}

@Component({
  selector: 'recaptcha',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="angular-google-recaptcha-container" #container></div>
  `,
  providers: [ScriptLoaderService],
})
export class RecaptchaComponent
  implements OnInit, OnDestroy, ControlValueAccessor {
  @Output() scriptLoad = new EventEmitter<void>();
  @Output() scriptError = new EventEmitter<ErrorEvent>();

  @ViewChild('container') container: ElementRef;

  private readonly GLOBAL_ON_LOAD_CALLBACK_NAME = '___recaptchaOnLoadCallback___';
  private onChange: (val: true | false) => void;
  private onTouched: () => void;
  private activeRecaptchaId: string;
  private recaptchaAPI: {
    render: (elementId: string, opts: any) => string;
    getResponse: (widgetId: string) => any;
  };

  constructor(
    @Inject(SITE_KEY) private siteKey: string,
    @Self()
    @Optional()
    private controlDir: NgControl,
    private scriptLoaderService: ScriptLoaderService,
    private zone: NgZone,
    private cd: ChangeDetectorRef,
  ) {
    this.controlDir.valueAccessor = this;
  }

  ngOnInit() {
    const control = this.controlDir.control;
    if (!control) {
      return;
    }
    this.setGlobalHandlers();
    this.injectGoogleRecaptchaScript();
    /**
     * Only one validator (specifically our one below) makes sense for this Control, so we just overwrite
     * whatever was previously set
     */
    control.setValidators((ctrl: AbstractControl) => {
      if (typeof this.activeRecaptchaId === 'undefined' || !this.recaptchaAPI) {
        return {
          invalidRecaptcha: true,
        };
      }
      const recaptchaResponse = this.recaptchaAPI.getResponse(
        this.activeRecaptchaId,
      );
      if (!recaptchaResponse) {
        return {
          invalidRecaptcha: true,
        };
      }
      return null;
    });
    control.updateValueAndValidity();
  }

  ngOnDestroy() {
    this.unsetGlobalHandlers();
  }

  /**
   * There is currently no way to programmatically set the value of
   * a visible reCAPTCHA, so this is a noop
   */
  writeValue(val: any): void {}

  /**
   * Required method of the ControlValueAccessor interface, we register the callback
   * function that should be called whenever the model value changes
   */
  registerOnChange(fn: (val: any) => void): void {
    this.onChange = fn;
  }

  /**
   * Required method of the ControlValueAccessor interface, we register the callback
   * function that should be called whenever the control is "touched"
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Unfortunately we have to register a global handler for the onload
   * event from the recaptcha lib
   */
  private setGlobalHandlers(): void {
    (window as any)[this.GLOBAL_ON_LOAD_CALLBACK_NAME] = () => {
      /**
       * Make it easier to add type information to, and work with, the recaptcha lib
       * by storing a single reference to it
       */
      this.recaptchaAPI = (window as any).grecaptcha;
      this.renderRecaptcha();
    };
  }

  private unsetGlobalHandlers(): void {
    delete (window as any)[this.GLOBAL_ON_LOAD_CALLBACK_NAME];
  }

  /**
   * Create a <script> element and inject it into the page in order
   * to load the recaptcha lib. Emit load or error events from the relevant
   * Outputs to the component
   */
  private injectGoogleRecaptchaScript(): void {
    this.scriptLoaderService.injectAndLoadScript({
      scriptSrc: `https://www.google.com/recaptcha/api.js?render=explicit&onload=${
        this.GLOBAL_ON_LOAD_CALLBACK_NAME
      }`,
      onLoadCallback: () => this.scriptLoad.emit(),
      onErrorCallback: err => this.scriptError.emit(err),
    });
  }

  /**
   * Use the recaptcha lib to manually render a recaptcha widget with the ViewChild
   * container element, passing the relevant callbacks and configuration options
   */
  private renderRecaptcha(): void {
    if (!this.recaptchaAPI) {
      return;
    }
    this.activeRecaptchaId = this.recaptchaAPI.render(
      this.container.nativeElement,
      {
        sitekey: this.siteKey,
        callback: this.onRecaptchaValidCallback.bind(this),
        'expired-callback': this.onRecaptchaExpiredCallback.bind(this),
      },
    );
  }

  /**
   * Handler which will be registered with the recaptcha lib to be called
   * whenever it has a valid status
   */
  private onRecaptchaValidCallback(): void {
    this.zone.run(() => {
      this.onChange(true);
      this.onTouched();
      this.cd.markForCheck();
    });
  }

  /**
   * Handler which will be registered with the recaptcha lib to be called
   * whenever its valid status expires
   */
  private onRecaptchaExpiredCallback(): void {
    this.zone.run(() => {
      this.onChange(false);
      this.cd.markForCheck();
    });
  }
}
