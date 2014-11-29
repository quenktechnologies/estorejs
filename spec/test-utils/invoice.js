module.exports = function() {
	return {
		"payment": {
			"id": "",
			"type": "cod",
			"status": "outstanding"
		},
		"address": {
			"shipping": {
				"street1": "A street you know",
				"country": "Trinidad and Tobago",
				"city": "Port of Spain",
				"phone": "7777777",
				"name": {
					"first": "Mr.",
					"last": "Pork"
				}
			},
			"billing": {
				"street1": "A street you know",
				"country": "Trinidad and Tobago",
				"city": "Port of Spain",
				"phone": "7777777",
				"name": {
					"first": "Mr.",
					"last": "Pork"
				}
			}
		},
		"customer": {
			"email": "pork@donoteatanyham.edu"
		},
		"total": 0,
		"date": new Date("2014-11-28T14:28:59.165Z"),
		"items": [{
			"_id": "41224d776a326fb40f000001",
			"name": "galaxy phone X",
			"price": 23.99,
			"quantity": 1
		}]
	};
};
