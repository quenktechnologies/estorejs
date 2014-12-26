/* Ease the stress of testing with a god like util object.*/
require('dotenv')().load();

module.exports = {

	mocks: {

		invoice: require('./mocks/invoice'),
		modelExtension: require('./mocks/modelExtension'),
		item: require('./mocks/item'),
                checkout: require('./mocks/checkout'),
                product: require('./mocks/product'),

	},
	helpers: require('./helpers')

};
