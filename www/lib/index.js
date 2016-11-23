import initialize from './initialize'

initialize((err, results) => {
  if (err) return console.error(require('util').inspect(err))

  console.log('initialized...')
})
