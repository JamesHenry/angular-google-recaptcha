export default {
  /**
   * https://github.com/rollup/rollup/wiki/Troubleshooting#treating-module-as-external-dependency
   */
  external: ['@angular/core', '@angular/forms'],
  /**
   * The single-file output from the Angular Compiler
   * is our input to rollup
   */
  entry: 'build/angular-google-recaptcha.js',
  format: 'es',
};
