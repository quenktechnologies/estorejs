/**
 * This is the users module.
 * @module
 */

module.exports = {

	name: 'Customers Extension',
	type: 'composite',
	members: [require('./customer'), {
			type: 'controller',
			controller: require('./CustomerController')
		}
	]
};
