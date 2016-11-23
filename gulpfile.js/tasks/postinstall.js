import gulp from 'gulp'
import exec from '../utils/exec'

gulp.task('postinstall:www', (cb) => exec('npm install', 'www', cb))
gulp.task('postinstall:docker', (cb) => exec('docker-compose build', '.', cb))

gulp.task('postinstall', [
  'postinstall:www',
  'postinstall:docker'
])
