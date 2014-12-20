module.exports = function Mock() {
	return {
		"isFeatured": true,
		"price": 100.50,
		"name": "Mock Product",
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
