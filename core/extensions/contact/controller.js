var _ = require('lodash');
/**
 *
 * @alias ContactController
 * @param {EStore} store
 * @constructor
 * @extends {Controller}
 *
 */
function ContactController() {

	ContactController.$parent.apply(this, arguments);

}

ContactController.prototype.onRouteConfiguration = function(app) {


	app.get(this.$routes.standard.contact.index,
		this.render('contact/index.html'));

	app.get(this.$routes.standard.contact.success,
		this.render('contact/success.html'));

	app.post(this.$routes.standard.contact.index,
		this.onContactEnquiryRequest.bind(this));

	this.$store.addEventListener(this.$store.ENQUIRY,
		this.onEnquiry.bind(this));

};


/**
 * onContactEnquiryRequest is called when a visitor posts a new enquiry.
 *
 * @instance
 * @param {external:Request} req
 * @param {external:Response} res
 * @param {Function} next
 */
ContactController.prototype.onContactEnquiryRequest = function(req, res, next) {

	var contact = this.$data.getDataModel('Enquiry', true, req.body);

	contact.save(function(err, enquiry) {

		if (err) {
			console.log(err);
			res.locals.$errors = err;
			res.render('contact/index.html');
			return next();
		}

		res.redirect('contact/success');
		this.$store.broadcast(this.$store.ENQUIRY, enquiry);



	});


};

/**
 * onEnquiry sends the message to the site owner.
 *
 * @param {Notification} notice
 *
 */
ContactController.prototype.onEnquiry = function(notice) {

	this.$data.getDataModel('User').
	find({
		'notices': {
			$in: [notice.type]
		}
	}).
	limit(5).
	exec().
	then(function(users) {

		notice.to = _.pluck(users, 'email');

		if (notice.to.length < 1)
			return;

		notice.from = {
			name: notice.name.full,
			email: notice.email
		};

		this.$store.broadcast(store.SEND_EMAIL, 'enquiry', notice, this.$store);

	}).
	end(function(err) {

		if (err)
			console.log(err);

	});




};
module.exports = {

	type: 'controller',
	name: 'ContactController',
	controller: ContactController

};
