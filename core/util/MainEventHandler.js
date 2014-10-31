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

		store.locals.categories = store.locals.categories || [];
		store.locals.categories.push(category);

	};





};
