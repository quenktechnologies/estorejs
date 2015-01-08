module.exports = function Mock() {
	return {
		"_id": "41224d776a326fb40f000001",
                "uuid": "412-24d776a326-fb40f-000001",
		"isFeatured": true,
		"price": 100.50,
		"name": "Mock Product",
		"slug": "mock-product",
		"order": {
			"hasConstraints": false,
			"max": 9999,
			"min": 1
		},
		"stock": {
			"sku": "mock",
			"balance": 10000,
		},
		"image": {
			"url": "/assets/images/mockProduct.jpg"
		},
		"isTangible": true,
		"keywords": [
			"mock",
			"product",
		],
	};
};
