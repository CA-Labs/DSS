module.exports = function (grunt) {

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            my_target: {
                options: {
                    sourceMap: true,
                    sourceMapName: 'dss/app.min.map',
                    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                        'author: <%= pkg.author %> - ' +
                        '<%= grunt.template.today("yyyy-mm-dd") %> */'
                },
                files: {
                    'dss/app.min.js': [
                        'dss/app.js',
                        'dss/controllers/bsoia-controller.js',
                        'dss/controllers/toia-controller.js',
                        'dss/controllers/ta-controller.js',
                        'dss/controllers/risks-controller.js',
                        'dss/controllers/treatments-controller.js',
                        'dss/controllers/main-controller.js',
                        'dss/services/assets-service.js',
                        'dss/services/risks-service.js',
                        'dss/services/arangodb-service.js',
                        'dss/services/treatments-service.js',
                        'dss/common/filters.js',
                        'dss/common/mainInterfaces.js',
                        'dss/requirements/requirementsInterfacesDirective.js',
                        'dss/directives/*.js'
                    ]
                }
            }
        },
        watch: {
            files: ['dss/*', 'dss/*/*.js'],
            tasks: ['uglify'],
            options: {
                nospawn: true
            }
        }
    });

    // Load packages
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Tasks
    grunt.registerTask('default', ['watch']);
};
