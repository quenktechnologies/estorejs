/**
 * DefaultImageEngine
 * @class DefaultImageEngine
 * @constructor
 *
 */
module.exports = {

	type: 'engine',
	id: 'ImageEngine',
	name: 'CloudinaryImage Image Engine',
	engine: function(store, types) {

		return {

			type: types.CloudinaryImage,
			autoCleanup: true

		};

	}

};
