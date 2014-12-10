/**
 * DefaultImageEngine
 * @class DefaultImageEngine
 * @constructor
 *
 */
module.exports = {

	type: 'engine',
	id: 'ImageEngine',
	name: 'S3 Image Engine',
	engine: function(store, types, config) {
		return {

			type: types.S3File,

		};
	}

};
