/**
 * @module
 */

var _ = require('lodash');
var DocumentMethod = require('./DocumentMethod');
var ModelMethod = require('./ModelMethod');
var StaticMethod = require('./ModelMethod');
var FieldsMethod = require('./FieldsMethod');
var RunMethod = require('./RunMethod');

/**
 * sourceCompilerActions contains the steps involved in compiling a source.
 *
 * All of the methods here correspond to a field value for a sourceExtension.
 * @alias ModelCompilerActions
 * @param {Object} model The target result of the source being worked on.
 * @param {Array} stack A stack of functions to run.
 * @constructor
 *
 */
module.exports = function ModelCompilerActions(model, stack) {


	this.options = function(source) {
		model.options = model.options || {};
		_.merge(model.options, source.options);
	};

	this.navigation = function(source) {
		model.navigation = model.navigation || {};
		_.merge(model.navigation, source.navigation);
	};

	this.defaultColumns = function(source) {
		model.defaultColumns = source.defaultColumns;
	};

	this.model = function(source) {
		stack.push(new FieldsMethod(source.source));
	};

	this.methods = function(source) {
		stack.push(new DocumentMethod(source.methods));
	};

	this.statics = function(source) {
		stack.push(new StaticMethod(source.statics));
	};

	this.run = function(source) {
		stack.push(new RunMethod(source.run));
	};


};
