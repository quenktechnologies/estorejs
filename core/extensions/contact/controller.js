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

			contact.validate(function(err) {

				if (err) {
					res.locals.$errors = err;
					render('contact/index.html')(req, res, next);
					return;

				}

				contact.save(function(err, enquiry) {

					if (err) {
						console.log(err);
						return next();

					}

					res.redirect('contact/success');
					store.broadcast(store.NOTIFICATION, enquiry);

				});


			});


		};

	}


};
