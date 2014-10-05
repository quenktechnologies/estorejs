var Address = require('./Address');
var Table = require('easy-table');

module.exports = function(store) {

	var t = store.keystone.Field.Types;
	this.DEFAULT_COLUMNS = 'number, customer.email, payment.type, payment.status, total, createdAt';
	this.NAME = 'Invoice';
	var address = (new Address(store)).fields[0];

	this.options = {
		autoindex: true,
		nocreate: true,
		nodelete: true,
		track: true,
		map: {
			name: '_id'
		}
	};

	this.fields = ['Invoice', {

		number: {
			type: Number,
			unique: true,
			noedit: true,
			default: -1
		},
		date: {

			type: Date,
			noedit: true,
			width: 'short',
			default: Date.now

		},

		total: {

			type: t.Money,
			default: '0.00',
			noedit: true,
			width: 'short'
		}

	}, 'Customer', {
		customer: {
			email: {
				type: t.Email,
				label: 'Email',
				noedit: true,
				width: 'short'
			}
		},
	}, 'Billing Address', {
		address: {
			billing: address,
		}
	}, 'Shipping Address', {
		address: {
			shipping: address
		}
	}, 'Details', {
		_items: {
			type: t.Textarea,
			label: 'Items'
		},
	}, 'Payment', {
		payment: {
			id: {
				type: String,
				width: 'short',
                                label:'ID'

			},

			type: {
				type: String,
				noedit: true,
                                label:'Type',
				width: 'short'

			},
			workflow: {
				type: String,
                                hidden:true,
				width: 'short',
				noedit: 'true'
			},

			status: {
				type: t.Select,
				options: 'outstanding,paid,cancelled',
				default: 'outstanding'
			},

		},


	}];

	/**
	 * navigate
	 *
	 * @method navigate
	 * @param {Object} nav
	 * @return
	 *
	 */
	this.navigate = function(nav) {
		nav.sales = ['invoices', 'transactions'];

	};

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


			if (this.items) {

				var t = new Table();

				this.items.forEach(function(item, key) {

					t.cell('#', '[' + key + ']');
					t.cell('id', item._id);
					t.cell('name', item.name);
					t.cell('price', item.price);
					t.cell('quantity', item.quantity);
					t.cell('total', item.subtotal);
					t.newRow();

				});

				this._items = t.toString();


			}



			next();



		});


	};
};
