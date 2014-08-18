require('../lib/angular');
require('../vlizer');
require('../templates');
require('../product');
require('../cart');
require('../checkout');

var app = angular.module('seller', ['seller.product', 'seller.cart', 'seller.checkout']);

app.factory('EventEmitter', [require('events').EventEmitter]);
angular.element(document).ready(function() {

	angular.bootstrap(document, ['seller']);

});
