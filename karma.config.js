// Karma configuration
// Generated on Mon Jul 28 2014 11:42:59 GMT+0200 (CEST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        // js files required by the app
        'frontend/components/jquery/dist/jquery.min.js',
        'frontend/components/jquery-ui/jquery-ui.min.js',
        'frontend/components/ng-file-upload/angular-file-upload-shim.js',
        'frontend/components/angular/angular.js',
        'frontend/components/ngstorage/ngStorage.min.js',
        'frontend/components/bootstrap/dist/js/bootstrap.js',
        'frontend/components/nouislider/jquery.nouislider.js',
        'frontend/components/nouislider/Link.js',
        'frontend/components/angular-nouislider/src/nouislider.js',
        'frontend/components/angular-flash/dist/angular-flash.min.js',
        'frontend/components/underscore/underscore.js',
        'frontend/components/select2/select2.min.js',
        'frontend/components/angular-dragdrop/draganddrop.js',
        'frontend/components/angular-loading-bar/src/loading-bar.js',
        'frontend/components/ng-file-upload/angular-file-upload.js',
        'frontend/components/x2js/xml2json.js',
        'frontend/components/bootstrap-switch/dist/js/bootstrap-switch.js',
        'frontend/components/angular-bootstrap-switch/dist/angular-bootstrap-switch.js',
        // app js files
        'frontend/app.min.js',
        'frontend/controllers/bsoia-controller.js',
        'frontend/controllers/toia-controller.js',
        'frontend/controllers/ta-controller.js',
        'frontend/controllers/risks-controller.js',
        'frontend/controllers/treatments-controller.js',
        'frontend/controllers/main-controller.js',
        'frontend/services/assets-service.js',
        'frontend/services/risks-service.js',
        'frontend/services/arangodb-service.js',
        'frontend/services/treatments-service.js',
        'frontend/common/filters.js',
        'frontend/common/mainInterfaces.js',
        'frontend/directives/*.js',
        // test js files
        'frontend/components/angular-mocks/angular-mocks.js',
        'frontend/components/jasmine-underscore/lib/jasmine-underscore.js',
        'test/spec/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
