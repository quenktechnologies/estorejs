var Address = require('./Address');

module.exports = function(store) {

	var t = store.keystone.Field.Types;
	var noedit = (process.env.NODE_ENV == 'production');
	this.DEFAULT_COLUMNS = 'number, customer.name, total, status, createdOn';
	this.NAME = 'Invoice';
	var address = (new Address(store)).fields[0];

	this.options = {
		autoindex: true,
		track: true,
		nocreate: noedit,
		map: {
			name: 'number'
		}
	};

	this.fields = [{

		number: {
			type: Number,
			unique: true,
			noedit: true,
			default: -1
		},
		date: {

			type: Date,
			noedit: true,
			default: Date.now

		},
		total: {

			type: t.Money,
			default: "0.00",
			label: 'Total'
		},
		address: {
			billing: address,
			shipping: address
		},
		payment: {

			type: {
				type: String,
				options: 'cash',
			},
			id: {
				type: String,
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
		nav.sales = ['invoices'];

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

		list.schema.pre('save', function(next) {

			var Big = require('bignumber.js');
			var total = Big(0);
			this.items.forEach(function(item) {

				item.subtotal = Big(item.price).times(item.quantity).toString();
				total = total.plus(item.subtotal);


			});

			this.total = total.toString();


		});

	};
};
