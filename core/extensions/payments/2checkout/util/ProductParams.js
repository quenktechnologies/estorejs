/**
 * ProductParams
 * @alias ProductParams
 * @memberOf core/extensions/payments/2checkout/util
 * @param {InvoiceHash} invoice
 * @param {Params} params
 * @constructor
 *
 */
module.exports = function ProductParams(invoice, params) {


	this.toObject = function() {

		var set = params.toObject();
		var count = 0;
		var li;

		invoice.items.forEach(function(item) {

			li = 'li_' + count + '_';
			set[li + 'type'] = 'product';
			set[li + 'name'] = item.name;
			set[li + 'quantity'] = item.quantity;
			set[li + 'price'] = item.price;
			set[li + 'tangible'] = (item.isTangible) ? 'Y' : 'N';

			count++;


		});

		if (invoice.charges.delivery) {
			set['li_' + count + '_type'] = 'delivery';
			set['li_' + count + '_price'] = invoice.charges.delivery;
		}

		return set;

	};


};
