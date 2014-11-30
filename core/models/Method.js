/**
 *
 * Method interface represents methods that are applied
 * to the List during compilation.
 *
 */
function Method() {}

/**
 *
 * @param {String} name
 * @param {external:List} list
 * @param {external:keystone.Field.Types} types
 * @param {FieldFactory} fields
 * @param {EStore} store
 *
 */
Method.execute = function(name, list, types, fields, store) {};
