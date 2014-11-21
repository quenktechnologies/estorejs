/**
 * @module
 */

module.exports = {

	type: 'controller',
	name: 'ContactController',

	/**
	 *
	 * @alias ContactController
	 * @param {EStore} store
	 * @constructor
	 * @extends {Controller}
	 *
	 */
	controller: function ContactController(store) {

		var render = store.getRenderCallback();

		this.routeRegistration = function(app) {


			app.get('/contact', render('contact/index.html'));
			app.get('/contact/success', render('contact/success.html'));
			app.post('/contact', this.onContactEnquiryRequest);

                        store.addEventListener(store.ENQUIRY, this.onEnquiry);

		};


		/**
		 * onContactEnquiryRequest is called when a visitor posts a new enquiry.
		 *
		 * @instance
		 * @param {external:Request} req
		 * @param {external:Response} res
		 * @param {Function} next
		 */
		this.onContactEnquiryRequest = function(req, res, next) {

			var contact = store.getDataModel('Enquiry', true, req.body);

			contact.save(function(err, enquiry) {

				if (err) {
					console.log(err);
					res.locals.$errors = err;
					render('contact/index.html')(req, res, next);
					return next();
				}

				res.redirect('contact/success');
				store.broadcast(store.ENQUIRY, enquiry);



			});


		};

		/**
		 * onEnquiry sends the message to the site owner.
		 *
		 * @param {Notification} notice
		 *
		 */
		this.onEnquiry = function(notice) {

			var _ = require('lodash');
			store.getDataModel('User').
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
				store.broadcast(store.SEND_EMAIL, 'enquiry', notice, store);

			}).
			end(function(err) {

				if (err)
					console.log(err);

			});




		};


	}


};
