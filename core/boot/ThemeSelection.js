/**
 * ThemeSelection is a container for the available themes.
 * @alias ThemeSelection
 * @memberOf  core/boot
 *
 * @constructor
 *
 */
module.exports = function ThemeSelection() {

	var themes = [];

	/**
	 * add a themeto the selection.
	 *
	 * @param {ThemeHash} theme
         * @return {ThemeSelection}
	 *
	 */
	this.add = function(theme) {

		themes.push(theme);

		return this;

	};

        /**
         * getSelection returns a list of themes available.
         * @return {Array}
         */
        this.getSelection = function () {

          return themes;

        };





};
