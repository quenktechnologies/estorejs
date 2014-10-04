var Composite = require('./Composite');
/**
 * CompositeExtension makes managing multiple extensions easier.
 * @class CompositeExtension
 * @constructor
 *
 */
module.exports = function CompositeExtension() {

	var add = this.add.bind(this);

	/**
	 * add an extension to the system.
	 *
	 * Before an extension is added, information about is taken an added to the
	 * settings model.
	 *
	 * @method add
	 * @param {Extension} ext
	 * @return
	 *
	 */
	this.add = function(ext) {
		add(ext);

	};


	/**
	 * routeRegistration
	 *
	 * @method routeRegistration
	 * @param {Object} app
	 * @return CompositeExtension
	 *
	 */
	this.routeRegistration = function(app) {
		this._callEach('routeRegistration', app);
		return this;
	};

	/**
	 * gatewayRegistration
	 *
	 * @method gatewayRegistration
	 * @param {Array} gateways
	 * @return
	 *
	 */
	this.gatewayRegistration = function(gateways) {

		this._callEach('gatewayRegistration', gateways);
		return this;



	};



	/**
	 * modelRegistration
	 *
	 * @method modelRegistration
	 * @param {ModelRegistrar} reg
	 * @return CompositeExtension
	 *
	 */
	this.modelRegistration = function(reg) {
		this._callEach('modelRegistration', reg);
		return this;
	};




};

module.exports.prototype = new Composite();
