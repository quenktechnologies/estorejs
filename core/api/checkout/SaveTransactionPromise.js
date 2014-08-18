
/**
 * SaveTransactionPromise promise for saving transactions.
 * @class SaveTransactionPromise
 * @param {Transaction} model 
 * @constructor
 *
 */
module.exports = function SaveTransactionPromise (model) {

	return require('q').ninvoke(model, 'save').
	catch (function(err) {

		system.log.error(err);

	});


};

