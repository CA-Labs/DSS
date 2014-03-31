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
                        ' - author: <%= pkg.author %> - ' +
                        '<%= grunt.template.today("yyyy-mm-dd") %> */'
                },
                files: {
                    'app/app.min.js': [
                        'app/app.js',

                        'app/common/filters.js',
                        'app/common/orientdbFactory.js',

                        'requirements/requiremetnsController.js',
                        'requirements/requiremetnsInterfacesDirective.js'
                    ]
                }
            }
        }

    });

    // Load packages
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Tasks
    grunt.registerTask('default', ['uglify']);
};