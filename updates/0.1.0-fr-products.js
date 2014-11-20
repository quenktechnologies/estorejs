exports.create = {
	Category: [{

			"name": "nokia",
			"isFeatured": true,
			"products": ["nokia"]
		}, {

			"name": "samsung",
			"isFeatured": true,
			"products": "samsung"

		}, {

			"name": "sony",
			"isFeatured": true,
			"products": "sony"

		}, {

			"name": "cases",
			"isFeatured": true,
			"products": ["case0", "case1"]

		}

	],
	Product: [{

			name: "galaxy phone X",
			price: "23.99",
			"image.url": "/assets/images/product1.jpg",
			"stock.sku": "gpx",
			"stock.balance": 100,
			"order.min": 1,
			"order.max": 3,
			isFeatured: true,
			keywords: ["samsung", "galaxy", "android", "phone", "smartphone", "test"],
			"description.short.md": "This product was created as a test.",
			"description.long.md": "This is the long description of this product.",
			__ref: "samsung"



		}, {

			name: "Nokia Phone Z",
			price: "13.99",
			"image.url": "/assets/images/product2.jpg",
			"stock.balance": 100,
			"order.min": 1,
			"order.max": 3,
			isFeatured: true,
			keywords: ["nokia", "cellphone", "phone", "smartphone", "test"],
			"description.short.md": "This product was created as a test.",
			"description.long.md": "This is the long description of this product.",
			__ref: "nokia"


		}, {

			name: "Generic Case",
			price: "5.25",
			"image.url": "/assets/images/product3.jpg",
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
			"description.long.md": "This is the long description of this product.",
			__ref: "case0"

		},

		{

			name: "Sony Phone R",
			price: "53.99",
			"image.url": "/assets/images/product4.jpg",
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
			"description.long.md": "This is the long description of this product.",
			"__ref": "sony"


		}, {

			name: "Very Generic Case",
			price: "15.25",
			"image.url": "/assets/images/product3.jpg",
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
			"description.long.md": "This is the long description of this product.",
			__ref: "case1"



		}
	]

};
