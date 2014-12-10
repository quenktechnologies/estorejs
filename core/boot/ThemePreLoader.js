var Directory = require('./Directory');

/**
 * ThemePreLoader loads the themes available for selection.
 *
 * The themes must be stored in theme folder and must be individual folders
 * themselves.
 * @alias ThemePreLoader
 * @memberOf core/boot
 * @param {ThemeSelection} selection
 * @constructor
 *
 */
module.exports = function ThemePreLoader(selection) {

	/**
	 * load the theme selection options from the specified path.
	 * @param {String} path
	 */
	this.load = function(path) {

		var themes = new Directory(path);
		themes.forEachDirectory(function(path, file) {

			selection.add({
				value: 'themes/' + file,
				label: file
			});

		}.bind(this));

	};

};
