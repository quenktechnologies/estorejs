var Composite = require('./Composite');
/**
 * CompositeExtension makes managing multiple extensions easier.
 * @class CompositeExtension
 * @constructor
 *
 */
module.exports = function CompositeExtension() {

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
	 * @param {keystone} keystone
	 * @return CompositeExtension
	 *
	 */
	this.onModels = function(keystone) {
		this._callEach('onModels', keystone);
		return this;
	};




};

CompositeExtension.prototype = new Composite();
