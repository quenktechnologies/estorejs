require('dotenv')().load();
var Estore = require('./index');
var store = new Estore(require('keystone'));
store.start();
