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
                        'foxx/dss/assets/assetsController.js',
                        'foxx/dss/common/baseController.js',
                        'foxx/dss/common/dssFactories.js',
                        'foxx/dss/common/filters.js',
                        'foxx/dss/common/mainController.js',
                        'foxx/dss/common/mainInterfaces.js',
                        'foxx/dss/requirements/requirementsController.js',
                        'foxx/dss/requirements/requirementsInterfacesDirective.js',
                        'foxx/dss/risks/risksController.js'
                    ]
                }
            }
        },
        watch: {
            files: ['<config:uglify.my_target.files["dss/app.min.js"]>'],
            tasks: ['uglify']
        }

    });

    // Load packages
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Tasks
    grunt.registerTask('default', ['uglify']);
};