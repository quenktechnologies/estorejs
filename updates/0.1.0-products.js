exports.create = {

	Product: [{

			name: 'Galaxy Phone X',
			price: '23.99',
			image: '/assets/images/product1.jpg',
			stock: {
				sku: 'gpx',
				balance: 100
			},
			order: {
				min: 1,
				max: 3
			},
			_keywords: 'samsung,galaxy,android,cellphone,phone,smartphone,test',
			description: {
				short: 'This product was created as a test.',
				long: {
					md: 'This is the long description of this product',
					html: 'This is the long description of this product'
				},
			}


		}, {

			name: 'Nokia Phone Z',
			price: '13.99',
			image: '/assets/images/product2.jpg',
			stock: {
				sku: 'npz',
				balance: 100
			},
			order: {
				min: 1,
				max: 3
			},
			_keywords: 'nokia,cellphone,phone,smartphone,test',

			description: {
				short: 'This product was created as a test.',
				long: {
					md: 'This is the long description of this product',
					html: 'This is the long description of this product'
				}
			}


		}, {

			name: 'Generic Case',
			price: '5.25',
			image: '/assets/images/product3.jpg',
			stock: {
				sku: 'gc1',
				balance: '100'
			},
			_keywords: 'case,phones,cellphone,test',
			order: {
				min: 1,
				max: 30
			},
			description: {
				short: 'This product was created as a test.',
				long: {
					md: 'This is the long description of this product',
					html: 'This is the long description of this product'
				}
			}


		},

		{

			name: 'Sony Phone R',
			price: '53.99',
			image: '/assets/images/product4.jpg',
			stock: {
				sku: 'spr',
				balance: 200
			},
			_keywords: 'sony,cellphone,test',
			order: {
				min: 1,
				max: 3
			},
			description: {
				short: 'This product was created as a test.',
				long: {
					md: 'This is the long description of this product',
					html: 'This is the long description of this product'
				},
			}


		}
	]

};
