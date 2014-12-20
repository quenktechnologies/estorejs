module.exports = function MockCheckout() {
	return {
		customer: {
			email: 'test@test.dom'
		},
		address: {
			billing: {
                          name: {first:'Lasana', last:'Murray'},
				company: 'Happy Test Company',
				street1: 'Somewhere between',
				street2: 'here and there',
				country: 'Trinidad and Tobago',
				city: 'Mausica',
				phone: '1111111111'
			},
			shipping: {
                          name: {first:'Lasana', last:'Murray'},
				company: 'Happy Test Company',
				street1: 'Somewhere between',
				street2: 'here and there',
				country: 'Trinidad and Tobago',
				city: 'Mausica',
				phone: '1111111111'
			}
		},
		workflow: 'cod'
	};

};
