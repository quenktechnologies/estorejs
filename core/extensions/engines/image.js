/**
 * DefaultImageEngine
 * @class DefaultImageEngine
 * @constructor
 *
 */
module.exports = {

	type: 'engine',
	id: 'image',
	name: 'Default Image Engine',
	engine: function(store) {
			return {
				type: store.keystone.Field.Types.Url,
				width: 'medium',
				label: 'Image URL',
				default: require('./defaultImage'),
				collapse: true
			};
	}

};
