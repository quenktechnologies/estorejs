var app = angular.module('estore', []);
app.factory('CartService', ['$http', require('./services/CartService')]).
factory('ConfigService', ['$http', require('./services/ConfigService')]).
directive('esAddress', require('./components/address')).
directive('esText', require('./components/text')).
directive('esPhone', require('./components/phone')).
directive('esShoppingCart', require('./components/shopping-cart')).
directive('esCheckoutCart', require('./components/checkout-cart')).
directive('esEmail', require('./components/email')).
directive('esPaymentSelect', require('./components/payment-select')).
directive('esCartAdder', require('./components/cart-adder')).
directive('esCartCount', require('./components/cart-count'));
