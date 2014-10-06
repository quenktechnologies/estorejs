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
                        width:'medium',
			label: 'Bank account number'


		};


	}


};
