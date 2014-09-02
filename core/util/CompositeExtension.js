var Composite = require('./Composite');
/**
 * CompositeExtension makes managing multiple extensions easier.
 * @class CompositeExtension
 * @constructor
 *
 */
module.exports = function CompositeExtension() {

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
