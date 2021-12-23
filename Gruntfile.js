module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-purifycss');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

    //noinspection JSUnresolvedFunction,JSUnresolvedVariable
    grunt.initConfig({

    clean: ['dist'],

    copy: {
      all: {
        src: ['*.css', '*.html', '*.png', '*.ico', "*.svg", '!Gruntfile.js'],
        dest: 'dist/'
      }
    },

    browserify: {
      all: {
        src: 'main.js',
        dest: 'dist/main.js'
      }
    },

    uglify: {
      options: {
        compress: true
      },
      js: {
        files: {
          'dist/main.min.js': 'main.js'
        }
      }
    },
    cssmin: {
      dist: {
        files: {
          'dist/main.min.css': 'dist/main.css'
        }
      }
    },

    connect: {
      options: {
        port: process.env.PORT || 3131,
        base: 'dist/'
      },

      all: {}
    },

    watch: {
      options: {
        livereload: true
      },

      html: {
        files: ['*.html'],
        tasks: ['default']
      },

      js: {
        files: '<%= browserify.all.src %>',
        tasks: ['default']
      },

      assets: {
        files: ['assets/**/*', '*.css', '*.js', 'images/**/*', 'img/**/*', '!Gruntfile.js'],
        tasks: ['default']
      }
    },

    purifycss: {
      options: {},
      target: {
        src: ['index.html', 'main.js'],
        css: ['main.css'],
        dest: 'dist/main.min.css'
      }
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask('default', ['clean', 'browserify', 'copy', 'purifycss', 'uglify:js', 'cssmin:dist']);

  grunt.registerTask('server', ['default', 'connect', 'watch']);

};
