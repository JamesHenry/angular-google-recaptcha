[![Travis](https://img.shields.io/travis/JamesHenry/angular-google-recaptcha.svg?style=flat-square)](https://travis-ci.org/JamesHenry/angular-google-recaptcha)
[![GitHub license](https://img.shields.io/npm/l/angular-google-recaptcha.svg?style=flat-square)](https://github.com/JamesHenry/angular-google-recaptcha/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/v/angular-google-recaptcha.svg?style=flat-square)](https://www.npmjs.com/package/angular-google-recaptcha) [![npm](https://img.shields.io/npm/dt/angular-google-recaptcha.svg?style=flat-square)](https://www.npmjs.com/package/angular-google-recaptcha)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)

<h1 align="center">Angular Google reCAPTCHA</h1>

Google's reCAPTCHA is an awesome, UX-friendly way of ensuring that the users who are submitting your forms are actually humans...

Angular has fantastic built in forms functionality which makes it easy to write powerful custom components and validation logic...

This library makes it effortless to combine them!

# Installation

Head over to the command line and use your favourite package manager to install and save it as a dependency:

E.g.

```bash
npm install --save angular-google-material
```

or

```bash
yarn add angular-google-material
```

# Usage

1. If you haven't yet registered your site for use with reCAPTCHA, you'll need to do that next.

Head over to:

[https://www.google.com/recaptcha/admin#list](https://www.google.com/recaptcha/admin#list)

...and register your site.

Once you have done that, a **"site key"** will have been generated for you. You need to find this and copy it to you clipboard as it will be important in the next step!

2. Now all you need to do is pass that site key into the library, and this is done via the `forRoot` convention on the `NgModule` which the library exposes.

E.g.

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RecaptchaModule } from 'angular-google-recaptcha';

@NgModule({
    imports: [
        BrowserModule,
        RecaptchaModule.forRoot({
            siteKey: 'YOUR_SITE_KEY_HERE',
        }),
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

As you might expect, you need to be using the `@angular/forms` package (either the `FormsModule` or `ReactiveFormsModule`) within your project, otherwise this library will have nothing to hook into.

3. With everything wired up, you can now use the `<recaptcha>` component!

E.g. For reactive forms

```ts
import { Component } from '@angular/core';

@Component({
    selector: 'app',
    template: `
        <recaptcha
          [formControl]="myRecaptcha"
          (scriptLoad)="onScriptLoad()"
          (scriptError)="onScriptError()"
        ></recaptcha>
    `
})
export class AppComponent {
    myRecaptcha = new FormControl(false);

    onScriptLoad() {
        console.log('Google reCAPTCHA loaded and ready for use!')
    }

    onScriptError() {
        console.log('Something went long when loading the Google reCAPTCHA')
    }
}
```

E.g. For template-driven forms

```ts
import { Component } from '@angular/core';

@Component({
    selector: 'app',
    template: `
        <recaptcha
          [(ngModel)]="myRecaptcha"
          (scriptLoad)="onScriptLoad()"
          (scriptError)="onScriptError()"
        ></recaptcha>
    `
})
export class AppComponent {
    myRecaptcha: boolean

    onScriptLoad() {
        console.log('Google reCAPTCHA loaded and ready for use!')
    }

    onScriptError() {
        console.log('Something went long when loading the Google reCAPTCHA')
    }
}
```

[![forthebadge](http://forthebadge.com/images/badges/built-with-love.svg)](http://forthebadge.com)
