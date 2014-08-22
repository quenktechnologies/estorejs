/**
 * Subscription is sugar for calling an objects method as the result of an event.
 * @class Subscription
 *  * @param {EventEmitter} em
 * @constructor
 *
 */
module.exports = function Subscription(em) {


	/**
	 * on is a wrapper for EventEmitter.prototype.on.
	 *
	 * @method on
	 * @param {String} evt The event to subscribe to.
	 * @param {String} meth The method name.
	 * @param {Object} target The object the method will be called on.
	 * @return
	 *
	 */
	this.on = function(evt, meth, target) {

		em.on(evt, target[meth].bind(target));
                return this;

	};


        /**
         * once is a wrapper around EventEmitter.prototype.once
         *
         * @method once
	 * @param {String} evt The event to subscribe to.
	 * @param {String} meth The method name.
	 * @param {Object} target The object the method will be called on.
         * @return 
         *
         */
        this.once = function (evt, meth, target) {

		em.once(evt, target[meth].bind(target));
                return this;


        };




};
