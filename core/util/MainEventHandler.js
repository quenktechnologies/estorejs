/**
 * MainEventHandler handles events for the main application.
 * @alias MainEventHandler
 * @param {EStore} store
 * @constructor
 *
 */
module.exports = function MainEventHandler(store) {



	/**
	 * handleEvents registers the handlers for the events.
	 *
	 *
	 */
	this.handleEvents = function() {

		store.addEventListener(store.CATEGORY_CREATED, this.onNewCategoryCreated);
		store.addEventListener(store.SETTINGS_CHANGED, this.onSettingsChanged);
		store.addEventListener(store.NOTIFICATION, this.onNotification);
	};


	/**
	 * onNewCategoryCreated
	 *
	 * @param {Object} category
	 *
	 */
	this.onNewCategoryCreated = function(category) {

		var _ = require('lodash');

		store.locals.categories = _.reject(store.locals.categories, {
			'name': category.name
		});

		store.locals.categories.push(category);

	};

	/**
	 * onSettingsChanged is called when the settings data has changed.
	 *
	 * @param {Object} settings The settings object.
	 *
	 */
	this.onSettingsChanged = function(settings) {
		store.settings = settings;
	};


	/**
	 * onNotification is called when we need to notify the site owner.
	 *
	 * @param {Notification} notice
	 *
	 */
	this.onNotification = function(notice) {

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
			notice.from = {
				name: 'EStore Alerts',
				email: 'no-reply@' + process.env.DOMAIN
			};
			store.broadcast(store.SEND_EMAIL, 'notification', notice, store);

		}).
		end(function(err) {

			if (err)
				console.log(err);

		});




	};



};
