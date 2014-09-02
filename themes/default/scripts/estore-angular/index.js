var app = angular.module('estore', []);

app.factory('CartService', ['$http', require('./services/CartService')]).
factory('PaymentService', ['$http', require('./services/PaymentService')]).
directive('esAddress', require('./components/address')).
directive('esCart', require('./components/cart')).
directive('esEmail', require('./components/email')).
directive('esPaymentSelect', require('./components/payment-select')).
directive('esAddToCart', require('./components/add-to-cart'));
