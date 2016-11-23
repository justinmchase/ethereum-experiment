require('babel-core/register')({ presets: [ 'es2015' ] })
require('require-dir')('./tasks', { recurse: true })

var gulp = require('gulp')
var gutil = require('gulp-util')

gulp.task('default', () => {
  throw new gutil.PluginError({
    plugin: 'default',
    message: 'Please specify a task.'
  })
})
