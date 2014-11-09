/**
 * MainEventHandler handles events for the main application.
 * @class MainEventHandler
 * @param {EStore} store
 * @constructor
 *
 */
module.exports = function MainEventHandler(store) {



	/**
	 * handleEvents registers the handlers for the events.
	 *
	 * @method handleEvents
	 * @param {EventEmitter} em
	 * @return
	 *
	 */
	this.handleEvents = function(em) {

		em.on(store.CATEGORY_CREATED, this.onNewCategoryCreated);
                em.on(store.SETTINGS_CHANGED, this.onSettingsChanged);
	};


	/**
	 * onNewCategoryCreated
	 *
	 * @method onNewCategoryCreated
	 * @param {Object} category
	 * @return
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
	 * @method onSettingsChanged
	 * @param {Object} settings The settings object.
	 * @return
	 *
	 */
	this.onSettingsChanged = function(settings) {
		store.settings = settings;
		store._buildGatewayList();
	};



};
