/**
 * EventSubscription is sugar for calling an objects method as the result of an event.
 * @class EventSubscription
 * @param {String} evt The event to subscribe to.
 * @param {EventEmitter} em
 * @constructor
 *
 */
module.exports = function EventSubscription(evt, em) {


	/**
	 * subscribe sets up the method to be called when the event occurs.
	 *
	 * @method subscribe
	 * @param {String} meth The method name.
	 * @param {Object} target The object the method will be called on.
	 * @return
	 *
	 */
	this.subscribe = function(meth, target) {

		em.on(evt, target[meth].bind(target));

	};



};
