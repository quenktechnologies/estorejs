require('dotenv')().load();
var store = new require('./index')(require('keystone'));
store.start();
