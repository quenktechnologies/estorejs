require('dotenv')().load();

var keystone = require('keystone');
var app = require('express')();

require('./index')(app, keystone).start();
