var Table = require('easy-table');
var AddressSchema = require('./schema/AddressSchema');
var CustomerSchema = require('./schema/CustomerSchema');
var InvoiceSchema = require('./schema/InvoiceSchema');
var PaymentSchema = require('./schema/PaymentSchema');

module.exports = {

	type: 'model',
	name: 'Invoice',
	defaultColumns: 'number, customer.email, payment.type, payment.status, total, createdAt',
	options: {
		//	autoindex: true,
		nocreate: true,
		nodelete: true,
		track: true,
		map: {
			name: 'number'
		}
	},
	model: function(store, types, ui) {

		var invoice = new InvoiceSchema(store, types, ui);
		var address = new AddressSchema(store, types, ui);
		var customer = new CustomerSchema(store, types, ui);
		var payment = new PaymentSchema(store, types, ui);

		return ['Invoice',
			invoice,
			'Customer', {
				customer: customer
			},
			'Billing Address', {
				address: {
					billing: address,
				}
			}, 'Shipping Address', {
				address: {
					shipping: address
				}
			}, 'Items', {

				//			items: {
				//				type: types.ItemList
				//			}

			}, 'Payment', {
				payment: payment


			}, {

				items: {
                                  type: types.Table,
                                  hidden:true,
					columns: [{
						name: 'name'
					}, {
						name: 'quantity'
					}, {
						name: 'price'
					}, {
						name: 'subtotal'
					}]
				}

			}, {
				texty: types.TextArray
			}


		];

	},
	run: function(list, store, types) {

		list.schema.add({
			items: [store.keystone.list('Item').schema]
		});

		list.schema.methods.calculateTotals = function() {

			var Big = require('bignumber.js');
			var total = new Big(0);
			this.items.forEach(function(item) {

				item.subtotal = new Big(item.price).times(item.quantity).toString();
				total = total.plus(item.subtotal);


			});

			this.total = total.toString();

		};

		list.schema.pre('save', function(next) {
			this.calculateTotals();
			next();


		});

		list.schema.pre('save', function(next) {


			/**
			if (this.items) {

				var t = new Table();

				this.items.forEach(function(item, key) {

					t.cell('#', '[' + key + ')');
					t.cell('name', item.name);
					t.cell('price', item.price);
					t.cell('quantity', item.quantity);
					t.cell('total', item.subtotal);
					t.newRow();

				});

				this._items = t.toString();


			}**/



			next();



		});


	},

	navigation: {
		sales: ['invoices']
	}



};
