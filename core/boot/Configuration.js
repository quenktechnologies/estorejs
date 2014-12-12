/**
 * Configuration is a factory object for all application configuration data.
 *
 * It is composed of the settings object (fetched from db), the process.env and the theme settings.
 * Each of these addresses specific configuration aspects:
 * settings object: configuration data that can be changed during runtime.
 * process.env: static data used for accessing third party services or turning features on/off.
 * theme settings: static data about the current theme in use.
 * @alias Configuration
 * @memberOf
 * @constructor
 *
 */
module.exports = function Configuration() {

	var theme;
	var settings;
	var env = JSON.parse(JSON.stringify(process.env));

	/**
	 * getThemeProperties
	 *
	 * @return {ThemeProperties}
	 *
	 */
	this.getThemeProperties = function() {

		if (!theme)
			throw new Error('NOTHEMESETERROR()');

		return theme;

	};

	/**
	 * setThemeProperties
	 *
	 * @param {ThemeProperties} props
	 *
	 */
	this.setThemeProperties = function(props) {

		theme = props;

	};

	/**
	 * getSettings
	 *
	 * @return {Object}
	 *
	 */
	this.getPreferences = function() {

		return settings;

	};

	/**
	 * getPreference returns a setting from the admin interface.
	 *
	 * @param {String} name
	 * @param {*}
	 *
	 */
	this.getPreference = function(name) {

		return settings[name];

	};

	/**
	 * setPreferences
	 *
	 * @param {Object} settings
	 *
	 */
	this.setPreferences = function(newSettings) {
		settings = newSettings;
		return this;

	};





	/**
	 * get
	 *
	 * @param {String} name
	 * @param {String} default
	 * @return {String}
	 *
	 */
	this.get = function(name, defult) {

		var s = env[name.toUpperCase()];

		if (!s)
			return defult;

		return s;

	};



};
