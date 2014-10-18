exports.create = {

	Settings: [{

		site: {
			brand: 'Demo Brand'
		},
		about: {

			md: 'This is the default theme for EStore. It lives in the `themes/default` folder.'

		},
                system:{

                  imageStorage: 'url'


                },
		extensions: {

			productEndpoints: {
				enabled: true
			},
			cartEndpoints: {
				enabled: true
			},
			checkoutEndpoints: {
				enabled: true
			},
			bankDepositGateway: {
				enabled: true
			},


		}


	}]

};
