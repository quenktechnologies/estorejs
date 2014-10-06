/**
 * APIServer is the base type of the route controllers.
 * @class APIServer
 * @constructor
 *
 */
module.exports = function APIServer(store) {

	/**
	 * systemError provides a fucntion that  is called when a system level error occurs.
	 *
	 * A database query throws an exception for example.
	 *
	 * @method onSystemError
	 * @param {Response} res
	 * @param {Error} err
	 * @return {Function}
	 *
	 */
	this.systemError = function(res) {

          return function (err) {
		res.send(store.SYSTEM_ERROR_STATUS);
          };

	};




};
