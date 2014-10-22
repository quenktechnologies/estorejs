/**
 * UIFactory is an factory object used to keep the keystone field elements
 * somewhat DRY.
 * @class UIFactory
 * @param {Object} types The keystone.Field.Types object.
 * @constructor
 *
 */
module.exports = function UIFactory(types) {

	var _cons = function(opts) {

		opts = opts || {};
		var o = {};

		if (opts.label)
			o.label = opts.label;

		if (opts.required)
			o.required = true;

		if (opts['default'])
			o['default'] = opts['default'];

		return o;

	};

	/**
	 * PageContentEditor returns a definition object for a large markdown input.
	 *
	 * @method MarkDownEditor
	 * @return
	 *
	 */
	this.PageContentEditor = function() {

		var o = _cons.apply(arguments);

		o.type = types.Markdown;
		o.height = 400;
		o.wysiwyg = true;
		return o;

	};


	/**
	 * TextBox
	 *
	 * @method SmallTextArea
	 * @return
	 *
	 */
	this.TextBox = function() {

		var o = _cons(arguments);
		o.type = types.Textarea;
		o.width = 'medium';

		return o;

	};


	/**
	 * TextField
	 *
	 * @method TextField
	 * @return
	 *
	 */
	this.TextField = function(label) {

		var o = _cons(arguments);
		o.type = String;
		o.width = 'medium';
		return o;

	};






};
