/**
 * Installer is responsible for installing all the core models.
 * @class Installer
 * @constructor
 *
 */
module.exports = function Installer() {

	var self = {};


	/**
	 * install is called when it is time to install.
	 *
	 * @method install
	 * @param {Estore} store The main Estore object.
	 * @return
	 *
	 */
	self.install = function(store) {

		[require('./User')].forEach(function(Model) {

			var model = new Model(store);
			model.register();

		});




	};



	return self;


};
