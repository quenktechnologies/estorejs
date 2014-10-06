module.exports = {

	name: '2Checkout Hosted Payment Gateway',
	key: 'twoCheckoutHosted',
	optional: true,
	controller: require('./TwoCheckoutHostedCheckoutGateway'),
	settings: function(configs, types) {

		configs.sellerId = {

			type: types.Text,
			dependsOn: {
				'extensions.twoCheckoutHosted.enabled': true
			},
			label: 'Seller ID'


		};

		configs.secretWord = {
			type: types.Text,
			dependsOn: {
				'extensions.twoCheckoutHosted.enabled': true
			},
			label: 'Secret Word'

		};

		configs.sandbox = {

			type: Boolean,
			dependsOn: {
				'extensions.twoCheckoutHosted.enabled': true
			},
			label: 'Use sandbox',
			default: true

		};



	}


};
