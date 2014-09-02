/**
 * Extension is the base object for all extensions.
 * @class Extension
 * @param {Estore} store
 * @constructor
 *
 */
module.exports = function Extension(store) {




	/**
	 * onRouting is called to setup routes.
	 *
	 * @method onRouting
	 * @param {Object} app
	 * @return
	 *
	 */
	this.onRouting = function(app) {



	};


	/**
	 * onModels is called to setup models.
	 *
	 * @method onModels
	 * @param {keystone} keystone
	 * @return
	 *
	 */
	this.onModels = function(keystone) {



	};





};
