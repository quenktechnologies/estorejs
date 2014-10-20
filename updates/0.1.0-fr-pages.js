exports.create = {

	Page: [{

			title: "About",
			template: "pages/default.html",
			"content.md": "**Change this content ** [here](/keystone/pages/)"
		}, {

			title: "Frontpage",
			template: "pages/default.html",
			"content.md": "#E-Commerce with Nodejs and MongoDB\n" +
				"This page is marked as the index, so it's content " +
				"will be loaded. To change this go [here](/keystone/pages)",
			"index": true
		}

	]


};
