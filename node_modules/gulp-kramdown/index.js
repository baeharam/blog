'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var kramed = require('kramed');

module.exports = function (options) {
 return through.obj(function (file, enc, cb) {
  if (file.isNull()) { cb(null, file); return; }
  if (file.isStream()) {
    var error = new gutil.PluginError({
      plugin: 'gulp-kramdown',
      message: 'Streaming not supported'
    });
    return cb(error);
  }

  kramed(file.contents.toString(), options, function (err, data) {
    if (err) {
      var error = new gutil.pluginError({
        plugin: 'gulp-kramdown',
        fileName: file.path
      });
      return cb(error);
    }

    file.contents = new Buffer(data);
    file.path = gutil.replaceExtension(file.path, '.html');

    cb(null, file);
  });
 });
};
