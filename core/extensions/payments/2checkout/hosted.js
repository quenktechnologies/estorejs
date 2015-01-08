var TwoCheckout = require('./util/TwoCheckout');
var Checkout = require('../../../checkout/Checkout');

function TwoCheckoutHosted() {
	TwoCheckoutHosted.$parent.apply(this, arguments);
}

TwoCheckoutHosted.prototype.onRouteConfiguration = function(app) {

	app.get(/^\/checkout\/success\/hosted\/[\w]{1,80}\/([\w]+)$/,
		this.onCustomerReturns.bind(this));

	app.get(/^\/checkout\/success\/hosted\/[\w]{1,80}$/,
		this.onCustomerReturns.bind(this));


};

TwoCheckoutHosted.prototype.onGetGateways = function(gateways) {

	gateways.card = this;

};

TwoCheckoutHosted.prototype.onGetPaymentOptions = function(options) {

	if (TwoCheckout.isHostedReady(this.$config))
		options.push({
			label: 'Credit Card',
			value: 'card',
		});

};
TwoCheckoutHosted.prototype.checkout = function(ctx) {

	var tco = TwoCheckout.create({
		sellerId: this.$config.get('TWO_CHECKOUT_SELLER_ID'),
		sandbox: (this.$config.get('TWO_CHECKOUT_SANDBOX')) ? true : false
	});

	var link = tco.checkout.link(
		TwoCheckout.createParamsForHosted(ctx, this.$config));

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
TwoCheckoutHosted.prototype.onCustomerReturns = function(req, res, next) {

	var debug = function() {
		console.log('DEBUG: ignoring failed validation for transaction ' +
			req.query.estorejs_ptid);
		next();
	};

	var tid = req.params[0] || req.query.estorejs_ptid;

	if (!TwoCheckout.verifyTwoCheckoutKey(req.query, this.$config))
		return debug();

	if (!TwoCheckout.verifyEncryptedTID(
		req.query.estorejs_ptid,
		req.query.estorejs_etid,
		this.$config))

		return debug();


	var handler =
		Checkout.
	createStandardCallbacks(dao, req.session, this.$model, res, next);

	this.$data.getDataModel('Transaction').
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

module.exports = {

	type: 'controller',
	name: '2Checkout Hosted',
	controller: TwoCheckoutHosted
};
