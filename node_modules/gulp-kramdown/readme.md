## gulp-kramdown [![build][b-build]][x-travis][![NPM version][b-version]][gulp-kramdown]

> Kramdown to HTML with [kramed][kramed]
> adapted from [sindresorhus/gulp-markdown][gulp-markdown]

If you have an issue with the output report it on the marked [issue tracker][kramed-issues].

### usage

```js
var gulp = require('gulp');
var kramdown = require('gulp-kramdown');

gulp.task('default', function () {
	return gulp.src('doc.md')
		.pipe(kramdown())
		.pipe(gulp.dest('dist'));
});
```

### API

#### kramdown(options)

See the kramed [options](https://github.com/GitbookIO/kramed#options).

### install

```
$ npm install --save-dev gulp-kramdown
```

### license

The MIT License (MIT)

Copyright (c) 2015 Javier Carrillo

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

<!-- links -->

[x-travis]: https://travis-ci.org/stringparser/gulp-kramdown/builds
[b-build]: https://travis-ci.org/stringparser/gulp-kramdown.svg?branch=master
[b-version]: http://img.shields.io/npm/v/gulp-kramdown.svg?style=flat-square

[kramed]: https://github.com/GitbookIO/kramed
[gulp-markdown]: https://npmjs.com/gulp-markdown
[gulp-kramdown]: https://npmjs.com/gulp-kramdown
[kramed-issues]: https://github.com/GitbookIO/kramed/issues
