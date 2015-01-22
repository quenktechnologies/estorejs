/**
 * FieldFactory provides field functions dynamically.
 * @param {Configuration} config
 * @constructor
 *
 */
function FieldFactory(config) {

	/**
	 * getSingleImage dynamically detects what field should be used for images
	 * and returns that.
	 * @return {Function}
	 */
	FieldFactory.prototype.getSingleImage = function(types) {

		if (config.get('IMAGES_USE_S3'))
			if (config.get('S3_KEY'))
				if (config.get('S3_SECRET'))
					if (config.get('S3_BUCKET'))
						return types.S3File;

		if (config.get('IMAGES_USE_CLOUDINARY') === true)
			if (config.get('CLOUDINARY_URL'))
				return types.CloudinaryImage;

		return types.Url;

	};


	/**
	 * getMultiImage dynamically provides the field for storing image
	 * arrays.
	 * @param {Object} types
	 * @return {Function}
	 */
        FieldFactory.prototype.getMultiImage = function(types) {

		if (config.get('IMAGE_USE_CLOUDINARY') === true)
			if (config.get('CLOUDINARY_URL'))
				return types.CloudinaryImages;

		return types.TextArray;


	};




}

module.exports = FieldFactory;
