/**
 * Extension acts as the base object of all extensions.
 *
 * EStore is built to be extension (plugin) friendly from the start. All of the
 * internal route bindings are done via extensions and follow the same steps you would
 * take to include a 3rd party extension.
 *
 * The folder `extras/extensions` is scanned on startup for 3rd party extension code.
 * Extensions should be self contained in their individual folders and are expected to
 * export a single object. That is `typeof require('myextension`) === 'object'`.
 *
 * That object is described below:
 *
 * ``` javascript
 *
 *   {
 *
 *     name:       // <String|Required>    The name/title of the extension. (example: 'Awesome Checkout')
 *
 *     settings:   // <Function|Optional>  A function that is called to include the extensions's config in the
 *                                         Settings model. The function signature is function(settingsArray, fieldTypes).
 *
 *     controller: // <Function|Required> This function is the actual extension. It will have it's prototype forced to
 *                                        the Extension object. All extensions are instantiated with a reference to
 *                                        the main EStore object.
 *
 *   }
 *
 *
 *
 * ```
 *
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

	/**
	 * onGatewayRegistration
	 *
	 * @method onGatewayRegistration
	 * @return
	 *
	 */
	this.onGatewayRegistration = function() {



	};






};
