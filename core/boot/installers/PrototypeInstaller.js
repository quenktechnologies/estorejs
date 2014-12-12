/**
 * ProtoypeInstaller shares the common install method amongst other
 * installers.
 * @alias ProtoypeInstaller
 * @memberOf core/boot/installers
 */
module.exports = {

	setNext: function(next) {
		this.nextInstaller = next;
		return next;
	},
	next: function(ext) {
		if (this.nextInstaller)
			this.nextInstaller.install(ext);
	},
	install: function(ext) {

		if (ext.settings) {

			if (ext.settings.run)
				ext.settings.run.bind(ext);

			if (ext.settings.provide)
				ext.settings.provide.bind(ext);

			this.next({
				type: 'settings',
				settings: ext.settings
			});


		}

		if (this.hasOwnProperty(ext.type))
			return this[ext.type](ext);

		this.next(ext);
	}
};
