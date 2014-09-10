var Composite = require('./Composite');
/**
 * CompositeExtension makes managing multiple extensions easier.
 * @class CompositeExtension
 * @constructor
 *
 */
module.exports = function CompositeExtension() {

	/**
	 * blacklist
	 *
	 * @property blacklist
	 * @type {Array}
	 */
	this.blacklist = [];

	var add = this.add.bind(this);

	/**
	 * add
	 *
	 * @method add
	 * @param {Extension} ext
	 * @return
	 *
	 */
	this.add = function(ext) {

		if (ext.blacklist)
			this.blacklist.push.apply(this.blacklist, ext.blacklist);

		add(ext);

	};


	/**
	 * onRouting
	 *
	 * @method onRouting
	 * @param {Object} app
	 * @return CompositeExtension
	 *
	 */
	this.onRouting = function(app) {
		this._callEach('onRouting', app);
		return this;
	};

	/**
	 * onGateways
	 *
	 * @method onGateways
	 * @param {Array} gateways
	 * @return
	 *
	 */
	this.onGateways = function(gateways) {

		this._callEach('onGateways', gateways);
		return this;



	};



	/**
	 * onModels
	 *
	 * @method onModels
	 * @param {ModelRegistrar} reg
	 * @return CompositeExtension
	 *
	 */
	this.onModels = function(reg) {
		this._callEach('onModels', reg);
		return this;
	};




};

module.exports.prototype = new Composite();
