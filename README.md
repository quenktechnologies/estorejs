
![EStoreJS](http://estorejs.quenk.com/assets/images/logo.svg)
==============================

![Build Status](https://travis-ci.org/quenktechnologies/estorejs.svg)


[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/quenktechnologies/estorejs)

Run an eCommerce store in your cloud!

##Why EStoreJS?

EStoreJS started off as part of a bigger project to provide eCommerce related services
to businesses in Trinidad and Tobago. It's designed to be flexible and play nice with
third party applications and services.

##Current Status

EStoreJS is just about ready to run small, low traffic sites. It ships with a
default template to get you started. 

##Features

* KeystoneJS as an admin interface.
* Nunjucks for templating.
* Product and Category management.
* Invoice generation.
* Shopping Cart
* A MongoDB backend.

##Requirements

To run EStoreJS you will need to have [NodeJS](http://nodejs.org) installed and access to a [MongoDB](http://mongodb.org) server.
The deploy to Heroku button takes care of this for you though.

You should also have [git](http://gitscm.org) installed.

##Setup

If you do not want to deploy to Heroku, clone the master branch.
Be sure to either create a .env file or set the environment with the following:

* MONGO_URI - Include the database name at the end of the uri.
* COOKIE_SECRET - If not supplied will be generated internally each time app starts.

Once that is take care of run `npm install` then `npm start` to get your app going.

##Documentation

Working on it. For now, read the source!


##License
(The MIT License)
Copyright (c) 2015 Lasana Murray
Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:
The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[![forthebadge](http://forthebadge.com/badges/built-with-love.svg)](http://forthebadge.com)

