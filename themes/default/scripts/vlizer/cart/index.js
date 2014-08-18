var app = angular.module('vlizer.cart', []);
app.factory('CartService', ['$http', require('./CartService')]);
