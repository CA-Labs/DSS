module.exports = function (grunt) {

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            my_target: {
                options: {
                    sourceMap: true,
                    sourceMapName: 'frontend/app.min.map',
                    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                        'author: <%= pkg.author %> - ' +
                        '<%= grunt.template.today("yyyy-mm-dd") %> */'
                },
                files: {
                    'frontend/app.min.js': [
                        'frontend/app.js',
                        'frontend/controllers/bsoia-controller.js',
                        'frontend/controllers/toia-controller.js',
                        'frontend/controllers/ta-controller.js',
                        'frontend/controllers/risks-controller.js',
                        'frontend/controllers/treatments-controller.js',
                        'frontend/controllers/crud-controller.js',
                        'frontend/controllers/main-controller.js',
                        'frontend/controllers/cloud-controller.js',
                        'frontend/controllers/buttons-controller.js',
                        'frontend/services/assets-service.js',
                        'frontend/services/risks-service.js',
                        'frontend/services/arangodb-service.js',
                        'frontend/services/arangodb-client.js',
                        'frontend/services/treatments-service.js',
                        'frontend/services/cloud-service.js',
                        'frontend/factories/d3-factory.js',
                        'frontend/common/filters.js',
                        'frontend/common/mainInterfaces.js',
                        'frontend/directives/*.js'
                    ]
                }
            }
        },
        watch: {
            files: ['frontend/{con,s,d}*/*.js'],
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
