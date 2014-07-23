module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        uglify: {
            js: {
                files: {
                    'dist/angular-geohash.min.js': ['src/angular-geohash.js']
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['uglify:js']);
};
