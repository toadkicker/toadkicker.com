module.exports = function(grunt) {
  grunt.initConfig({
    
    clean: ['dist'],

    copy: {
      all: {
        src: ['*.css', '*.html', '*.png', '*.ico', "*.svg", '!Gruntfile.js'],
        dest: 'dist/',
      },
    },

    browserify: {
      all: {
        src: 'main.js',
        dest: 'dist/main.js'
      },
      options: {
        transform: ['debowerify']
      }
    },

    connect: {
      options: {
        port: process.env.PORT || 3131,
        base: 'dist/',
      },

      all: {},
    },

    watch: {
      options: {
        livereload: true
      },

      html: {
        files: '<%= ejs.all.src %>',
        tasks: ['ejs'],
      },

      js: {
        files: '<%= browserify.all.src %>',
        tasks: ['browserify'],
      },

      assets: {
        files: ['assets/**/*', '*.css', '*.js', 'images/**/*', 'img/**/*', '!Gruntfile.js'],
        tasks: ['copy'],
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
  grunt.loadNpmTasks('grunt-purifycss');

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  
  grunt.registerTask('default', ['clean', 'browserify', 'copy', 'purifycss']);
  
  grunt.registerTask('server', ['default', 'connect', 'watch']);

};
