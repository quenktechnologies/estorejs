exports.create = {

	Product: [{

			name: "Galaxy Phone X",
			price: "23.99",
			image: "/assets/images/product1.jpg",
			"stock.sku": "gpx",
			"stock.balance": 100,
			"order.min": 1,
			"order.max": 3,
			isFeatured: true,
			keywords: ["samsung", "galaxy", "android", "phone", "smartphone", "test"],
			"description.short.md": "This product was created as a test.",
			"description.long.md": "This is the long description of this product."



		}, {

			name: "Nokia Phone Z",
			price: "13.99",
			image: "/assets/images/product2.jpg",
			"stock.balance": 100,
			"order.min": 1,
			"order.max": 3,
			isFeatured: true,
			keywords: ["nokia", "cellphone", "phone", "smartphone", "test"],
			description: {
				short: "This product was created as a test.",
				long: {
					md: "This is the long description of this product",
					html: "This is the long description of this product"
				}
			}


		}, {

			name: "Generic Case",
			price: "5.25",
			image: "/assets/images/product3.jpg",
			"stock.balance": 100,
			"order.min": 1,
			"order.max": 3,
			isFeatured: true,
			keywords: ["case", "phones", "cellphone", "test"],
			order: {
				min: 1,
				max: 30
			},
			"description.short.md": "This product was created as a test.",
			"description.long.md": "This is the long description of this product."

		},

		{

			name: "Sony Phone R",
			price: "53.99",
			image: "/assets/images/product4.jpg",
			"stock.balance": 100,
			"order.min": 1,
			"order.max": 3,
			isFeatured: true,
			keywords: ["sony", "cellphone", "test"],
			order: {
				min: 1,
				max: 3
			},
			"description.short.md": "This product was created as a test.",
			"description.long.md": "This is the long description of this product."


		}, {

			name: "Very Generic Case",
			price: "15.25",
			image: "/assets/images/product3.jpg",
			"stock.balance": 100,
			"order.min": 1,
			"order.max": 3,
			isFeatured: true,
			keywords: ["case", "phones", "cellphone", "test"],
			order: {
				min: 1,
				max: 30
			},
			"description.short.md": "This product was created as a test.",
			"description.long.md": "This is the long description of this product."



		}
	]

};
