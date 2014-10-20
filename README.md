
#EStore
**Note: This version will break apps based on prior versions.**

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/quenktechnologies/estore)

EStore is an ecommerce platform built to run in the 'cloud'. The main goal behind it is a platform that is easy to deploy as well as integrate with other other systems.

EStore is designed with the [12 factor](http://12factor.net) app in mind.

##Internals

EStore uses MongoDB for database, Mongoose for ODM and KeystoneJS for a default admin CMS.The template engine is Nunjucks with a few extra filters and extensions.

##Status

**Not quite ready yet!** You can experiment with it but the default theme is not quite usable yet. Documentation on creating themes has not been drafted either. At this point, if you deploy it you are on your own.

##Setup and Deployments

1. Download or clone the latest version of this repository.
2. Create a `0.1.0-settings.js` with basic information in the updates folder. A template exists in the docs folder.
3. Run npm install.
4. Configure your .env file or environment. At the very least, set your `MONGO_URI`.
5. Run `npm start`.

##Documentation

The docs folder contains some information on the apis provided and work to be done in future releases.

##Issues

Use the issue tracker.

Have fun!
