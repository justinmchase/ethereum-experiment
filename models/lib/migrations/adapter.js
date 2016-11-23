import path from 'path'
import debug from 'debug'
import vogels from 'vogels'
import Joi from 'joi'
import eachSeries from 'async/eachSeries'
import { config } from './configuration'

let log = debug('models')
let Migration = vogels.define('Migration', {
  hashKey: 'name',
  timestamps: true,
  schema: {
    name: Joi.string()
  },
  indexes: [{
    name: 'MigrationIndex',
    hashKey: 'name',
    type: 'global'
  }]
})

export default function Adapter (params) {
  this.params = params || {}
  this.config = config
}

Adapter.prototype.getTemplatePath = function () {
  return path.join(__dirname, this.params.migrationFile || 'template.js')
}

Adapter.prototype.connect = function (callback) {
  log('Adapter.connect')
  let DynamoDB = vogels.AWS.DynamoDB
  let awsConfig = config.get('aws:dynamo')
  vogels.dynamoDriver(new DynamoDB(awsConfig))

  Migration.describeTable((err, table) => {
    if (!err) return callback(null, this) // migration table exists
    if (err && err.name !== 'ResourceNotFoundException') return callback(err)
    log(`Creating table [Migration]`)
    Migration.createTable((err) => {
      if (err) throw err
      callback(null, this)
    })
  })
}

Adapter.prototype.disconnect = function (callback) {
  callback()
}

Adapter.prototype.getExecutedMigrationNames = function (callback) {
  log('Adapter.getExecutedMigrationNames')
  Migration
    .scan()
    .loadAll()
    .exec((err, result) => {
      if (err && err.code === 'ResourceNotFoundException') return callback(null, [])
      if (err) return callback(err)
      var names = result.Items.map(i => i.get('name'))
      callback(null, names)
    })
}

Adapter.prototype.markExecuted = function (name, callback) {
  log('Adapter.markExecuted', name)
  var data = {
    name: name
  }
  Migration.create(data, function (err) {
    if (err) return callback(err)
    callback()
  })
}

Adapter.prototype.unmarkExecuted = function (name, callback) {
  log('Adapter.markExecuted', name)
  Migration.destroy(name, callback)
}

Adapter.prototype.verifyTable = function (table, tries, callback) {
  log('  verifying...')
  table.describeTable((err, t) => {
    if (err && err.code === 'ResourceNotFoundException') return callback()
    if (err) return callback(err)
    switch (t.Table.TableStatus) {
      case 'DELETING':
      case 'CREATING':
        return setTimeout(() => this.verifyTable(table, tries, callback), 1000 * tries++)
      case 'ACTIVE':
        return callback(null, table)
      default:
        let e = new Error('Error verifying table')
        e.table = t
        return callback(e)
    }
  })
}

Adapter.prototype.createTables = function (tables, callback) {
  let adapter = this
  function createTable (table, callback) {
    let name = table.tableName()
    table.describeTable((err, t) => {
      if (!err) return callback(null, table)
      if (err && err.name !== 'ResourceNotFoundException') return callback(err)
      log(`Creating table [${name}]`)
      table.createTable(err => {
        if (err) return callback(err)
        adapter.verifyTable(table, 0, callback)
      })
    })
  }

  eachSeries(tables, createTable, callback)
}

Adapter.prototype.deleteTables = function (tables, callback) {
  let adapter = this
  function deleteTable (table, callback) {
    let name = table.tableName()
    table.describeTable(err => {
      if (err && err.code === 'ReourceNotFoundException') return callback() // already deleted
      if (err) return callback(err)
      log(`Deleting table [${name}]`)
      table.deleteTable(err => {
        if (err) return callback(err)
        adapter.verifyTable(table, 0, callback)
      })
    })
  }

  eachSeries(tables, deleteTable, callback)
}
