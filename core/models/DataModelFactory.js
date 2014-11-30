/**
 *
 * An interface that provides data models.
 * @interface
 */
function DataModelFactory() {}

/**
 *
 * getDataModel provides a data model.
 * @param {String} name
 * @param {Boolean} create Create a new instance?
 * @param {Object} args Arguments passed to the constructor.
 *
 */
DataModelFactory.prototype.getDataModel = function(name, create, args) {};
