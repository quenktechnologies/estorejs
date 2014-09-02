/**
 * Item model for items from the cart.
 * @class Item
 *
 * @constructor
 *
 */
module.exports = function Item(store) {

	var t = store.keystone.Field.Types;

	this.NAME = 'Items';
	this.options = {
		hidden: true,
		nocreate: true
	};

	this.fields = [{

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
			type: t.Money,
			required: true,
		},
		image: {
			type: t.Url
		}
	}];




};
