"use strict"




module.exports = (grunt, options) ->
  pkg = grunt.file.readJSON('package.json')
  require('load-grunt-tasks') grunt

  options =
    paths: null # UNIMPLEMENTED




  ###### PLUGIN CONFIGURATIONS ######
  grunt.initConfig
    options: options

    pkg: pkg

    # grunt-contrib-watch
    watch:
      extras:
        files: ['src/*.coffee']
        tasks: ['build-extras']


    clean:
      dist:
        ['dist/*']

    coffee:
      extras:
        expand: true,
        flatten: true,
        cwd: 'src',
        src: ['*.coffee'],
        dest: 'dist',
        ext: '.js'
      extrasmin:
        expand: true,
        flatten: true,
        cwd: 'src',
        src: ['*.coffee'],
        dest: 'dist',
        ext: '.min.js'

    concat:
      options:
        separator: '\n'
      dist:
        src: ['src/MooogAudioNode.litcoffee',  'src/nodes/*.litcoffee', 'src/Mooog.litcoffee'],
        dest: 'src/index.litcoffee',


    coffeelint:
      app: ['src/*.coffee']
      options:
        max_line_length:
          "value": 100,
          "level": "error",
          "limitComments": true


    uglify: {
      mooog: {
        files: [{
          expand: true,
          cwd: 'dist',
          src: '*.min.js',
          dest: 'dist'
        }]
      }
    }

  ######### TASK DEFINITIONS #########


  # concat and lint
  grunt.registerTask 'build-extras', [
    'clean'
    'coffeelint'
    'coffee:extras'
    'coffee:extrasmin'
    'uglify'
  ]
  # build, docs
  grunt.registerTask 'prod', [
    'concat'
    'clean:dist'
    'coffee'
    'clean:temp'
    'uglify'
  ]

  grunt.registerTask 'extras', [
    'build-extras'
    'watch:extras'
  ]

  grunt.registerTask 'default', ['extras']
