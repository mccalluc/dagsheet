mxBasePath = 'https://unpkg.com/mxgraph@3.7.2-2/javascript/src';

require.config({
  // Karma serves files under /base, and our default is js
  baseUrl: '/base/js',

  paths: {
    test: '../test' // ie, up and over from js
  },

  // dynamically load all test files
  deps: Object.keys(window.__karma__.files).filter(function(file) {
    return file.match(/test\.js$/);
  }).map(function(file) {
    return file.replace(/\.js$/g, '');
  }),

  // start test run, once Require.js is done
  callback: window.__karma__.start
});