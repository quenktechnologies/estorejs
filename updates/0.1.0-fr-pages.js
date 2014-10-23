exports.create = {

	Page: [{

			title: "About",
			template: "pages/default.html",
			"content.md": "**Change this content ** [here](/keystone/pages/)"
		}, {

			title: "Frontpage",
			template: "pages/default.html",
			"content.md": "##Welcome!\n" +
				"If you are seeing this, you install of E-Store " +
				"should be working!\n\n Pat yourself on the back, " +
				"you deserve it! There is more " +
				"to be done however! Start by logging into " +
				"[keystone](/keystone) and editing the content " +
				"of this page.\n\n" +
				"<a href=\"/keystone\" target=\"_blank\" class=\"btn btn-danger" +
				"\">Log in</a>",
			"isIndex": true
		}

	]


};
