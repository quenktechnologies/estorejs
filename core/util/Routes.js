/**
 * Routes for application routing.
 */

module.exports = {

	ajax: {

          checkout: {
            options: {
              countries :'/_/countries',
              gateways: '/_/payments/options',


            },
			transactions: '/_/checkout/transactions',
		},
                cart: {
                  items: {
                    all: '/_/cart/items',
                    item: /^\/_\/cart\/items\/([a-z0-9-])+$/,
                    count: '/_/cart/items/count',

                  }
			},
		products: {
			index: '/_/products',
			product: /^\/_\/products\/([a-z0-9-])$/,


		}


	},
	standard: {

		site: {
			index: '/'


		},
		store: {

			search: '/search',
			categories: {
                          //				all: /^\/products\/(?:\/([\d]{1,9999}))?$/,
                          all: '/categories/all',
				category: /^\/categories\/([\w]+(?:-[\w]+)*)$/,
				product: /^\/categories\/([\w]+(?:-[\w]+)*)\/products\/([\w]+(?:-[\w]+)*)$/,

			},
			products: {
				all: '/products',
				product: /^\/(products)\/([\w]+(?:-[\w]+)*)$/,

			}



		},
		pages: {

			index: '/pages',
			page: /^\/pages\/([\w]+(?:-[\w]+)*)$/,

		},
		cart: {
			index: '/cart',
			item: /^\/cart\/items\/([\w]+(?:-[\w]+)*)$/,

		},
		checkout: {

			index: '/checkout',
			success: /^\/checkout\/success\/([a-f\d-]{36})$/,
			error: '/checkout/error',
			hosted: {

			}


		},
		blog: {

			index: '/blog',
			post: /^\/blog\/posts\/([\w]+(?:-[\w]+)*)$/,

		},
		contact: {

			index: '/contact',
			success: '/success',
			error: '/error'

		},
		members: {
			signup: {
				index: '/signup',
				validate: '/signup/validate',
				activate: /^\/signup\/activate\/(\w+)/,
			},
			signin: {
				index: '/signin',
				dashboard: '/dashboard'
			},
			signout: {
				index: '/signout'

			}





		}


	}

};
