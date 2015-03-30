/*
 * grunt-bosonic
 * https://github.com/bosonic/grunt-bosonic
 *
 * Copyright (c) 2013 Raphaël Rougeron
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path'),
    transpiler = require('../lib/transpiler');

module.exports = function (grunt) {

    grunt.registerMultiTask('bosonic', 'A Grunt task that transpiles to-the-spec Web Components into polyfilled JavaScript', function () {
        var css = [], js = [];
        var done = this.async();
        var async = require('async');

        var jobs = [];

        this.filesSrc.forEach(function (filepath) {
            var fileDir = path.dirname(filepath);

            jobs.push(function (cb) {
                transpiler.transpile(grunt.file.read(filepath), function (err, transpiled) {
                    transpiled.stylesheets.forEach(function (href) {
                        css.push(grunt.file.read(fileDir + '/' + href));
                    });
                    css.push(transpiled.css);
                    transpiled.scripts.forEach(function (src) {
                        js.push(grunt.file.read(fileDir + '/' + src));
                    });
                    js.push(transpiled.js);
                    cb(err);
                });
            });
        });

        var _this = this;
        async.series(jobs, function (err, result) {
            var jsFile = _this.data.js,
                cssFile = _this.data.css;
            grunt.file.write(jsFile, js.join("\n"));
            grunt.file.write(cssFile, css.join("\n"));
            done(err);
        });
    });

}

