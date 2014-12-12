/**
 * ModelInstaller installs models.
 * @alias ModelInstaller
 * @memberOf core/boot/installers
 * @param {ModelCompiler} compiler
 * @constructor
 *
 */
module.exports = function ModelInstaller(compiler) {

	this.model = function(ext) {
		compiler.parse(ext);
	};


};
module.exports.prototype = require('./PrototypeInstaller');
