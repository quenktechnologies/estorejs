var TwoCheckout = require('2checkout-node');

/**
 * TwoCheckoutGateway for TwoCheckout on Delivery transactions.
 * @class TwoCheckoutGateway
 *
 * @constructor
 *
 */
module.exports = function TwoCheckoutGateway(store) {

	var config = store.settings.extensions.twoCheckoutHosted;
	var tco = new TwoCheckout(config);

	var validate = function(string, hash) {

		return (hash === require('crypto').createHash('md5').update(string).digest('hex').toUpperCase());

	};

	//Helps ratifiy the trn number passed back
	var sumify = function(id, total, secret) {

		return require('crypto').
		createHash('md5').
		update(secret + 'x' + id + 'x' + id + 'x' + total + 'x' + id + 'x' + secret + 'x' + id + 'x' + secret).
		digest('hex').
		toUpperCase();

	};

	/**
	 * gatewayRegistration will register this gateway.
	 *
	 * @method gatewayRegistration
	 * @param {Gateways} gateways
	 * @return
	 *
	 */
	this.gatewayRegistration = function(gateways) {

		gateways.add({
			name: 'Credit/Debit Card',
			value: 'card'
		}, this);


	};


	/**
	 * routeRegistration
	 *
	 * @method routeRegistration
	 * @param {Express} app
	 * @return
	 *
	 */
	this.routeRegistration = function(app) {

		app.get('/checkout/success', function(req, res, next) {


			if (validate(config.secretWord + config.sellerId + req.query.order_number + req.query.total, req.query.key)) {

				var hash = sumify(req.query.merchant_order_id, req.query.total, config.secretWord);

				if (hash !== req.query.x_hash) {
					system.log.info('Invalid hash detected: ' + hash + ' does not match ' + req.query.x_hash);
					res.redirect(403, '/checkout/error');
				}

				var selected;

				req.session.pendingTransactions.forEach(function(trn, key) {

					if (trn.hash === hash) {
						selected = trn;
						req.session.pendingTransactions.splice(key, 2);

					}
				});

				if (!selected) {
					system.log.warn(
						'A transaction appears to have been processed' +
						'(or url was tampered with ) that we are not aware off! [BEGIN URL]',
						req.query, '[END URL]');
					return res.redirect('/checkout/error');

				}

				store.keystone.list('Transaction').model.findOne({
						_id: selected._id
					},
					function(err, trn) {

						if (err) {
							res.redirect(500, '/checkout/error');
							throw err;
						}

						if (!trn) {
							system.log.error('Transaction "' +
								selected._id + '" is not in the database!');
							res.redirect(500, '/checkout/error');

						}

						trn.set({
							invoice: {
								payment: {
									status: 'paid',
									type: 'card',
									id: req.query.order_number
								}
							}
						});

						store.ebus.emit(store.TRANSACTION_APPROVED, {
							transaction: trn,
							request: req,
							response: res
						});

						next();


					});





			} else {

				system.log.info('Payment failed with the following parameters: ', req.query);
				res.redirect('/checkout/error');


			}


		});



	};


	/**
	 * onCheckout
	 *
	 * @method onCheckout
	 * @param {Context} ctx
	 * @return
	 *
	 */
	this.onCheckout = function(ctx) {

		var params = {
			'mode': '2CO',
			'currency_code': 'USD',
			'merchant_order_id': '' + ctx.transaction._id,
			'purchase_step': 'payment-method',
			'pay_method': 'CC',
			'x_receipt_link_url': 'http://localhost:3000/checkout/success',
			'card_holder_name': ctx.transaction.invoice.address.billing.name.first + ' ' + ctx.transaction.invoice.address.billing.name.last,
			'street_address': ctx.transaction.invoice.address.billing.street1,
			'street_address2': ctx.transaction.invoice.address.billing.street2,
			'city': ctx.transaction.invoice.address.billing.region,
			'state': ctx.transaction.invoice.address.billing.state,
			'zip': ctx.transaction.invoice.address.billing.code,
			'country': ctx.transaction.invoice.address.billing.country,
			'email': ctx.transaction.invoice.customer.email,
			'phone': ctx.transaction.invoice.address.billing.phone,

			'ship_name': ctx.transaction.invoice.address.shipping.name.first + ' ' + ctx.transaction.invoice.address.shipping.name.last,
			'ship_street_address': ctx.transaction.invoice.address.shipping.street1,
			'ship_street_address2': ctx.transaction.invoice.address.shipping.street2,
			'ship_city': ctx.transaction.invoice.address.shipping.city,
			'ship_state': ctx.transaction.invoice.address.shipping.state,
			'ship_zip': ctx.transaction.invoice.address.shipping.code,
			'ship_country': ctx.transaction.invoice.address.shipping.country,


		};

		var prefix = 'li_';
		ctx.transaction.invoice.items.forEach(function(item, key) {

			prefix = prefix + key + '_';

			params[prefix + 'product_id'] = item._id;
			params[prefix + 'type'] = 'product';
			params[prefix + 'name'] = item.name;
			params[prefix + 'quantity'] = item.quantity;
			params[prefix + 'price'] = item.price;
			params[prefix + 'tangible'] = 'Y';


		});
		var ship = ctx.transaction.invoice.items.length;
		var hash = sumify(ctx.transaction._id, ctx.transaction.invoice.total, 'tango');

		params['li_' + ship + '_type'] = 'shipping';
		params['li_' + ship + '_price'] = '0.00';
		params.x_hash = hash;

		var selected = ctx.transaction.toObject();
		selected.hash = hash;

		ctx.request.session.pendingTransactions.push(selected);

		//		ctx.request.session.pendingTransactions.push({
		//			id: ctx.transaction._id,
		//			total: ctx.transaction.invoice.total,
		//			hash: hash
		//		});

		ctx.response.json(201, {
			paymentUrl: tco.checkout.link(params)
		});



	};

};
