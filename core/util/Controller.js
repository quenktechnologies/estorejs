/**
 * Controller acts as the base object of all extensions.
 *
 * EStore is built to be extension (plugin) friendly from the start. All of the
 * internal route bindings are done via extensions and follow the same steps you would
 * take to include a 3rd party extension.
 *
 * The folder `extras/extensions` is scanned on startup for 3rd party extension code.
 * Controllers should be self contained in their individual folders and are expected to
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
 *     key:        // <String|Required>    The key name to be used in objects internally.
 *
 *     settings:   // <Function|Optional>  A function that is called to include the extensions's config in the
 *                                         Settings model. The function signature is function(settingsArray, fieldTypes).
 *
 *     optional:   // <Boolean|Optional>   If specified, the extension will only be activated if switched on via the
 *                                         admin ui.
 *
 *     default:    // <Boolean|Optional>   If optional is specified, this option will be the default status of the
 *                                         extension.
 *
 *     controller: // <Function|Required> This function is the actual extension. It will have it's prototype forced to
 *                                        the Controller object. All extensions are instantiated with a reference to
 *                                        the main EStore object.
 *
 *   }
 *
 *
 *
 * ```
 *
 * @class Controller
 * @param {Estore} store
 * @constructor
 *
 */
module.exports = function Controller(store) {

  /**
   * keystoneConfiguration is called during keystone configuration.
   *
   * @method keystoneConfiguration
   * @param {Object} config An object to be used to configure keystone.
   * @return 
   *
   */
  this.keystoneConfiguration = function () {



  };

	/**
	 * routeRegistration is called to setup routes.
	 *
	 * @method routeRegistration
	 * @param {Object} app
	 * @return
	 *
	 */
	this.routeRegistration = function(app) {



	};


	/**
	 * modelRegistration is called to setup models.
	 *
	 * @method modelRegistration
	 * @param {keystone} keystone
	 * @return
	 *
	 */
	this.modelRegistration = function(keystone) {



	};

	/**
	 * gatewayRegistration
	 *
	 * @method gatewayRegistration
	 * @return
	 *
	 */
	this.gatewayRegistration = function() {



	};






};
