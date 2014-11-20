/**
 * UIFactory is an factory object used to keep the keystone field elements
 * somewhat DRY.
 * @alias UIFactory
 * @param {Object} types The keystone.Field.Types object.
 * @constructor
 *
 */
module.exports = function UIFactory(types) {

	var _cons = function(opts) {
		opts = opts || {};
		return opts;

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
	this.TextField = function() {

		var o = _cons(arguments);
		o.type = String;
		o.width = 'medium';
		return o;

	};

	/**
	 * ShortTextField
	 *
	 * @method ShortTextField
	 * @return
	 *
	 */
	this.ShortTextField = function() {

		var o = this.TextField.apply(arguments);
		o.width = 'short';
		return o;
	};


	/**
	 * NumberField
	 *
	 * @method NumberField
	 * @param {Number} min
	 * @param {Number} max
	 * @return
	 *
	 */
	this.NumberField = function(min, max) {

		min = min || 1;
		max = max || 9999999999;

		var o = _cons(arguments[2]);
		o.min = min;
		o.max = max;
		o.type = Number;
		return o;

	};


	/**
	 * Selection
	 *
	 * @method Selection
	 * @param {Array} options
	 * @return
	 *
	 */
	this.Selection = function(options) {

		var o = _cons(arguments[1]);
		o.type = types.Select;
		o.options = options;

		return o;

	};

	/**
	 * PriceField
	 *
	 * @method PriceField
	 * @return
	 *
	 */
	this.PriceField = function() {

		var o = _cons(arguments[0]);
		o.type = types.Money;
		return o;

	};







};
