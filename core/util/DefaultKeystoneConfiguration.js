/**
 * DefaultKeystoneConfiguration contains the default settings for keystone.
 * @class DefaultKeystoneConfiguration
 * @param {Theme} theme
 * @constructor
 *
 */
module.exports = function DefaultKeystoneConfiguration(theme) {
	return {

		'name': process.env.DOMAIN || 'Estore',
		'brand': process.env.DOMAIN || 'Estore',
		'auto update': true,
		'session': true,
		'session store': 'mongo',
		'auth': true,
		'cookie secret': process.env.COOKIE_SECRET,
		'view engine': 'html',
		'views': theme.getTemplatePath(),
		'static': theme.getStaticPath(),
		'emails': theme.getEmailPath(),
		'port': process.env.PORT || 3000,
		'mongo': process.env.MONGO_URI,
	};

};
