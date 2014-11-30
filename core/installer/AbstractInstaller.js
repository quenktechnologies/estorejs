/**
 * @module
 */

/** 
 *
 * AbstractInstaller is the interface for the objects that Installer
 * the extension components
 * of the system.
 * @abstract
 * @alias AbstractInstaller
 */
module.exports = {

	/**
	 *
	 * setNext assigns the next Installer in a chain.
	 * @param {Installer} next
         * @param {Installer} next 
	 *
	 */
	setNext: function(next) {
		this.next = next;
		return next;
	}

};
