/**
 *
 *  Provides a cash on delivery gateway option.
 *
 */
module.exports = {

	type: 'gateway',
	workflow: 'cheque',
	key: 'cheque',
	label: 'Cheque/Money Order',
	value: 'Cheque/Money Order',
	settings: {
		run: function(list, types) {

			list.add('Cheque/Money Orders',{
				payments: {
					cheque: {
						active: {
							type: Boolean,
							default: true,
							label: 'Accept Cheque/Money Order payments?'
						},
						content: {
							type: types.Markdown,
							label: 'Instructions to customers',
							dependsOn: {
								'payments.cheque.active': true
							}
						}
					}
				}
			});





		}
	},

	checkout: require('./checkout')



};
