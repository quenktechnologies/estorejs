/**
 *
 *  Provides a cash on delivery gateway option.
 *
 */
module.exports = {

	type: 'gateway',
	workflow: 'bank',
	key: 'bank',
	label: 'Bank Transfer',
	value: 'Bank Transfer',
	settings: {
		run: function(list, types) {

			list.add('Bank Transfers',{
				payments: {
					bank: {
						active: {
							type: Boolean,
							default: true,
							label: 'Accept Bank Transfer Payments?'
						},
						content: {
							type: types.Markdown,
							label: 'Instructions to customers',
							dependsOn: {
								'payments.bank.active': true
							}
						}
					}
				}
			});





		}
	},

	checkout: require('./checkout')};
