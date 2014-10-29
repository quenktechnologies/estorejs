'use strict()';
var config = {
	port: 3000
};
module.exports = function(grunt) {

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		config: {

			src: grunt.option('src'),
			dest: grunt.option('dest'),
			map: grunt.option('map'),
			watch: grunt.option('watch'),
			inspector: grunt.option('inspector')
		},
		debug: {
			options: {
				open: '<%= config.inspector %>' || false
			}
		},
		browserify: {
			build: {
				files: {
					'<%= config.dest %>': ['<%= config.src+"/**/*.js" %>', ]
				},
				options: {
					debug: true,
					transform: [require('partialify')]
				}
			},
			install: {
				files: {
					'<%= config.dest %>': ['<%= config.src+"/**/*.js" %>',
						'<%= config.src+"/*.js" %>'
					]
				},
				options: {
					debug: true,
					transform: [require('partialify')],
					plugin: [
						['minifyify', {
							map: grunt.option('map'),
							output: grunt.option('dest') + '.json',
						}]
					]

				}


			}



		},
		less: {
			build: {
				options: {
					sourceMap: '<%= config.map %>',
				},

				files: {

					'public/assets/css/main.css': 'less/index.less'

				}

			}

		},

		watch: {

			install: {
				files: ['<%= config.src+"/*.js" %>', '<%= config.src+"/*/*.js" %>'],
				tasks: ['browserify:install']
			},
			build: {
				files: ['<%= config.watch+"/**/*.js" %>'],
				tasks: ['browserify:build']

			},
			less: {
				files: ['less/*.less'],
				tasks: ['less:build']
			}

		},
	});
	grunt.option('stack', true);
	grunt.loadNpmTasks('grunt-debug-task');
	grunt.registerTask('install', ['watch:install']);
	grunt.registerTask('build', ['watch:build']);
	grunt.registerTask('default', ['install']);


};
