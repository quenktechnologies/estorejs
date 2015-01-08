/**
 * @module
 */


/**
 * CartAssistantHandler is used to react to the various states operations
 * on the visitor's cart maybe in.
 *
 * @alias CartAssistantHandler
 * @interface
 */
function CartAssistantHandler() {}

/**
 * onProductOutOfStock is called when an attempt is made to add an item to cart that
 * we determine to be out of stock.
 *
 * @param {Product} product
 *
 */
CartAssistantHandler.prototype.onProductOutOfStock = function(product) {};


/**
 * onQuantityLessThanMin is called when an attempt is made to add less of an item
 * that is allowed.
 *
 * @param {Number} qty
 * @param {Number} min
 * @param {Product} product
 */
CartAssistantHandler.prototype.onQuantityLessThanMin = function(qty, min, product) {};

/**
 * onQuantityMoreThanMax is called when an attempt is made to add more of an item
 * that is allowed.
 *
 * @param {Number} qty
 * @param {Number} max
 * @param {Product} product
 *
 */
CartAssistantHandler.prototype.onQuantityMoreThanMax = function(qty, max, product) {};

/**
 * onItemCanBeAddedToCart is called when we determine it is safe to add the
 * item to the cart.
 *
 * @param {Item} item
 *
 */
CartAssistantHandler.prototype.onItemCanBeAddedToCart = function(item) {};


/**
 * onItemHasBeenRemoved is called when an item must be removed form the cart.
 *
 * @param {Item} item 
 */
CartAssistantHandler.onItemHasBeenRemoved = function () {};
