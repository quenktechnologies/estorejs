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
			focus: grunt.option('focus'),
			watch: grunt.option('watch'),
		},
		debug: {
			options: {
				open: false // do not open node-inspector in Chrome automatically
			}
		},
		browserify: {
			build: {
				files: {
					'<%= config.dest %>': ['<%= config.src+"/**/*.js" %>', ]
				},
				options: {
					debug: true,
					watch: '<%= config.watch %>',
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
					plugin: [
						['minifyify', {
							map: grunt.option('map'),
							output: grunt.option('dest') + '.json',
						}]
					]

				}


			}



		},
		html2js: {
			options: {

				module: 'seller.templates',
				base: 'public/',
				quoteChar: '\'',
				singleModule: true,
				rename: function(n) {

					return '/' + n;

				},
				collapseBooleanAttributes: true,
				collapseWhitespace: true,
				removeAttributeQuotes: true,
				removeComments: true,
				removeEmptyAttributes: true,
				removeRedundantAttributes: true,
				removeScriptTypeAttributes: true,
				removeStyleLinkTypeAttributes: true


			},
			templates: {
				src: ['public/assets/partials/seller/**/*.html'],
				dest: 'scripts/templates/index.js'

			},
			main: {
				files: ['<%= config.src+"/*/*.js" %>'],
				dest: '<%= config.dest %>'
			}



		},
		less: {
			build: {
				options: {
					sourceMap: '<%= config.map %>',
				},

				files: {

					"public/assets/css/main.css": "less/index.less"

				}

			}

		},

		watch: {

			install: {
				files: ['<%= config.src+"/*.js" %>', '<%= config.src+"/*/*.js" %>'],
				tasks: ['browserify:install']
			},
			build: {
				files: ['<%= config.focus+"/**/*.js" %>'],
				tasks: ['browserify:build']

			},
			templates: {
				files: ['public/assets/partials/seller/**/*.html'],
				tasks: ['html2js:templates']

			},
			template: {

				files: ['<%= config.src+"/*/*.js" %>'],
				tasks: ['html2js:main'],

			},
			less: {
				files: ['less/*.less'],
				tasks: ['less:build']
			}

		},

		concurrent: {
			templates: {
				tasks: ['watch:templates'],
				options: {
					logConcurrentOutput: true
				}
			}
		},
	});
	grunt.option('stack', true);
	grunt.loadNpmTasks('grunt-html2js');
	grunt.loadNpmTasks('grunt-debug-task');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.registerTask('install', ['watch:install']);
	grunt.registerTask('build', ['watch:build']);
	grunt.registerTask('default', ['install']);


};
