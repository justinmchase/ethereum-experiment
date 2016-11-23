
require('babel-core/register')({ presets: [ 'es2015' ] })
module.exports = require('./adapter').default
