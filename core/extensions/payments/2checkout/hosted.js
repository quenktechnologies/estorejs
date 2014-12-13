var TwoCheckout = require('./util/TwoCheckout');
var Handlers = require('../../../checkout/Handlers');

module.exports = {

	type: 'controller',
	name: '2Checkout Hosted',
	controller: function(store, dao, controllers, callbacks, config) {

		this.routeRegistration = function(app) {

			app.get(
				/^\/checkout\/success\/hosted\/[\w]{1,80}\/([\w]+)$/,
				this.onCustomerReturns);

			app.get(/^\/checkout\/success\/hosted\/[\w]{1,80}$/,
				this.onCustomerReturns);


		};
		this.onGetGateways = function(gateways) {

			gateways.card = this;

		};

		this.onGetPaymentOptions = function(options) {

			if (TwoCheckout.isHostedReady(config))
				options.push({
					label: 'Credit Card',
					value: 'card',
				});

		};
		this.checkout = function(ctx) {

			var tco = TwoCheckout.create({
				sellerId: config.get('TWO_CHECKOUT_SELLER_ID'),
				sandbox: (config.get('TWO_CHECKOUT_SANDBOX')) ? true : false
			});

			var link = tco.checkout.link(
				TwoCheckout.createParamsForHosted(ctx, config));

			console.log('DEBUG: Redirecting customer to ', link);
			ctx.callbacks.onRedirectNeeded(link);


		};

		/**
		 * onCustomerReturns
		 *
		 * @param {Request} req
		 * @param {Response} res
		 * @param {Function} next
		 */
		this.onCustomerReturns = function(req, res, next) {

			var debug = function() {
				console.log('DEBUG: ignoring failed validation for transaction ' +
					req.query.estorejs_ptid);
				next();
			};

			var tid = req.params[0] || req.query.estorejs_ptid;

			if (!TwoCheckout.verifyTwoCheckoutKey(req.query, config))
				return debug();

			if (!TwoCheckout.verifyEncryptedTID(
				req.query.estorejs_ptid,
				req.query.estorejs_etid,
				config))

				return debug();


			var handler =
				Handlers.
			createStandardCheckoutAssistantHandler(dao, req.session, callbacks, res, next);
			console.log('funk');
			dao.getDataModel('Transaction').
			findOne({
				tid: tid,
				status: 'created'
			}).
			exec(function(err, trn) {

				if (err) {
					console.log(err);
					return next();
				}

				if (!trn)
					return next();

				if (req.query.credit_card_processed === 'N')
					return handler.onTransactionDeclined(trn);

				if (req.query.credit_card_processed === 'Y')
					return handler.onTransactionApproved(trn);


				next();


			});

		};

	},

};
