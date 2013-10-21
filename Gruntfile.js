'use strict';

module.exports = function (grunt) {
  var serverPort = 4000;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    banner: '/*! \n* <%= pkg.title || pkg.name %> - v<%= pkg.version %>' +
            '\n* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %> ' +
            '\n* <%= pkg.homepage ? pkg.homepage : "" %> ' +
            '\n*/ \n\n',

    paths: {
      lib: "lib/",
      tests: "test/",
      dist: "dist/",
      vendor: "vendor/"
    },

    watch: {
      all: {
        files: ["<%= paths.lib %>**/*"],
        tasks: ['watcher']
      },
      tests: {
        files: ["<%= paths.tests %>**/*", "<%= paths.lib %>**/*"],
        tasks: ['tester']
      }
    },

    builder: {
      lib: {
        src: "<%= paths.lib %>index.js",
        dest: "<%= paths.dist %>engine.js"
      },
      all: {
        src: "<%= paths.lib %>index.js",
        dest: "<%= paths.dist %>oaky.js"
      },
      tests: {
        files: {
          '<%= paths.tests %>engine.test.js': '<%= paths.tests %>runner.js'
        }
      }
    },

    concat: {
      vendor: {
        src: [ '<%= paths.vendor %>**/*.js' ],
        dest: '<%= paths.dist %>vendor.js'
      },
      app: {
        options: {
          stripBanners: {
            line: true
          },
          banner: '<%= banner %>',
        },
        files: {
          '<%= paths.dist %>oaky.js': [ '<%= paths.dist %>oaky.js' ]
        }
      }
    },

    uglify: {
      all: {
        options: {
          stripBanners: {
            line: true
          },
          banner: '<%= banner %>',
        },
        files: {
          '<%= paths.dist %>oaky.min.js': [ '<%= paths.dist %>oaky.js' ]
        }
      }
    },

    jshint: {
      all: {
        files: {
          src: ["<%= paths.lib %>**/*.js"]
        },
        options: {
            bitwise: true
          , curly: true
          , eqeqeq: true
          , forin: true
          , immed: true
          , latedef: true
          , newcap: true
          , noempty: true
          , nonew: true
          , quotmark: false
          , undef: true
          , unused: true
          , laxcomma: true

          , globals: {
              window: true
            , document: true
            , require: true
            , module: true
            , $: true
            , jQuery: true
            , _: true
            , Howl: true
            , Howler: true
            , console: true
            , moment: true
            , oaky: true
          }
        }
      }
    },

    mocha_phantomjs: {
      options: {
        'reporter': 'spec'
      },
      all: ["<%= paths.tests %>tests.html"]
    }

  });

  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks('grunt-mocha-phantomjs');
  
  require("./builder.grunt.js")(grunt);

  grunt.registerTask("build", [
    "jshint",
    "concat",
    "builder:all"
  ]);

  grunt.registerTask("test", [
    "default",
    "builder:tests",
    "mocha_phantomjs"
  ]);

  grunt.registerTask("watcher", [ "build" ] );
  grunt.registerTask("tester", [ "test" ] );

  grunt.registerTask("default", "build");
  
  grunt.registerTask("w", ["watcher", "watch:all"]);
  grunt.registerTask("t", ["tester", "watch:tests"]);

  grunt.registerTask("dist", ["build", "uglify"]);

};