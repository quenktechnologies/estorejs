module.exports = {

	name: 'Bank Deposit Payments',
	key: 'bankDepositGateway',
	optional: true,
	controller: require('./BankDepositGateway'),
	settings: function(configs, types) {

		configs.bankAccountNumber = {

			type: types.Text,
			dependsOn: {
				'extensions.bankDepositGateway.enabled': true
			},
			label: 'Bank account number'


		};


	}


};
