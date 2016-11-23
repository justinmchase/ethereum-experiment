import { ALL_TABLES } from '../tables'

export function migrate (adapter, done) {
  adapter.createTables(ALL_TABLES, (err) => {
    if (err) console.error(err)
    done(err)
  })
}

export function rollback (adapater, done) {
  adapater.deleteTables(ALL_TABLES, done)
}
