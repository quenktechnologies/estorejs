/**
 *
 *  Provides a cash on delivery gateway option.
 *
 */
module.exports = {

	type: 'gateway',
	workflow: 'cod',
	key: 'cod',
	label: 'Cash On Delivery',
	value: 'Cash On Delivery',
	settings: {
		run: function(list, types) {

			list.add('Cash On Delivery', {
				payments: {
					cod: {
						active: {
							type: Boolean,
							default: true,
							label: 'Accept Cash On Delivery Checkouts?'
						},
						content: {
							type: types.Markdown,
							label: 'Instructions to customers',
							dependsOn: {
								'payments.cod.active': true
							}
						}
					}
				}
			});





		}
	},

	checkout: require('./checkout')
};
