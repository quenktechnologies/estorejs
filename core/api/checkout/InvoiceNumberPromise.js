/**
 * InvoiceNumberPromise is a promise  used to get the next available invoice number.
 * @class InvoiceNumberPromise
 * @param {Counter} counter
 * @constructor
 *
 */
module.exports = function InvoiceNumberPromise(counter) {

	return require('q').ninvoke(counter, 'increase', 'invoices', 1).
	catch (function(err) {

		system.log.error('Cannot query counters! ', err);

	});






};
