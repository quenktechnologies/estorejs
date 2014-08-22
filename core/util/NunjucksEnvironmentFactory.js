/**
 * NunjucksEnvironmentFactory is a factory object for a nunjucks environment.
 * @class NunjucksEnvironmentFactory
 * @constructor
 *
 */
module.exports = function NunjucksEnvironmentFactory() {

	var self = {};


	/**
	 * getEnvironment returns a preconfigured Environment.
	 *
	 * @method getEnvironment
	 * @param {String} path The path to the nunjucks templates.
	 * @param {Express} app The express app.
	 * @return {Environment}
	 *
	 */
	self.getEnvironment = function(path, app) {

		var nunjucks = require('nunjucks');
		var env = new nunjucks.Environment(new nunjucks.FileSystemLoader(
			path), {
			autoescape: true,
			tags: {
				variableStart: '<$',
				variableEnd: '$>'
			}
		});

		env.express(app);

		return env;



	};



	return self;


};
