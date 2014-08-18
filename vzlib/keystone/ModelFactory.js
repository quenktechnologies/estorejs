/**
 * ModelFactory is a factory object for core models.
 * @class ModelFactory
 * @param {Object} keystone
 * @constructor
 *
 */
module.exports = function ModelFactory(keystone) {

	var self = {};


	/**
	 * get provides a model.
	 *
	 * @method get
	 * @param {String} name The name of the model registered with keystone.
	 * @return
	 *
	 */
	self.get = function(name, params) {
		return keystone.list(name).model;
	};

	/**
	 * create instantiates a new model.
	 *
	 * @method create
	 * @param {String} name
	 * @param {Mixed} params
	 * @return
	 *
	 */
	self.create = function(name, params) {

		var model = keystone.list(name);
		return new model.model(params);
	};



	return self;


};
