module.exports = function (grunt) {

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            my_target: {
                options: {
                    sourceMap: true,
                    sourceMapName: 'foxx/dss/app.min.map',
                    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                        'author: <%= pkg.author %> - ' +
                        '<%= grunt.template.today("yyyy-mm-dd") %> */'
                },
                files: {
                    'foxx/dss/app.min.js': [
                        'foxx/dss/app.js',
                        'foxx/dss/controllers/bsoia-controller.js',
                        'foxx/dss/controllers/toia-controller.js',
                        'foxx/dss/controllers/ta-controller.js',
                        'foxx/dss/controllers/risks-controller.js',
                        'foxx/dss/controllers/main-controller.js',
                        'foxx/dss/services/assets-service.js',
                        'foxx/dss/services/risks-service.js',
                        'foxx/dss/services/arangodb-service.js',
                        'foxx/dss/common/filters.js',
                        'foxx/dss/common/mainInterfaces.js',
                        'foxx/dss/requirements/requirementsController.js',
                        'foxx/dss/requirements/requirementsInterfacesDirective.js',
                        'foxx/dss/directives/*.js'
                    ]
                }
            }
        },
        watch: {
            files: ['foxx/dss/*', 'foxx/dss/*/*.js'],
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