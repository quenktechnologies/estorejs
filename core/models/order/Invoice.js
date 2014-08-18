module.exports = function() {

	var self = {};

	self.onKeyStoneReady = function(keystone) {

		var t = keystone.Field.Types;
		var noedit = (process.env.NODE_ENV == 'production');

		var Invoice = keystone.List('Invoice', {
			autoindex: true,
			nocreate: noedit,
			map: {
				name: 'number'
			}
		});

		Invoice.schema.add({
			items: Array,
		});

		Invoice.add('Invoice', require('./InvoiceBlock')(t));

		Invoice.schema.pre('save', function(next) {

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

		Invoice.addPattern('standard meta');
		Invoice.defaultColumns = 'number, customer.name, total, status, createdOn';
		Invoice.register();
	};
	return self;

};
