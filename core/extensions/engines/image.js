/**
 * DefaultImageEngine
 * @class DefaultImageEngine
 * @constructor
 *
 */
module.exports = {

	type: 'engine',
	id: 'ImageEngine',
	name: 'Default Image Engine',
	engine: function(store) {
		return {
			url: {
				type: store.keystone.Field.Types.Url,
				width: 'medium',
				label: 'Image URL',
			}
		};
	}

};
