
![EStoreJS](http://estorejs.quenk.com/assets/images/logo.svg)
==============================

![Build Status](https://travis-ci.org/quenktechnologies/estorejs.svg)

EStoreJS is a [12 factor](http://12factor.net) app for running cloud backed
eCommerce stores.

You can deploy an instance to Heroku by using the button below:
[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/quenktechnologies/estorejs)

##Why EStoreJS?

EStoreJS started off as part of a bigger project to provide eCommerce related services
to businesses in Trinidad and Tobago. Its design is influenced by both the current state of technology adoption in T&ampl;T and a need to be flexible.

##Current Status

EStoreJS is just about ready to run small, low traffic sites. It ships with a
default template which may have a few bugs (please file them).

Documentation is lacking however and will be the main focus along with 
deciding on a concrete extension API come `0.2.11`.

##Setup and Deployments

If you do not want to deploy to Heroku, you can clone the master branch.
Be sure to either create a .env file or set the environment with the following:

* MONGO_URI - Maybe set depending on your host.
* COOKIE_SECRET - A secure random string of characters used in signing cookies.

Once that is take care of run `npm install` then `npm start` to get your app going.

Check back for more documentation in the future!

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

