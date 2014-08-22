module.exports = function(store) {

	var t = store.keystone.Field.Types;
	var noedit = (process.env.NODE_ENV == 'production');
	this.DEFAULT_COLUMNS = 'number, customer.name, total, status, createdOn';
	this.NAME = 'Invoice';

	this.options = {
		autoindex: true,
		nocreate: noedit,
		map: {
			name: 'number'
		}
	};

	this.fields = [require('./InvoiceFields')(t)];

	/**
	 * run
	 *
	 * @method run
	 * @param {List} list
	 * @return
	 *
	 */
	this.run = function(list) {

		list.schema.add({
			items: Array,
		});

		list.schema.pre('save', function(next) {

			var Big = require('bignumber.js');
			var total = Big(0);
			var csv = require('json2csv');

			this.items.forEach(function(item) {

				item.subtotal = Big(item.price).times(item.quantity).toString();
				total = total.plus(item.subtotal);


			});

			this.total = total.toString();

			csv({
				data: this.items,
				fields: ['name', 'price', 'quantity', 'stock.sku', 'subtotal']
			}, function(err, o) {

				if (err) next(err);
				this.csv = o;
				next();

			});



		});

	};
};
