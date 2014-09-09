# grunt-debug-task

> Easily debug your Grunt tasks with node-inspector.

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-debug-task --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-debug-task');
```

## The "debug" task

Use `debug` task to debug other tasks.

For example to debug the `test` task run this:

```
grunt debug test
```

This starts [node-inspector](https://npmjs.org/package/node-inspector) and opens it in Google Chrome.

### Options

#### options.open
Type: `Boolean`
Default value: `true`

Set the `open` option to `false` to disable opening of the node-inspector interface in Google Chrome when task is run.

### Sample Configuration

```js
grunt.initConfig({
  debug: {
    options: {
      open: false // do not open node-inspector in Chrome automatically
    }
  },
});
```



