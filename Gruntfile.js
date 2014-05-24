module.exports = function (grunt) {

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            my_target: {
                options: {
                    sourceMap: true,
                    sourceMapName: 'app/app.min.map',
                    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                        'author: <%= pkg.author %> - ' +
                        '<%= grunt.template.today("yyyy-mm-dd") %> */'
                },
                files: {
                    'app/app.min.js': [
                        'app/app.js',

                        'app/common/filters.js',
                        'app/common/dssFactories.js',

                        'app/common/baseController.js',

                        'app/assets/assetsController.js',

                        'requirements/requiremetnsController.js',
                        'requirements/requiremetnsInterfacesDirective.js'
                    ]
                }
            }
        },
        watch: {
            files: ['<config:uglify.my_target.files["app/app.min.js"]>'],
            tasks: ['uglify']
        }

    });

    // Load packages
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Tasks
    grunt.registerTask('default', ['uglify']);
};