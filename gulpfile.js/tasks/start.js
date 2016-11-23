import gulp from 'gulp'
import exec from '../utils/exec'
import colors from 'colors/safe'
import runSequence from 'run-sequence'

gulp.task('start:docker', (cb) => exec('docker-compose up -d', '.', cb))
gulp.task('start:migrate', (cb) => exec('npm run migrate', 'models', cb))
gulp.task('start:www', (cb) => { exec('npm start', 'www'); cb() })

// Handle the graceful shutdown
gulp.task('start:death', () => {
  function exit (err) {
    if (err instanceof Error) console.log(`[${colors.red('error')}] ${err}`)
    console.log(`[${colors.yellow('status')}] exiting...`)
    exec('docker-compose down', '.', (err) => {
      if (err) console.log(`[${colors.red('error')}] ${err}`)
      process.exit()
    })
  }
  process.on('uncaughtException', exit)
  process.stdin.setRawMode(true)
  process.stdin.on('data', (b) => {
    if (b[0] === 3) { // Ctrl+C
      process.stdin.setRawMode(false)
      exit()
    }
  })
})

gulp.task('start', ['start:death'], (cb) => {
  runSequence(
    'start:docker',
    'start:migrate',
    'start:www',
    cb
  )
})
