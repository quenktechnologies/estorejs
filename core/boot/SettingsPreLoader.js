var fetch = require('promised-mongo');
/**
 * SettingsPreLoader loads the settings before the application starts.
 *
 * NOTE: Uses the promise-mongo library as we can't load from mongoose
 * before keystone starts.
 * @alias SettingsPreLoader
 * @memberOf core/boot
 * @param {String} uri The mongo uri string.
 * @param {Mediator} mediator
 * @constructor
 *
 */
module.exports = function SettingsPreLoader(uri, mediator) {

	/**
	 * load the settings.
	 *
	 * @return {Promise}
	 */
	this.load = function() {

		var db = fetch(uri, ['settings']);

		return db.settings.findOne().
		then(function(settings) {

			mediator.onSettingsChanged(settings);
		});


	};




};
