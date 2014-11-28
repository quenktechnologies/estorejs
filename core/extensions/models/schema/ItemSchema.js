
/**
 * ItemSchema 
 * @class ItemSchema
 * @param {EStore} store
 * @param {Object} types
 * @param {UIFactory} ui
 * @constructor
 *
 */
module.exports = function ItemSchema (store, types, ui) {

  return {

		name: {
			type: String,
			required: true,
		},
		quantity: {
			type: Number,
			min: 1,
			max: 9999999,
			required: true
		},
		price: {
			type: types.Money,
			required: true,
		},
		image: {
			type: types.Url
		}
	};

};
