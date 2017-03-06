module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                //separator: ';'
            },
            allInOne: { //所有JS文件全部合并成一份文件
                src: ['app/js/**/*.js'],
                dest: 'app/javascript/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            dist: {
              files: {
                'app/javascript/<%=pkg.name %>.min.js': ['<%= concat.allInOne.dest %>']
              }
            }
        },
        watch: {

            javascript: {
                files: ['app/js/**/*.js'],
                tasks: ['concat:allInOne', 'uglify:dist'],
                options: {
                   livereload:true,

                    interrupt: true
                }
            },
            express: {
              files: ['main.js'],
              options: {
                spawn: false
              }
            }
        },
        express: {
          options: {

          },
          dev: {
            options: {
              script: 'main.js'
            }
          }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');


    grunt.registerTask('default', ['concat', 'uglify','express','watch']);
};
