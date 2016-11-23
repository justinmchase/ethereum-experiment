import path from 'path'
import gutil from 'gulp-util'
import colors from 'colors/safe'
import { exec } from 'child_process'

export default function (cmd, dir, cb) {
  let pre = `[${colors.magenta(dir)}] `
  let print = (data) => {
    data = data
      .replace(/\n$/, '')
      .replace(/\n/g, `\n${pre}`)
    process.stdout.write(`${pre} ${data}\n`)
  }
  let child = exec(cmd, {
    cwd: path.join(process.cwd(), dir)
  })
  child.stdout.on('data', print)
  child.stderr.on('data', print)
  child.on('close', (code) => {
    let err = code === 0
      ? null
      : new gutil.PluginError('www', `Exited with code ${code}`)
    if (cb) cb(err)
  })
}
