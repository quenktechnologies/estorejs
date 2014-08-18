/**
 * ErrorHandlerFactory generates error handlers.
 * @class ErrorHandlerFactory
 *
 * @constructor
 *
 */
module.exports = function ErrorHandlerFactory() {

	var self = {};


	/**
	 * create an error handler.
	 *
	 * @method create
	 * @param {Object} res
	 * @return
	 *
	 */
	self.create = function(res) {

		return {

			C: function(code, cb) {

				return function(err, data) {

					if (err)
						return res.send(code) && console.log(err);
                                        cb(data);

				};


			}

		};



	};



	return self;


};
